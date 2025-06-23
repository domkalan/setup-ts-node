#!/usr/bin/env node
const { execSync } = require("child_process");
const degit = require("degit");
const { unlinkSync } = require("fs");

const repo = "https://github.com/domkalan/ts-node-boilerplate";
const targetDir = process.argv[2] || ".";

console.log(`Scaffolding ts-node-boilderplate project in ${targetDir}...`);

const degitEmitter = degit(repo, { cache: false, force: true });

degitEmitter.clone(targetDir).then(() => {
    console.log("✅ Done! Your project has been created successfully.");
    console.log(`  Project located at: ${targetDir}`);

    // install dependencies
    console.log("Installing dependencies...");
    execSync('npm i', { cwd: targetDir });

    // remove the create.js script
    console.log("Removing the create.js script...");
    unlinkSync(`${targetDir}/create.js`);

    process.exit(0);
}).catch(err => console.error("❌ Error:", err));
