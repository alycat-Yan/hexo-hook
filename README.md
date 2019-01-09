# hexo-hook

**hexo-hook** is a hexo plugin to listen webhook push event to update locate files and generate static files in public folder.

If your hexo included hexo-server, this plugin use the same port in server config. The default http port of hexo-hook is 8000. For now hexo-hook only can  receive the json content event.
hexo-hook will pull the master branch  when receive the request from github.  

After start hexo with this plugin, you can add webhook in Github like this: 
```https://your.domain.com:8000/hook```  

Please remove the posts folder under your hexo root path if you change the repository url in _config.yml.

## Install
​```shell
$ npm install hexo-hook --save
```

## Usage
​```shell
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
**url** is your github repository url. For now it only support github webhook.

**sub** is the path which your markdown files exist.

**secret** is the secret you set in webhook config page. 

## License

MIT