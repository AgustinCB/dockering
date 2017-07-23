'use strict';

import * as path from 'path';
import Dockering from './index';

export interface Args {
  cmd?: string;
  project?: string;
  name?: string;
  tag?: string
};

export interface Package {
  name: string;
};

const getConfig = (path: string): Package => {
  try {
    return require(path);
  } catch (e) {
    console.log('error', path, e);
    throw 'could not find package.json';
  }
};

export default function (args: Args): Promise<{}> {
  const startCmd = args.cmd || 'npm start';
  const projectPath = args.project || process.cwd();
  const confFile = `${projectPath}/package.json`;
  const configuration = getConfig(confFile);
  const name = args.name || configuration.name;
  const tag = args.tag || 'latest';
  return (new Dockering(`${name}:${tag}`))
    .fromImage('node')
    .run('mkdir /app')
    .workdir('/app')
    .copy(['package.json'], '/app')
    .run('npm install')
    .copy(['.'], '/app')
    .cmd(startCmd.split(' '))
    .build();
}
