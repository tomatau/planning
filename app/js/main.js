curl( [
    'main'
], start, fail );

function start(App){
    log('started', App)
}

function fail(ex){
    console.log('FAIL', ex);
}
