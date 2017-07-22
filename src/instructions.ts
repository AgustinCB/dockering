import { Option } from 'npm-monads';

export interface Instruction {
  toString: () => string;
};

export interface Label {
  key: string;
  value: string;
}

export interface Env {
  key: string;
  value: string;
}

// https://docs.docker.com/engine/reference/builder/#from
export class From implements Instruction {
  constructor(public image: string, public name: Option<string> = Option.none()) {}
  toString(): string {
    const name = this.name.map(n => ` AS ${n}`).getOrElse('');
    return `FROM ${this.image}${name}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#arg
export class Arg implements Instruction {
  constructor(public key: string, public value: Option<string> = Option.none()) {}
  toString(): string {
    const value = this.value.map(v => `=${v}`).getOrElse('');
    return `ARG ${this.key}${value}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#run
export class Run implements Instruction {
  constructor(public command: string | Array<string>) {}
  toString(): string {
    const command = this.command.constructor === String ? this.command : JSON.stringify(this.command);
    return `RUN ${command}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#cmd
export class Cmd implements Instruction {
  constructor(public command: string | Array<string>) {}
  toString(): string {
    const command = this.command.constructor === String ? this.command : JSON.stringify(this.command);
    return `CMD ${command}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#label
export class Labels implements Instruction {
  constructor(public labels: Array<Label>) {}
  toString(): string {
    const labels = this.labels
      .map(label => `"${label.key.replace(/"/g, '\\\"')}"="${label.value.replace(/"/g, '\\\"')}"`)
      .join(' ');
    return `LABEL ${labels}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#expose
export class Expose implements Instruction {
  constructor(public ports: Array<number>) {}
  toString(): string {
    const ports = this.ports.join(' ');
    return `EXPOSE ${ports}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#env
export class Envs implements Instruction {
  constructor(public envs: Array<Env>) {}
  toString(): string {
    const envs = this.envs
      .map(env => `${env.key}="${env.value.replace(/"/g, '\\\"')}"`)
      .join(' ');
    return `ENV ${envs}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#add
export class Add implements Instruction {
  constructor(public srcs: Array<string>, public dst: string) {}
  toString(): string {
    const paths = JSON.stringify(this.srcs.concat([this.dst]));
    return `ADD ${paths}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#copy
export class Copy implements Instruction {
  constructor(public srcs: Array<string>, public dst: string) {}
  toString(): string {
    const paths = JSON.stringify(this.srcs.concat([this.dst]));
    return `COPY ${paths}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#entrypoint
export class Entrypoint implements Instruction {
  constructor(public command: string | Array<string>) {}
  toString(): string {
    const command = this.command.constructor === String ? this.command : JSON.stringify(this.command);
    return `ENTRYPOINT ${command}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#volume
export class Volume implements Instruction {
  constructor(public volumes: Array<string>) {}
  toString(): string {
    return `VOLUME ${JSON.stringify(this.volumes)}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#user
export class User implements Instruction {
  constructor(public user: string) {}
  toString(): string {
    return `USER ${this.user}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#workdir
export class Workdir implements Instruction {
  constructor(public path: string) {}
  toString(): string {
    return `WORKDIR ${this.path}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#onbuild
export class Onbuild implements Instruction {
  constructor(public instruction: Instruction) {}
  toString(): string {
    return `ONBUILD ${this.instruction.toString()}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#stopsignal
export class Stopsignal implements Instruction {
  constructor(public signal: string) {}
  toString(): string {
    return `STOPSIGNAL ${this.signal}`;
  }
}

export interface HealthcheckOptions {
  options: Array<string>;
  instruction: Cmd;
}

// https://docs.docker.com/engine/reference/builder/#healthcheck
export class Healthcheck implements Instruction {
  constructor(public options: Option<HealthcheckOptions>) {}
  toString(): string {
    const options = this.options
      .map(o => `${o.options.join(' ')} ${o.instruction.toString()}`)
      .getOrElse('NONE');
    return `HEALTHCHECK ${options}`;
  }
}

// https://docs.docker.com/engine/reference/builder/#shell
export class Shell implements Instruction {
  constructor(public cmd: Array<string>) {}
  toString(): string {
    return `SHELL ${JSON.stringify(this.cmd)}`;
  }
}
