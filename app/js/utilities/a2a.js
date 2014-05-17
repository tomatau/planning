module.exports = window.a2a = function(args, idx){
    return idx = (idx || 0), [].slice.call(args, 0, idx);
}
