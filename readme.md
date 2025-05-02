# 🧩 wp-github-plugin

**Sync your plugin version across WordPress, `package.json`, and `composer.json` – and auto-tag your GitHub releases.**

Perfect for WordPress plugins that update directly via GitHub (e.g. with your own custom updater or [GitHub Updater](https://github.com/afragen/github-updater)).

---

## 🚀 Features

- ✅ Extracts version from `plugin.php`
- ✅ Updates `package.json` and `composer.json` to match
- ✅ Automatically creates a `vX.X.X` Git tag
- ✅ Pushes the tag to GitHub
- ✅ Easy CLI usage with `npx`

---

## 📦 Installation & Usage

No need to install – just run:

```bash
npx @contexiswp-github-plugin ./plugin.php

```

or

```bash
npm install --save-dev @contexis/wp-github-plugin
```

nd add to your package.json

```json
"scripts": {
  "version-sync": "wp-github-plugin ./plugin.php",
  "release": "npm run version-sync --tag"
}
```

## 🔧 Requirements
Your plugin header must include a version line like this:
```php
/*
 * Plugin Name: My Plugin
 * Version: 1.2.3
 */
```

## ✨ What It Does

- Reads the version from the plugin.php file
- Sets the version in package.json
- Sets the version in composer.json
- If no Git tag with vX.X.X exists:
	- Runs git tag v1.2.3
	- Pushes the tag with git push origin v1.2.3

## 🧪 Testing
Tests are located in the tests/ folder. To run them:

```bash
npm install
npm test
Uses Jest with mocked child_process.execSync.
```

## 🔐 Safe by Design
Will not run if WP_DEBUG or CTX_DEV_SERVER is defined (e.g., in dev environments)

Will not push tags if the tag already exists

## ✍️ Author
Thomas Gollenia (@contexis)
Evangelical coder. Plugin refiner. Dev tooling aficionado.
