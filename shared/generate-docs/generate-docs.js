const { basename, parse, resolve, join, sep } = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);
const showdown = require('showdown');
const groupBy = require('lodash/groupBy');

const root = resolve(__dirname, '..', '..');
const outputDir = join(__dirname, 'dist');

showdown.setFlavor('github');
const converter = new showdown.Converter();

const markdownFiles = async function() {
  return await glob('**/**.md', {
    cwd: root,
    ignore: '**/node_modules/**'
  });
};

const scrapeTitle = function(content) {
  const matches = /^# (.*)/g.exec(content);
  if (matches) {
    return matches[1];
  }
};

const template = function({ title, html }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="hiq.css">
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <nav>
        <a href="/">Index</a>
      </nav>
      ${html}
    </body>
    </html>
    `;
};

const genDoc = async function(path) {
  const { name, dir } = parse(path);
  const contents = await readFile(resolve(root, path));

  const titleFromFile = scrapeTitle(contents);

  const title = titleFromFile || `${dir}${dir ? '→' : ''}${name}`;
  const filename = `${dir.replace(sep, '-')}${dir ? '-' : ''}${name}.html`;

  const html = converter.makeHtml(contents.toString());

  return {
    title,
    filename,
    category: dir.split('/')[0],
    html: template({ title, html })
  };
};

const outputFile = async function({ filename, html }) {
  const path = join(outputDir, filename);
  return writeFile(path, html);
};

const createIndex = async function(contents) {
  const byCategory = groupBy(contents, 'category');

  const pages = Object.keys(byCategory)
    .sort()
    .map(category => {
      const pagesInCategory = byCategory[category]
        .map(
          ({ filename, title }) => `<li><a href="${filename}">${title}</a></li>`
        )
        .join('\n');

      return `
        <h2>${category}</h2>
        <ul>${pagesInCategory}</ul>
      `;
    });
  // const pages = contents.map(
  //   ({ filename, title }) => `<li><a href="${filename}">${title}</a></li>`
  // );

  const title = 'Documentation';

  const html = `
    <h1>${title}</h1>
    <ul>${pages.join('\n')}</ul>
  `;

  return {
    title,
    filename: 'index.html',
    html: template({ title, html })
  };
};

const generateCss = async function() {
  const hiq = await readFile(
    resolve(__dirname, 'node_modules/hiq/dist/hiq.min.css')
  );
  outputFile({
    filename: 'hiq.css',
    html: hiq
  });

  const css = await readFile(resolve(__dirname, 'styles.css'));
  outputFile({
    filename: 'styles.css',
    html: css
  });
};

const main = async function() {
  await generateCss();

  const files = await markdownFiles();

  console.log(files.join('\n'));

  const contents = await Promise.all(files.map(genDoc));
  const withIndex = [...contents, await createIndex(contents)];

  await Promise.all(withIndex.map(outputFile));

  console.log('\nDone 👍');
};

main();
