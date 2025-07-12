#!/usr/bin/env node
const { execSync } = require("child_process");
const degit = require("degit");
const { unlinkSync } = require("fs");
const path = require("path");
const prompts = require('prompts');
const fs = require('fs');

const repo = "https://github.com/domkalan/setup-ts-node";

async function main() {
    try {
        // Create our first prompt, ask the project name
        const initalPrompt = await prompts({
            type: 'text',
            message: 'Enter a name for your new ts-node project:',
            name: 'name',
            validate: (text) => {
                return text !== '';
            }
        });

        // flatten the name
        const nameFlat = initalPrompt.name.replace(/ /g, '-').toLowerCase();

        // Create settings for secondary prompt so we can modify based on command call
        const secondaryPromptSettings = {
            type: 'text',
            message: 'Choose a directory to create the project in:',
            name: 'dir',
            initial: './'
        }

        // If we are running from npx, we should default to cwd
        if (process.argv0 !== 'npx') {
            secondaryPromptSettings.initial = path.resolve(path.join('./', nameFlat))
        }

        // Prompt the question where we are extracting
        const secondaryPrompt = await prompts(secondaryPromptSettings);

        console.log(`Scaffolding setup-ts-node project in ${secondaryPrompt.dir}...`);

        // Create the degit instance
        const degitInstance = degit(repo, { cache: false, force: true });

        // Standardize our project path
        const projectPath = path.resolve(secondaryPrompt.dir);

        // Clone the repo
        await degitInstance.clone(projectPath)

        // Cleanup package.json
        const packageFile = require('./package.json');

        packageFile.name = nameFlat;
        packageFile.description = `${nameFlat} created with setup-ts-node`;
        packageFile.bin = undefined;
        packageFile.repository = {};
        packageFile.author = '';
        packageFile.bugs.url = '';
        packageFile.homepage = '';
        packageFile.dependencies = [];
        packageFile.license = 'MIT';

        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageFile, null, 4));

        // Create clean reeadme
        const readMeContents = `# ${nameFlat}\n${nameFlat} created with setup-ts-node`
        
        fs.writeFileSync(path.join(projectPath, 'README.md'), readMeContents);

        // install dependencies
        console.log("Installing dependencies...");
        execSync('npm i', { cwd: projectPath });
        execSync('npm i --save-dev setup-ts-node', { cwd: projectPath });

        // Remove the create.js script
        unlinkSync(`${projectPath}/create.js`);

        // Remove the license
        unlinkSync(`${projectPath}/LICENSE`);

        // Done!
        console.log(`✅ Done! Your project has been created successfully. Located at: ${projectPath}`);

        process.exit(0);
    } catch(error) {
        console.error("❌ Error:", error);

        process.exit(1);
    }
}

main()