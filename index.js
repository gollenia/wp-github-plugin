#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

function extractPluginVersion(filepath) {
	if (!fs.existsSync(filepath)) {
		throw new Error(`File not found in: ${filepath}`);
	}

	const content = fs.readFileSync(filepath, 'utf-8');
	const match = content.match(/^\s*\*\s*Version:\s*(.+)$/im);
	if (!match) {
		throw new Error(`Version not found in: ${filepath}`);
	}

	return match[1].trim();
}

function setPackageVersion(version) {
	const packageJsonPath = path.join(process.cwd(), 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		throw new Error(`package.json not found in current directory: ${process.cwd()}`);
	}
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	packageJson.version = version;
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function setComposerVersion(version) {
	const composerJsonPath = path.join(process.cwd(), 'composer.json');
	if (!fs.existsSync(composerJsonPath)) {
		throw new Error(`composer.json not found in current directory: ${process.cwd()}`);
	}
	const composerJson = JSON.parse(fs.readFileSync(composerJsonPath, 'utf-8'));
	composerJson.version = version;
	fs.writeFileSync(composerJsonPath, JSON.stringify(composerJson, null, 2));
}

function safeExecute(fn, successMessage) {
	try {
		fn();
		console.log(successMessage);
	} catch (e) {
		console.error(`❌ Error: ${e.message}`);
	}
}

function tagAndPush(version) {
	try {
		const existingTags = execSync('git tag', { encoding: 'utf-8' }).split('\n');
		if (existingTags.includes(`v${version}`)) {
			console.log(`⚠️ Tag v${version} already exists. Skipping.`);
			return;
		}

		const filesToCommit = [];
		if (fs.existsSync('package.json')) filesToCommit.push('package.json');
		if (fs.existsSync('composer.json')) filesToCommit.push('composer.json');

		if (filesToCommit.length > 0) {
			execSync(`git add ${filesToCommit.join(' ')}`, { stdio: 'inherit' });
			execSync(`git commit -m "🔖 Release v${version}"`, { stdio: 'inherit' });
		} else {
			console.log('⚠️ No package.json or composer.json to commit.');
		}

		execSync(`git tag v${version}`, { stdio: 'inherit' });
		execSync(`git push origin v${version}`, { stdio: 'inherit' });

		console.log(`🚀 Git tag v${version} created and pushed.`);
	} catch (e) {
		console.warn(`⚠️ Git tagging failed: ${e.message}`);
	}
}

module.exports = { extractPluginVersion, setPackageVersion, setComposerVersion, tagAndPush };

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

	safeExecute(() => setPackageVersion(version), '✅ package.json updated');
	safeExecute(() => setComposerVersion(version), '✅ composer.json updated');
	if (shouldTag) {
		console.log(`🔖 Tagging version ${version}...`);
		tagAndPush(version);
	} else {
		console.log(`⚠️ Skipping git tagging. Use --tag to enable.`);
	}
}
