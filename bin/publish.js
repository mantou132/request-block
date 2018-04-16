const child_process = require('child_process');
const pkg = require('../extension/manifest.json');
const fs = require('fs');
const path = require('path');

// child_process.execSync('web-ext lint -s extension/');

const getNewVersion = (oldVersion, version = 'patch') => {
  // [<newversion> | major | minor | patch]
  if (/^([0-9]+\.*)+$/.test(version)) return version;
  const types = ['major', 'minor', 'patch'];
  const index = types.indexOf(version);
  if (index >= 0) {
    const versionArr = oldVersion.split('.');
    versionArr[index] = parseInt(versionArr[index]) + 1;
    return versionArr.map((e, i) => i > index ? 0 : e).join('.');
  }
  return getNewVersion(oldVersion);
};

const newVersion = getNewVersion(pkg.version, process.argv[2]);

fs.writeFileSync(path.resolve(__dirname, '../extension/manifest.json'), JSON.stringify(
  Object.assign({}, pkg, {version: newVersion}),
  null,
  2
) + '\n');

child_process.execSync('npm run source');

child_process.execSync(`git commit -a -m 'Update to v${newVersion}'`);
child_process.execSync(`git tag v${newVersion}`);
child_process.execSync('git push && git push --tags');
child_process.execSync('git checkout .');
