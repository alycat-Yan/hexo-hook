# hexo-hook

**hexo-hook** is a hexo plugin to listen webhook push event to update locate files and generate static files in public folder.

If your hexo included hexo-server, this plugin use the same port in server config. The default http port of hexo-hook is 8000.

hexo-hook will pull the master branch from github. Please remove the posts folder under your hexo root path if you change the repository url in _config.yml.

## Install
```shell
$ npm install hexo-hook --save
```

## Usage
```shell
hexo hook 
```

## Example

```yml
webhook:
  port: 8000
  repository:
    source:
      url: 'https://github.com/alycat-Yan/test.git'
      sub: '/'
      secret: '123'

```
**sub** is the path which your markdown files exist.

**secret** is the secret you set in webhook config page. 

## License

MIT