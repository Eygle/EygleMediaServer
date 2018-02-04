# Eygle Media Server

This project is inspired by [Plex](https://app.plex.tv/) but allow users to download media instead of streaming them.  
*This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.*

## Development server

### Pre-requisits
+ NodeJs
+ Gulp `npm install -g gulp`

### Run
Run `nmp install` to install all project dependencies  
Run `gulp server:run` to compile and launch the server.  
Run `ng start` to compile and launch the client application. Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

## Production server

### Pre-requisits
+ NodeJs
+ Gulp `npm install -g gulp`
+ Nginx `sudo apt-get install nginx`
+ pm2 `npm install -g pm2`

### Deploy
Run `nmp install` to install all project dependencies  
Run `gulp server:build` to compile the server.  
Run `ng build` to compile the client application.  
  
__First launch:__  
Run `pm2 start tools/project.json`  
  
__Other launch:__  
Run `pm2 gracefulReload EygleMediaServer`  
