# wp-github-plugin

**Sync your plugin version across WordPress, `package.json`, and `composer.json` – and auto-tag your GitHub releases.**

Perfect for WordPress plugins that update directly via GitHub (e.g. with your own custom updater or [GitHub Updater](https://github.com/afragen/github-updater)).

---

## Features

- Extracts version from `plugin.php`
- Updates `package.json` and `composer.json` to match
- Automatically creates a `vX.X.X` Git tag
- Pushes the tag to GitHub
- Easy CLI usage with `npx`

---

## Installation & Usage

No need to install – just run:

```bash
npx wp-github-plugin ./plugin.php

```

or

```bash
npm install --save-dev wp-github-plugin
```

and add to your package.json the following lines (replacing plugin.php with your actual plugin file)

```json
"scripts": {
  "version-sync": "wp-github-plugin ./plugin.php",
  "release": "wp-github-plugin ./plugin.php npm run version-sync --tag"
}
```

## Requirements
Your Wordpress plugin header must include a version line like this:
```php
/*
 * Plugin Name: My Plugin
 * Version: 1.2.3
 * ...
 */
```

## Testing
Tests are located in the tests/ folder. To run them:

```bash
npm install
npm test
Uses Jest with mocked child_process.execSync.
```