var semver = require('semver');
var semver2 = _interopRequireDefault(semver);
var package = require('./package');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = package.engines.node;
console.log(version);
console.log(process.version);
if (!semver2.default.satisfies(process.version, version)) {
  console.log('Required node version ' + version + ' not satisfied with current version ' + process.version + '.');
  process.exit(1);
}