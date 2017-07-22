"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_monads_1 = require("npm-monads");
;
// https://docs.docker.com/engine/reference/builder/#from
class From {
    constructor(image, name = npm_monads_1.Option.none()) {
        this.image = image;
        this.name = name;
    }
    toString() {
        const name = this.name.map(n => ` AS ${n}`).getOrElse('');
        return `FROM ${this.image}${name}`;
    }
}
exports.From = From;
// https://docs.docker.com/engine/reference/builder/#arg
class Arg {
    constructor(key, value = npm_monads_1.Option.none()) {
        this.key = key;
        this.value = value;
    }
    toString() {
        const value = this.value.map(v => `=${v}`).getOrElse('');
        return `ARG ${this.key}${value}`;
    }
}
exports.Arg = Arg;
// https://docs.docker.com/engine/reference/builder/#run
class Run {
    constructor(command) {
        this.command = command;
    }
    toString() {
        const command = this.command.constructor === String ? this.command : JSON.stringify(this.command);
        return `RUN ${command}`;
    }
}
exports.Run = Run;
// https://docs.docker.com/engine/reference/builder/#cmd
class Cmd {
    constructor(command) {
        this.command = command;
    }
    toString() {
        const command = this.command.constructor === String ? this.command : JSON.stringify(this.command);
        return `CMD ${command}`;
    }
}
exports.Cmd = Cmd;
// https://docs.docker.com/engine/reference/builder/#label
class Labels {
    constructor(labels) {
        this.labels = labels;
    }
    toString() {
        const labels = this.labels
            .map(label => `"${label.key.replace(/"/g, '\\\"')}"="${label.value.replace(/"/g, '\\\"')}"`)
            .join(' ');
        return `LABEL ${labels}`;
    }
}
exports.Labels = Labels;
// https://docs.docker.com/engine/reference/builder/#expose
class Expose {
    constructor(ports) {
        this.ports = ports;
    }
    toString() {
        const ports = this.ports.join(' ');
        return `EXPOSE ${ports}`;
    }
}
exports.Expose = Expose;
// https://docs.docker.com/engine/reference/builder/#env
class Envs {
    constructor(envs) {
        this.envs = envs;
    }
    toString() {
        const envs = this.envs
            .map(env => `${env.key}="${env.value.replace(/"/g, '\\\"')}"`)
            .join(' ');
        return `ENV ${envs}`;
    }
}
exports.Envs = Envs;
// https://docs.docker.com/engine/reference/builder/#add
class Add {
    constructor(srcs, dst) {
        this.srcs = srcs;
        this.dst = dst;
    }
    toString() {
        const paths = JSON.stringify(this.srcs.concat([this.dst]));
        return `ADD ${paths}`;
    }
}
exports.Add = Add;
// https://docs.docker.com/engine/reference/builder/#copy
class Copy {
    constructor(srcs, dst) {
        this.srcs = srcs;
        this.dst = dst;
    }
    toString() {
        const paths = JSON.stringify(this.srcs.concat([this.dst]));
        return `COPY ${paths}`;
    }
}
exports.Copy = Copy;
// https://docs.docker.com/engine/reference/builder/#entrypoint
class Entrypoint {
    constructor(command) {
        this.command = command;
    }
    toString() {
        const command = this.command.constructor === String ? this.command : JSON.stringify(this.command);
        return `ENTRYPOINT ${command}`;
    }
}
exports.Entrypoint = Entrypoint;
// https://docs.docker.com/engine/reference/builder/#volume
class Volume {
    constructor(volumes) {
        this.volumes = volumes;
    }
    toString() {
        return `VOLUME ${JSON.stringify(this.volumes)}`;
    }
}
exports.Volume = Volume;
// https://docs.docker.com/engine/reference/builder/#user
class User {
    constructor(user) {
        this.user = user;
    }
    toString() {
        return `USER ${this.user}`;
    }
}
exports.User = User;
// https://docs.docker.com/engine/reference/builder/#workdir
class Workdir {
    constructor(path) {
        this.path = path;
    }
    toString() {
        return `WORKDIR ${this.path}`;
    }
}
exports.Workdir = Workdir;
// https://docs.docker.com/engine/reference/builder/#onbuild
class Onbuild {
    constructor(instruction) {
        this.instruction = instruction;
    }
    toString() {
        return `ONBUILD ${this.instruction.toString()}`;
    }
}
exports.Onbuild = Onbuild;
// https://docs.docker.com/engine/reference/builder/#stopsignal
class Stopsignal {
    constructor(signal) {
        this.signal = signal;
    }
    toString() {
        return `STOPSIGNAL ${this.signal}`;
    }
}
exports.Stopsignal = Stopsignal;
// https://docs.docker.com/engine/reference/builder/#healthcheck
class Healthcheck {
    constructor(options) {
        this.options = options;
    }
    toString() {
        const options = this.options
            .map(o => `${o.options.join(' ')} ${o.instruction.toString()}`)
            .getOrElse('NONE');
        return `HEALTHCHECK ${options}`;
    }
}
exports.Healthcheck = Healthcheck;
// https://docs.docker.com/engine/reference/builder/#shell
class Shell {
    constructor(cmd) {
        this.cmd = cmd;
    }
    toString() {
        return `SHELL ${JSON.stringify(this.cmd)}`;
    }
}
exports.Shell = Shell;
//# sourceMappingURL=instructions.js.map