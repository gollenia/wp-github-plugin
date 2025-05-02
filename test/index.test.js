const path = require('path');
const fs = require('fs');
const { extractPluginVersion, setPackageVersion } = require('../index');

test('Liest Version korrekt aus plugin.php', () => {
  const testFile = path.resolve(__dirname, 'plugin.php');
  const version = extractPluginVersion(testFile);
  expect(version).toBe('1.0');
});

test('setzt package.json Version', () => {
  const testFile = path.resolve(__dirname, 'plugin.php');
  const version = extractPluginVersion(testFile);
  setPackageVersion(version);
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs
	.readFileSync(packageJsonPath, 'utf-8'));
	  expect(packageJson.version).toBe(version);
	    // Clean up
});

test('Fehler bei fehlender plugin.php', () => {
  const testFile = path.resolve(__dirname, 'nonexistent.php');
  expect(() => {
	extractPluginVersion(testFile);
  }).toThrow(`File not found in: ${testFile}`);
});