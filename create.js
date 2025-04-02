#!/usr/bin/env node
const { execSync } = require("child_process");
const degit = require("degit");

const repo = "https://github.com/domkalan/ts-node-boilerplate";
const targetDir = process.argv[2] || ".";

console.log(`Scaffolding ts-node-boilderplate project in ${targetDir}...`);

const degitEmitter = degit(repo, { cache: false, force: true });

degitEmitter.clone(targetDir).then(() => {
    console.log("✅ Done! Now run:");
    console.log(`  cd ${targetDir}`);
    console.log("  npm install");
    console.log("  npm start");

    execSync('npm i', { cwd: targetDir });

    process.exit(0);
}).catch(err => console.error("❌ Error:", err));
