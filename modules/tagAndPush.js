const fs = require('fs');
const { execSync } = require('child_process');

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

module.exports = tagAndPush;
