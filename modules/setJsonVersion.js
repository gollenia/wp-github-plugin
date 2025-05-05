import fs from 'fs';

function setJsonVersion(fileName, version) {
	const filePath = path.join(process.cwd(), fileName);
	if (!fs.existsSync(filePath)) {
		throw new Error(`${fileName} not found in current directory: ${process.cwd()}`);
	}
	const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	json.version = version;
	fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

export default setJsonVersion;
