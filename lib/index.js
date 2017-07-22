"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const node_docker_api_1 = require("node-docker-api");
const npm_monads_1 = require("npm-monads");
var npm_monads_2 = require("npm-monads");
exports.Option = npm_monads_2.Option;
const instructions = require("./instructions");
exports.Instructions = instructions;
const tar = require('tar-stream');
const promisifyStream = (stream) => {
    return new Promise((resolve, reject) => {
        stream.on('data', (d) => console.log(d.toString()));
        stream.on('end', resolve);
        stream.on('error', reject);
    });
};
class Dockering {
    constructor(name = path.basename(__dirname), instructions = [], docker = new node_docker_api_1.Docker({ socketPath: '/var/run/docker.sock' })) {
        this.name = name;
        this.instructions = instructions;
        this.docker = docker;
    }
    fromImage(image, name = npm_monads_1.Option.none()) {
        return this.withNewInstruction(new instructions.From(image, name));
    }
    arg(key, value = npm_monads_1.Option.none()) {
        return this.withNewInstruction(new instructions.Arg(key, value));
    }
    run(command) {
        return this.withNewInstruction(new instructions.Run(command));
    }
    cmd(command) {
        return this.withNewInstruction(new instructions.Cmd(command));
    }
    label(labels) {
        return this.withNewInstruction(new instructions.Labels(labels));
    }
    expose(ports) {
        return this.withNewInstruction(new instructions.Expose(ports));
    }
    env(variables) {
        return this.withNewInstruction(new instructions.Envs(variables));
    }
    add(srcs, dst) {
        return this.withNewInstruction(new instructions.Add(srcs, dst));
    }
    copy(srcs, dst) {
        return this.withNewInstruction(new instructions.Copy(srcs, dst));
    }
    entrypoint(command) {
        return this.withNewInstruction(new instructions.Entrypoint(command));
    }
    volume(volumes) {
        return this.withNewInstruction(new instructions.Volume(volumes));
    }
    user(user) {
        return this.withNewInstruction(new instructions.User(user));
    }
    workdir(path) {
        return this.withNewInstruction(new instructions.Workdir(path));
    }
    onbuild(instruction) {
        return this.withNewInstruction(new instructions.Onbuild(instruction));
    }
    stopsignal(signal) {
        return this.withNewInstruction(new instructions.Stopsignal(signal));
    }
    healthcheck(action) {
        return this.withNewInstruction(new instructions.Healthcheck(action));
    }
    shell(cmd) {
        return this.withNewInstruction(new instructions.Shell(cmd));
    }
    build() {
        const tarStream = tar
            .pack();
        const dockerfileContent = this.instructions.map(i => i.toString()).join('\n');
        const dockerfile = tarStream
            .entry({ name: 'Dockerfile', size: dockerfileContent.length }, (err) => {
            if (err)
                throw err;
            tarStream.finalize();
        });
        dockerfile.write(dockerfileContent);
        dockerfile.end();
        return this.docker.image.build(tarStream, { t: this.name })
            .then((stream) => promisifyStream(stream));
    }
    withNewInstruction(newInstruction) {
        return new Dockering(this.name, this.instructions.concat([newInstruction]), this.docker);
    }
}
exports.default = Dockering;
//# sourceMappingURL=index.js.map