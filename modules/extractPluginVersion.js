const fs = require('fs');

function extractPluginVersion(filepath) {
	if (!fs.existsSync(filepath)) {
		throw new Error(`File not found in: ${filepath}`);
	}

	const content = fs.readFileSync(filepath, 'utf-8');

	const isCss = filepath.endsWith('.css');
	const match = content.match(isCss ? /^\s*Version:\s*(.+)$/im : /^\s*\*\s*Version:\s*(.+)$/im);

	if (!match) {
		throw new Error(`Version not found in: ${filepath}`);
	}

	return match[1].trim();
}

module.exports = extractPluginVersion;
