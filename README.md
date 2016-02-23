# Spring Microservice Generator [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url]

A generator for [Yeoman](http://yeoman.io).

> Yeoman generator for creating Microservices using Maven, Spring Boot, Spring Cloud and Docker.

## Getting Started

To install generator-spring-microservice from npm, run:

```
$ npm install -g generator-spring-microservice
```

Finally, initiate the generator:

```
$ yo spring-microservice
```

### Project structure

```
myservice-it/
    src/*
    pom.xml  
    
myservice-model
    src/*
    pom.xml  
    
myservice-rest
    src/
        main/
            java/
                com/example/myservice/
                    config/
                    core/
                    rest/
                        assembler/
                        controller/
                        global/
                    Application.java
            resources/
                application.yml
                bootstrap.yml
        test/*
    pom.xml  

pom.xml
.gitignore
.yo-rc.json
```



## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)