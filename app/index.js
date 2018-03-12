'use strict';
// Require dependencies
const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {

    initializing() {
        this.pkg = require('../package.json');
    }

    prompting() {
        console.log(chalk.blue(
            '\n.............DD88888888888888888,............\n' +
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
            chalk.blue('' +
                '\nWelcome to the Spring Boot Microservice Generator\n\n'
            )));
        const prompts = [
            {
                type: 'string',
                name: 'packageName',
                message: '(1/5) What is your default package name?',
                default: 'com.example.myservice'
            },
            {
                type: 'string',
                name: 'baseName',
                message: '(2/5) What is the base name of service?',
                default: 'myservice'
            },
            {
                type: 'string',
                name: 'serviceDescription',
                message: '(3/5) Give a short description of service.',
                default: 'This Microservice does awesome things'
            },
            {
                type: 'string',
                name: 'dockerRegistry',
                message: '(4/5) What is your Docker registry?',
                default: ''
            },
            {
                type: 'string',
                name: 'dockerPrefix',
                message: '(5/5) What is your Docker prefix?',
                default: 'example'
            }
        ];

        return this.prompt(prompts).then(answers => {
            this.packageName = answers.packageName;
            this.baseName = answers.baseName;
            this.starters = answers.starters;
            this.dockerPrefix = answers.dockerPrefix;
            this.dockerRegistry = answers.dockerRegistry;
            this.serviceDescription = answers.serviceDescription;
        });
    }

    writing() {
        this.packageFolder = this.packageName.replace(/\./g, '/');
        this._generateRest();
        this._generateModel();
        this._generateIT();
        this._generateMain();


    }

    install() {
        this.config.set('packageName', this.packageName);
        this.config.set('packageFolder', this.packageFolder);
    }

    end() {

    }

    _generateRest() {
        const restDir = this.baseName + '-rest/';
        const restDirTemplate = 'microservice-starter-rest/';
        const javaDir = restDir + 'src/main/java/' + this.packageFolder + '/';
        const javaDirTemplate = restDirTemplate + 'src/main/java/package/';
        const resourceDir = restDir + 'src/main/resources/';
        const resourceDirTemplate = restDirTemplate + 'src/main/resources/';
        const testDir = restDir + 'src/test/java/' + this.packageFolder + '/';
        const testDirTemplate = restDirTemplate + 'src/test/java/package/';

        // Resources
        this.fs.copyTpl(
            this.templatePath(resourceDirTemplate + 'application.yml'),
            this.destinationPath(resourceDir + 'application.yml'),
            {
                baseName: this.baseName,
                serviceDescription: this.serviceDescription
            }
        );

        this.fs.copyTpl(
            this.templatePath(resourceDirTemplate + 'bootstrap.yml'),
            this.destinationPath(resourceDir + 'bootstrap.yml'),
            {
                baseName: this.baseName
            }
        );

        // Test
        this.fs.copyTpl(
            this.templatePath(testDirTemplate + 'rest/controller/HomeControllerTest.java'),
            this.destinationPath(testDir + 'rest/controller/HomeControllerTest.java'),
            {
                packageName: this.packageName

            }
        );

        this.fs.copyTpl(
            this.templatePath(testDirTemplate + 'core/package-info.java'),
            this.destinationPath(testDir + 'core/package-info.java'),
            {
                packageName: this.packageName
            }
        );

        // Java
        this.fs.copyTpl(
            this.templatePath(javaDirTemplate + 'Application.java'),
            this.destinationPath(javaDir + 'Application.java'),
            {
                packageName: this.packageName
            }
        );

        this.fs.copyTpl(
            this.templatePath(javaDirTemplate + 'config/ApplicationSettings.java'),
            this.destinationPath(javaDir + 'config/ApplicationSettings.java'),
            {
                packageName: this.packageName
            }
        );

        this.fs.copyTpl(
            this.templatePath(javaDirTemplate + 'config/SecurityConfig.java'),
            this.destinationPath(javaDir + 'config/SecurityConfig.java'),
            {
                packageName: this.packageName
            }
        );

        this.fs.copyTpl(
            this.templatePath(javaDirTemplate + 'config/CustomPermissionEvaluator.java'),
            this.destinationPath(javaDir + 'config/CustomPermissionEvaluator.java'),
            {
                packageName: this.packageName
            }
        );

        this.fs.copyTpl(
            this.templatePath(javaDirTemplate + 'rest/controller/HomeController.java'),
            this.destinationPath(javaDir + 'rest/controller/HomeController.java'),
            {
                packageName: this.packageName
            }
        );

        this.fs.copyTpl(
            this.templatePath(javaDirTemplate + 'core/package-info.java'),
            this.destinationPath(javaDir + 'core/package-info.java'),
            {
                packageName: this.packageName
            }
        );

        // Project
        this.fs.copyTpl(
            this.templatePath(restDirTemplate + 'pom.xml'),
            this.destinationPath(restDir + 'pom.xml'),
            {
                baseName: this.baseName,
                dockerRegistry: this.dockerRegistry,
                dockerPrefix: this.dockerPrefix,
                packageName: this.packageName
            }
        );
    }

    _generateModel() {
        const modelDir = this.baseName + '-model/';
        const modelDirTemplate = 'microservice-starter-model/';
        const modelJavaDir = modelDir + 'src/main/java/' + this.packageFolder + '/model/';
        const modelJavaDirTemplate = modelDirTemplate + 'src/main/java/package/';

        // Java
        this.fs.copyTpl(
            this.templatePath(modelJavaDirTemplate + 'package-info.java'),
            this.destinationPath(modelJavaDir + 'package-info.java'),
            {
                packageName: this.packageName
            }
        );

        // Project
        this.fs.copyTpl(
            this.templatePath(modelDirTemplate + 'pom.xml'),
            this.destinationPath(modelDir + 'pom.xml'),
            {
                baseName: this.baseName,
                dockerRegistry: this.dockerRegistry,
                dockerPrefix: this.dockerPrefix,
                packageName: this.packageName
            }
        );

    }

    _generateIT() {
        const itDir = this.baseName + '-it/';
        const itDirTemplate = 'microservice-starter-it/';
        const itResourceDir = itDir + 'src/test/resources/';
        const itResourceDirTemplate = itDirTemplate + 'src/test/resources/';
        const itTestDir = itDir + 'src/test/java/' + this.packageFolder + '/it/';
        const itTestDirTemplate = itDirTemplate + 'src/test/java/package/';

        // Java
        this.fs.copyTpl(
            this.templatePath(itTestDirTemplate + 'IntegrationTest.java'),
            this.destinationPath(itTestDir + 'IntegrationTest.java'),
            {
                packageName: this.packageName
            }
        );

        // Project
        this.fs.copyTpl(
            this.templatePath(itDirTemplate + 'pom.xml'),
            this.destinationPath(itDir + 'pom.xml'),
            {
                baseName: this.baseName,
                dockerRegistry: this.dockerRegistry,
                dockerPrefix: this.dockerPrefix,
                packageName: this.packageName
            }
        );

        // Resources
        this.fs.copy(
            this.templatePath(itResourceDirTemplate + 'mock1.json'),
            this.destinationPath(itResourceDir + 'mock1.json')
        )
    }

    _generateMain() {
        // Project
        this.fs.copyTpl(
            this.templatePath('pom.xml'),
            this.destinationPath('pom.xml'),
            {
                baseName: this.baseName,
                dockerRegistry: this.dockerRegistry,
                dockerPrefix: this.dockerPrefix,
                packageName: this.packageName,
                serviceDescription: this.serviceDescription
            }
        );

        if (this.fs.exists(this.templatePath('ignorefiles'))) {
            this.fs.copyTpl(
                this.templatePath('ignorefiles'),
                this.destinationPath('.gitignore'),
                {
                    baseName: this.baseName
                }
            );
        }
    }
};