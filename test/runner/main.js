/////////////
// globals //
/////////////
require.config({
    baseUrl: '../',
    paths: {
        // utils
        utilities: 'app/js/utilities',
        // testing only
        chai: 'bower_components/chai/chai',
        sinon: 'bower_components/sinon-builds/pkg/sinon-1.8.2', // bower sinon has no spy
        sinonChai: 'bower_components/sinon-chai/lib/sinon-chai'
    }
});
require([ 'chai', 'sinonChai', 'sinon' ], 
    function( chai, sinonChai ){
        // make test tools globally available
        window.chai = chai;
        // setup should in chai
        chai.should();
        chai.use(sinonChai);
        // setup mocha
        mocha.setup('bdd');

        /////////////////
        // curl config //
        /////////////////
        require.config({
            paths: {
                curlConfig: 'app/js/curl.config',
                parseConfig: 'test/runner/parseConfig',
                testsArray: 'test/runner/tests',
            }
        });
        require([
            'curlConfig',
            'parseConfig',
            'testsArray'
        ], function( curlConfig, parseConfig, testsArray ){
            var pack, path,
                requireConfig = {
                    baseUrl: '../app/js',
                    paths: {
                        test: '../../test'
                    }
                };
            // get all packages from curl config
            for ( pack in curlConfig.packages ) {
                requireConfig.paths[pack] = curlConfig.packages[pack].location;
            }
            // get all paths from curl config
            for ( path in curlConfig.paths ) {
                if ( typeof curlConfig.paths[path] == "string" ) {
                    requireConfig.paths[path] = curlConfig.paths[path];
                }
            }
            require.config(requireConfig);

            ///////////////
            // Run Tests //
            ///////////////
            require( testsArray, 
                function(){
                    mocha.run();
                });
        });
    }
);
