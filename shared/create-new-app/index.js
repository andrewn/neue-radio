const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, '../../apps');
const templatePath = path.resolve(__dirname, './templates');

const copyFile = appPath => fileName => {
  const destination = path.join(appPath, fileName);
  const source = path.join(templatePath, fileName);

  return fs.copyFileSync(source, destination);
};

const touch = path => fs.closeSync(fs.openSync(path, 'w'));

const createNewApp = async name => {
  const appPath = path.join(rootPath, name);
  const srcPath = path.join(appPath, 'src');
  const copy = copyFile(srcPath);

  fs.mkdirSync(appPath);
  fs.mkdirSync(path.join(appPath, 'assets'));
  touch(path.join(appPath, 'assets', '.gitkeep'));

  fs.mkdirSync(srcPath);
  fs.mkdirSync(path.join(srcPath, 'lib'));
  touch(path.join(srcPath, 'lib', '.gitkeep'));

  ['internal.html', 'internal.js', 'external.html', 'external.js'].forEach(
    copy
  );

  await exec('npm init --yes > /dev/null', { ...process.env, cwd: appPath });

  console.log(`Created new application in ${appPath}`);
};

const appName = process.argv[2];

if (!appName) {
  console.log('USAGE: npm run create-app app-name');
  process.exit(0);
}

createNewApp(appName);
