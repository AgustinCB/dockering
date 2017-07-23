import test from 'ava';
import { Docker } from 'node-docker-api';

import command from '../lib/command';

test('test command line', async t => {
  const docker = new Docker({ socketPath: '/var/run/docker.sock' });
  const args = {
    cmd: 'echo hola',
    name: 'dockeringtest',
    tag: 'stable'
  };
  await command(args);
  const image = await docker.image.get('dockeringtest:stable').status();
  t.truthy(image.data);
  t.is(image.data.RepoTags[0], 'dockeringtest:stable');
  await image.remove();
});
