import test from 'ava';
import { Docker } from 'node-docker-api';

import { Option, Instructions, default as Dockering } from '../lib/index';

test('instruction from', t => {
  const instruction1 = new Instructions.From('image');
  t.is(instruction1.toString(), 'FROM image');
  const instruction2 = new Instructions.From('image', Option.unit('alias'));
  t.is(instruction2.toString(), 'FROM image AS alias');
});

test('instruction arg', t => {
  const instruction1 = new Instructions.Arg('key');
  t.is(instruction1.toString(), 'ARG key');
  const instruction2 = new Instructions.Arg('key', Option.unit('value'));
  t.is(instruction2.toString(), 'ARG key=value');
});

test('instruction run', t => {
  const instruction1 = new Instructions.Run('this is a command');
  t.is(instruction1.toString(), 'RUN this is a command');
  const instruction2 = new Instructions.Run(['this', 'is', 'a', 'command']);
  t.is(instruction2.toString(), 'RUN ["this","is","a","command"]');
});

test('instruction cmd', t => {
  const instruction1 = new Instructions.Cmd('this is a command');
  t.is(instruction1.toString(), 'CMD this is a command');
  const instruction2 = new Instructions.Cmd(['this', 'is', 'a', 'command']);
  t.is(instruction2.toString(), 'CMD ["this","is","a","command"]');
});

test('instruction label', t => {
  const instruction1 = new Instructions.Labels([{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value"2'}]);
  t.is(instruction1.toString(), 'LABEL "key1"="value1" "key2"="value\\\"2"');
});

test('expose instruction', t => {
  const instruction1 = new Instructions.Expose([123, 456]);
  t.is(instruction1.toString(), 'EXPOSE 123 456');
});

test('env instruction', t => {
  const instruction1 = new Instructions.Envs([{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value"2'}]);
  t.is(instruction1.toString(), 'ENV key1="value1" key2="value\\\"2"');
});

test('add instruction', t => {
  const instruction1 = new Instructions.Add(['src1', 'src2'], 'dst');
  t.is(instruction1.toString(), 'ADD ["src1","src2","dst"]');
});

test('copy instruction', t => {
  const instruction1 = new Instructions.Copy(['src1', 'src2'], 'dst');
  t.is(instruction1.toString(), 'COPY ["src1","src2","dst"]');
});

test('instruction entrypoint', t => {
  const instruction1 = new Instructions.Entrypoint('this is a command');
  t.is(instruction1.toString(), 'ENTRYPOINT this is a command');
  const instruction2 = new Instructions.Entrypoint(['this', 'is', 'a', 'command']);
  t.is(instruction2.toString(), 'ENTRYPOINT ["this","is","a","command"]');
});

test('volume instruction', t => {
  const instruction1 = new Instructions.Volume(['src1', 'src2']);
  t.is(instruction1.toString(), 'VOLUME ["src1","src2"]');
});

test('user instruction', t => {
  const instruction1 = new Instructions.User('user');
  t.is(instruction1.toString(), 'USER user');
});

test('workdir instruction', t => {
  const instruction1 = new Instructions.Workdir('/path');
  t.is(instruction1.toString(), 'WORKDIR /path');
});

test('onbuild instruction', t => {
  const instruction1 = new Instructions.Onbuild(new Instructions.User('user'));
  t.is(instruction1.toString(), 'ONBUILD USER user');
});

test('stopsignal instruction', t => {
  const instruction1 = new Instructions.Stopsignal('TERM');
  t.is(instruction1.toString(), 'STOPSIGNAL TERM');
});

test('healthcheck instruction', t => {
  const instruction1 = new Instructions.Healthcheck(Option.none());
  t.is(instruction1.toString(), 'HEALTHCHECK NONE');
  const instruction2 = new Instructions.Healthcheck(Option.unit({
    options: ['option1', 'option2'],
    instruction: new Instructions.Cmd('command')
  }));
  t.is(instruction2.toString(), 'HEALTHCHECK option1 option2 CMD command');
});

test('shell instruction', t => {
  const instruction1 = new Instructions.Shell(['exec', 'arg']);
  t.is(instruction1.toString(), 'SHELL ["exec","arg"]');
});

test('basic build', async t => {
  const docker = new Docker({ socketPath: '/var/run/docker.sock' });
  const dockerfile = (new Dockering('testimage')).fromImage('ubuntu').run('echo "hola"');
  await dockerfile.build('.');
  const image = await docker.image.get('testimage').status();
  t.truthy(image.data);
  await image.remove();
});
