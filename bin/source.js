const child_process = require('child_process');
const pkg = require('../extension/manifest.json');

child_process.execSync(`
  tar \\
    -v -cf \\
    build/srouce-${pkg.version}.zip \\
    ./extension \\
`);
