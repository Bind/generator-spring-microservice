'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _S = require('underscore.string');

var SpringGenerator = module.exports = function SpringGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(SpringGenerator, yeoman.generators.Base);

SpringGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    console.log(chalk.green('\n.............DD88888888888888888,............\n' +
        '...........:888888888888888888888,...........\n' +
        '..........+88888888888888888888888+..........\n' +
        '.........,8888888888888888888888888..........\n' +
        '.........888888888888...888888888888.........\n' +
        '.......,88888887..D88...88Z..88888888,.......\n' +
        '.......8888888,...888...88D...=8888888.......\n' +
        '......D888888,..$8888...88887...8888888......\n' +
        '.....Z888888$..I88888...88888:..88888888,....\n' +
        '....D8888888...888888...88888D..,88888888....\n' +
        '....88888888,..888888..,888888...88888888....\n' +
        '....88888888,..8888888$888888D..,88888888....\n' +
        '....88888888I..Z8888888888888+..888888888....\n' +
        '.....Z8888888...O888888888888..,88888888.....\n' +
        '......88888888...,88888888D...,88888888......\n' +
        '.......88888888=.....?I+.....I88888888.......\n' +
        '.......,88888888D7.........ZD88888888,.......\n' +
        '.........888888888888888888888888888.........\n' +
        '.........,8888888888888888888888888..........\n' +
        '..........+88888888888888888888888+..........\n' +
        '...........,888888888888888888888:...........\n' +
        '.............DD888888888888888DD.............\n' +
        chalk.blue('\nWelcome to the Spring Boot Microservice Generator\n\n')));

    var prompts = [
        {
            type: 'string',
            name: 'packageName',
            message: '(1/10) What is your default package name?',
            default: 'com.example.myservice'
        },
        {
            type: 'string',
            name: 'baseName',
            message: '(2/10) What is the base name of service?',
            default: 'myservice'
        },
        {
            type: 'string',
            name: 'serviceDescription',
            message: '(3/10) Give a short description of service.',
            default: 'My Microservice'
        },
        {
            type: 'string',
            name: 'dockerPrefix',
            message: '(4/10) What is your Docker prefix?',
            default: 'example'
        },
        {
            type: 'confirm',
            name: 'useSonar',
            message: '(5/10) Do you want to use SonarQube?',
            default: false
        }       ,
        {
            type: 'confirm',
            name: 'useScmAndDm',
            message: '(6/10) Do you want to use SCM and Distribution Management?',
            default: false
        },
        {
            type: 'list',
            name: 'databaseType',
            message: '(7/10) Which *type* of database would you like to use?',
            choices: [
                {
                    value: 'none',
                    name: 'None'
                },
                {
                    value: 'sql',
                    name: 'SQL (H2, MySQL, PostgreSQL)'
                },
                {
                    value: 'mongodb',
                    name: 'MongoDB'
                }
            ],
            default: 'none'
        },
        {
            when: function (response) {
                return response.databaseType == 'sql';
            },
            type: 'list',
            name: 'prodDatabaseType',
            message: '(8/10) Which *production* database would you like to use?',
            choices: [
                {
                    value: 'mysql',
                    name: 'MySQL'
                },
                {
                    value: 'postgresql',
                    name: 'PostgreSQL'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return (response.databaseType == 'sql' && response.prodDatabaseType == 'mysql');
            },
            type: 'list',
            name: 'devDatabaseType',
            message: '(9/10) Which *development* database would you like to use?',
            choices: [
                {
                    value: 'h2Memory',
                    name: 'H2 in-memory with Web console'
                },
                {
                    value: 'mysql',
                    name: 'MySQL'
                }
            ],
            default: 0
        },
        {
            when: function (response) {
                return (response.databaseType == 'sql' && response.prodDatabaseType == 'postgresql');
            },
            type: 'list',
            name: 'devDatabaseType',
            message: '(10/10) Which *development* database would you like to use?',
            choices: [
                {
                    value: 'h2Memory',
                    name: 'H2 in-memory with Web console'
                },
                {
                    value: 'postgresql',
                    name: 'PostgreSQL'
                }
            ],
            default: 0
        }
    ];

    this.prompt(prompts, function (props) {
        this.packageName = props.packageName;
        this.baseName = props.baseName;
        this.starters = props.starters;
        this.dockerPrefix = props.dockerPrefix;
        this.useSonar = props.useSonar;
        this.useScmAndDm = props.useScmAndDm;
        this.serviceDescription = props.serviceDescription;
        this.databaseType = props.databaseType;
        this.devDatabaseType = props.devDatabaseType;
        this.prodDatabaseType = props.prodDatabaseType;

        cb();
    }.bind(this));
};

SpringGenerator.prototype.app = function app() {
    // ----------------------------
    // Micro service starter REST
    // ----------------------------
    var packageFolder = this.packageName.replace(/\./g, '/');
    var restDir = this.baseName + '-rest/';
    var restDirTemplate = 'microservice-starter-rest/';
    var javaDir = restDir + 'src/main/java/' + packageFolder + '/';
    var javaDirTemplate = restDirTemplate + 'src/main/java/package/';
    var dockerDir = restDir + 'src/main/docker/';
    var dockerDirTemplate = restDirTemplate + 'src/main/docker/';
    var resourceDir = restDir + 'src/main/resources/';
    var resourceDirTemplate = restDirTemplate + 'src/main/resources/';
    var testDir = restDir + 'src/test/java/' + packageFolder + '/';
    var testDirTemplate = restDirTemplate + 'src/test/java/package/';

    // Docker
    //this.template(dockerDirTemplate + 'Dockerfile', dockerDir  + 'Dockerfile', this, {});

    // Resource
    this.template(resourceDirTemplate + 'application.yml', resourceDir  + 'application.yml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });
    //this.template(resourceDirTemplate + 'application-dev.yml', resourceDir  + 'application-dev.yml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });
    //this.template(resourceDirTemplate + 'application-prod.yml', resourceDir  + 'application-prod.yml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });
    this.template(resourceDirTemplate + 'bootstrap.yml', resourceDir  + 'bootstrap.yml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });

    // Test
    //this.template(testDirTemplate + 'ApplicationTests.java', testDir + 'ApplicationTests.java', this, {});
    this.template(testDirTemplate + 'rest/controller/HomeControllerTest.java', testDir + 'rest/controller/HomeControllerTest.java', this, {});


    // Java
    this.template(javaDirTemplate + 'Application.java', javaDir + 'Application.java', this, {});
    this.template(javaDirTemplate + 'config/ApplicationSettings.java', javaDir + 'config/ApplicationSettings.java', this, {});
    this.template(javaDirTemplate + 'config/SecurityConfig.java', javaDir + 'config/SecurityConfig.java', this, {});
    this.template(javaDirTemplate + 'config/CustomPermissionEvaluator.java', javaDir + 'config/CustomPermissionEvaluator.java', this, {});
    this.template(javaDirTemplate + 'rest/controller/HomeController.java', javaDir + 'rest/controller/HomeController.java', this, {});
    this.template(javaDirTemplate + 'rest/assembler/package-info.java', javaDir + 'rest/assembler/package-info.java', this, {});
    this.template(javaDirTemplate + 'rest/global/GlobalExceptionHandler.java', javaDir + 'rest/global/GlobalExceptionHandler.java', this, {});
    this.template(javaDirTemplate + 'core/package-info.java', javaDir + 'core/package-info.java', this, {});


    // Project
    this.template(restDirTemplate + 'pom.xml', restDir + 'pom.xml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });

    // ----------------------------
    // Micro service starter MODEL
    // ----------------------------
    var modelDir = this.baseName + '-model/';
    var modelDirTemplate = 'microservice-starter-model/';
    var modelJavaDir = modelDir + 'src/main/java/' + packageFolder + '/model/';
    var modelJavaDirTemplate = modelDirTemplate + 'src/main/java/package/';
    var modelResourceDir = modelDir + 'src/main/resources/';
    var modelResourceDirTemplate = modelDirTemplate + 'src/main/resources/';
    var modelTestDir = modelDir + 'src/test/java/' + packageFolder + '/model/';
    var modelTestDirTemplate = modelDirTemplate + 'src/test/java/package/';


    // Java
    this.template(modelJavaDirTemplate + 'package-info.java', modelJavaDir + 'package-info.java', this, {});

    // Project
    this.template(modelDirTemplate + 'pom.xml', modelDir + 'pom.xml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });

    // ----------------------------
    // Micro service starter IT
    // ----------------------------
    var itDir = this.baseName + '-it/';
    var itDirTemplate = 'microservice-starter-it/';
    var itResourceDir = itDir + 'src/test/resources/';
    var itResourceDirTemplate = itDirTemplate + 'src/test/resources/';
    var itTestDir = itDir + 'src/test/java/' + packageFolder + '/it/';
    var itTestDirTemplate = itDirTemplate + 'src/test/java/package/';

    // Java
    this.template(itTestDirTemplate + 'IntegrationTest.java', itTestDir + 'IntegrationTest.java', this, { 'interpolate': /<%=([\s\S]+?)%>/g });

    // Project
    this.template(itDirTemplate + 'pom.xml', itDir + 'pom.xml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });

    // Resource
    this.template(itResourceDirTemplate + 'mock1.json', itResourceDir + 'mock1.json', this, { 'interpolate': /<%=([\s\S]+?)%>/g });


    // ----------------------------
    // Micro service starter MAIN
    // ----------------------------
    this.template('pom.xml', 'pom.xml', this, { 'interpolate': /<%=([\s\S]+?)%>/g });
    this.template('.npmignore', '.gitignore', this, {});

    this.config.set('packageName', this.packageName);
    this.config.set('packageFolder', packageFolder);
};

SpringGenerator.prototype.projectfiles = function projectfiles() {

};
