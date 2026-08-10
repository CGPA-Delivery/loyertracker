const { execFileSync } = require('node:child_process');

const minimums = {
  playwright: [1, 55, 1],
  'playwright-core': [1, 55, 1],
  'ip-address': [10, 3, 1],
};

const tree = JSON.parse(execFileSync('npm', ['ls', '--all', '--json'], { encoding: 'utf8' }));
const found = new Map();

function visit(name, dependency) {
  if (!dependency || typeof dependency !== 'object') return;
  if (minimums[name] && dependency.version) found.set(name, dependency.version);
  for (const [childName, child] of Object.entries(dependency.dependencies ?? {})) visit(childName, child);
}
for (const [name, dependency] of Object.entries(tree.dependencies ?? {})) visit(name, dependency);

function compliant(version, minimum) {
  const parsed = version.split('.').map(Number);
  return parsed[0] > minimum[0]
    || (parsed[0] === minimum[0] && (parsed[1] > minimum[1]
      || (parsed[1] === minimum[1] && parsed[2] >= minimum[2])));
}

const failures = Object.entries(minimums)
  .filter(([name, minimum]) => !found.has(name) || !compliant(found.get(name), minimum))
  .map(([name, minimum]) => `${name}: found ${found.get(name) ?? 'absent'}, expected >= ${minimum.join('.')}`);

if (failures.length) {
  console.error(`FAIL security dependency floor:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`PASS security dependency floor: ${[...found].map(([name, version]) => `${name}@${version}`).join(', ')}`);
