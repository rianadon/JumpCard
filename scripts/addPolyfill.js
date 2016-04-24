const fs = require('fs');

// First write the polyfill

process.stdout.write('// Babel polyfill\n');
process.stdout.write(fs.readFileSync('node_modules/babel-polyfill/dist/polyfill.min.js'));
process.stdin.on('data', process.stdout.write.bind(process.stdout));
