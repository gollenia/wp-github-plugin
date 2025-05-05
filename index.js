#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const extractPluginVersion = require('./modules/extractPluginVersion.js');
const setJsonVersion = require('./modules/setJsonVersion.js');
const { execSync } = require('child_process');
const tagAndPush = require('./modules/tagAndPush.js');

function safeExecute(fn, successMessage) {
	try {
		fn();
		console.log(successMessage);
	} catch (e) {
		console.error(`❌ Error: ${e.message}`);
	}
}

if (require.main === module) {
	let version = null;
	const shouldTag = process.argv.includes('--tag');
	console.log(process.argv);
	const input = process.argv[2];
	if (!input) {
		console.error('❌ You have to provide a path for the plugin.php file.\nExample: npx wp-github-plugin ./plugin.php');
		process.exit(1);
	}

	const pluginPath = path.resolve(process.cwd(), input);
	try {
		version = extractPluginVersion(pluginPath);
		console.log(`✅ Version: ${version}`);
	} catch (e) {
		console.error(`❌ Error: ${e.message}`);
		process.exit(1);
	}

	const files = ['package.json', 'composer.json'];

	files.forEach((file) => {
		safeExecute(() => setJsonVersion(file, version), `✅ ${file} updated`);
	});

	if (shouldTag) {
		console.log(`🔖 Tagging version ${version}...`);
		tagAndPush(version);
	}
}
