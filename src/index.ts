'use strict';

import * as path from 'path';
import { Stream } from 'stream';
import { Docker } from 'node-docker-api';
import { Option, Either } from 'npm-monads';
export { Option } from 'npm-monads';
import * as instructions from './instructions';
export {instructions as Instructions}
const tar = require('tar-fs');

const promisifyStream = (stream: Stream): Promise<{}> => {
  return new Promise((resolve, reject) => {
    stream.on('data', (d) => console.log(d.toString()));
    stream.on('end', resolve);
    stream.on('error', reject);
  });
};

export default class Dockering {
  constructor(
    public name: string = path.basename(__dirname),
    public instructions: Array<instructions.Instruction> = [],
    public docker: Docker = new Docker({ socketPath: '/var/run/docker.sock' })) { }

  fromImage(image: string, name: Option<string> = Option.none()): Dockering {
    return this.withNewInstruction(new instructions.From(image, name));
  }

  arg(key: string, value: Option<string> = Option.none()): Dockering {
    return this.withNewInstruction(new instructions.Arg(key, value));
  }

  run(command: string | Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Run(command));
  }

  cmd(command: string | Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Cmd(command));
  }

  label(labels: Array<instructions.Label>): Dockering {
    return this.withNewInstruction(new instructions.Labels(labels));
  }

  expose(ports: Array<number>): Dockering {
    return this.withNewInstruction(new instructions.Expose(ports));
  }

  env(variables: Array<instructions.Env>): Dockering {
    return this.withNewInstruction(new instructions.Envs(variables));
  }

  add(srcs: Array<string>, dst: string): Dockering {
    return this.withNewInstruction(new instructions.Add(srcs, dst));
  }

  copy(srcs: Array<string>, dst: string): Dockering {
    return this.withNewInstruction(new instructions.Copy(srcs, dst));
  }

  entrypoint(command: string | Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Entrypoint(command));
  }

  volume(volumes: Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Volume(volumes));
  }

  user(user: string): Dockering {
    return this.withNewInstruction(new instructions.User(user));
  }

  workdir(path: string): Dockering {
    return this.withNewInstruction(new instructions.Workdir(path));
  }

  onbuild(instruction: instructions.Instruction): Dockering {
    return this.withNewInstruction(new instructions.Onbuild(instruction));
  }

  stopsignal(signal: string): Dockering {
    return this.withNewInstruction(new instructions.Stopsignal(signal));
  }

  healthcheck(action: Option<instructions.HealthcheckOptions>): Dockering {
    return this.withNewInstruction(new instructions.Healthcheck(action));
  }

  shell(cmd: Array<string>): Dockering {
    return this.withNewInstruction(new instructions.Shell(cmd));
  }

  build(project: string = '.'): Promise<{}> {
    const tarStream = tar
      .pack(project, {
        ignore: (name: string) => name.indexOf('node_modules') === 0
      });
    const dockerfileContent = this.instructions.map(i => i.toString()).join('\n');
    tarStream.entry({ name: 'Dockerfile' }, dockerfileContent)
    return this.docker.image.build(tarStream, { t: this.name })
      .then((stream: Stream) => promisifyStream(stream));
  }

  private withNewInstruction(newInstruction: instructions.Instruction): Dockering {
    return new Dockering(this.name, this.instructions.concat([newInstruction]), this.docker);
  }
}
