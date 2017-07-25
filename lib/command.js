'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
;
;
const getConfig = (path) => {
    try {
        return require(path);
    }
    catch (e) {
        console.log('error', path, e);
        throw 'could not find package.json';
    }
};
function default_1(args) {
    const startCmd = args.cmd || 'npm start';
    const projectPath = args.project || process.cwd();
    const port = parseInt(args.port) || 8080;
    const confFile = `${projectPath}/package.json`;
    const configuration = getConfig(confFile);
    const name = args.name || configuration.name;
    const tag = args.tag || 'latest';
    return (new index_1.default(`${name}:${tag}`))
        .fromImage('node')
        .run('mkdir /app')
        .workdir('/app')
        .copy(['package.json'], '/app')
        .run('npm install')
        .copy(['.'], '/app')
        .expose([port])
        .cmd(startCmd.split(' '))
        .build();
}
exports.default = default_1;
//# sourceMappingURL=command.js.map