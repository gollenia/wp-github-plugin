const fs = require('fs');
const path = require('path');

function setJsonVersion(fileName, version) {
	const filePath = path.join(process.cwd(), fileName);
	if (!fs.existsSync(filePath)) {
		throw new Error(`${fileName} not found in current directory: ${process.cwd()}`);
	}
	const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	json.version = version;
	fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

module.exports = setJsonVersion;
