# Dockering

`dockering` is a package that aims to make easy to put your project in a docker container. The purpose is to be able to create a new image using code instead of Dockerfile and to be able to automate the process.

## Command line usage

```javascript
dockering --name newimagename --tag tag --cmd "echo 'hola'"
```

## Example

```javascript
import Dockering from 'dockering'

const dockerfile = Dockering('mynewimage:latest')
  .fromImage('ubuntu')
  .run('apt-get install nodejs')
  .run('mkdir /app')
  .workdir('/app')
  .add(['package.json'], '/app')
  .run('npm install')
  .add(['.'], '/app')
  .cmd(['npm', 'start'])
  .build();
```
