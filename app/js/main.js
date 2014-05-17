curl( [
    'main'
], start, fail );

function start(App){
    console.log('started', App)
}

function fail(ex){
    console.log('FAIL', ex);
}
