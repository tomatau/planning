(function (root, factory) {
    'use strict';
    if ( root.document == undefined ) {
        module.exports = factory()
    } else {
        root.curl = factory();
    }
}(this, function () {
    return (function(root){
        var libPath = "",
            vendorPath = libPath + "_vendor/",
            tomataoPath = libPath + "tomatao/",
            pluginPath = vendorPath + 'plugin/',
            loaderPath = vendorPath + 'loader/',
            packagePath = 'module/',
            cloudflare = '//cdnjs.cloudflare.com/ajax/libs/',
            googleapis = '//ajax.googleapis.com/ajax/libs/';

        /* Start of Config
        ########### */
        var config = {

            baseUrl: '../app/js',

            pluginPath: pluginPath,

            // don't have package or path called 'test'
            paths: {

                /* vendor
                ########### */
                'jquery': vendorPath + 'jquery'
                ,'underscore': vendorPath + 'underscore'
                ,'backbone': vendorPath + 'backbone'
                ,'meld': vendorPath + 'meld'

                /* tomatao
                ########### */
                ,'console': {
                    location: tomataoPath + 'console',
                    config: {
                        loader: loaderPath + 'legacy',
                        exports: 'console'
                    }
                }
                ,'a2a': {
                    location: 'utilities/a2a',
                    config: {
                        loader: loaderPath + 'cjsm11'
                    }
                }
            },

            packages: {

                // main application
                'core': {
                    location: 'core/',
                    main: 'core',
                    config: {
                        loader: loaderPath + 'cjsm11',
                    }
                },

                'main': {
                    location: 'main/',
                    main: 'app',
                    config: {
                        loader: loaderPath + 'cjsm11',
                    }
                },

                'extensions': {
                    location: 'extensions/',
                    config: {
                        loader: loaderPath + 'cjsm11',
                    }
                },
                
                // global use cases
                'use-case' : {
                    location: 'use-case/',
                    config: {
                        loader: loaderPath + 'cjsm11',
                    }
                }

                // global entities
                ,'entities' : {
                    location: 'entities/',
                    config: {
                        loader: loaderPath + 'cjsm11',
                    }
                }
            }
        };

        return config;
    }( this ));
}));
