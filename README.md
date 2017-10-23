# Dockering

`dockering` is a package that aims to make easy to put your project in a docker container. The purpose is to be able to create a new image using code instead of Dockerfile and to be able to automate the process.

## Command line usage

Suppose you have a nodejs server.

```javascript
dockering --name newimagename --tag tag --cmd "npm start" --port 8080
```

Running that command will create a docker container based on the node project on your current repository with name `newimagename`, tag `tag`, start command `npm start` and exposing the port 8080. After that you can do:

```
docker run -p 8080:8080 -d newimagename:tag
```

And that will start your new server in a docker container

## Creating custom Dockerfiles

By the default the Dockerfile created looks like this:

```javascript
import Dockering from 'dockering'

const dockerfile = Dockering('mynewimage:latest')
  .fromImage('node')
  .run('mkdir /app')
  .workdir('/app')
  .add(['package.json'], '/app')
  .run('npm install')
  .add(['.'], '/app')
  .expose([8080])
  .cmd(['npm', 'start'])
  .build();
```

However, you can create your own script with your own statements. For example:

```javascript
import Dockering from 'dockering'

const dockerfile = Dockering('mynewimage:latest')
  .fromImage('ubuntu')
  .run('apt-get install nodejs')
  .run('npm -g forever')
  .run('mkdir /app')
  .workdir('/app')
  .add(['package.json'], '/app')
  .run('npm install')
  .add(['.'], '/app')
  .expose([8080])
  .env([{key: 'NPM_ENV', value: 'prod'}])
  .cmd(['forever', 'npm', 'start'])
  .build();
```

Running that example will create a new docker image with the information defined there.
