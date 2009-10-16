Array.prototype.count = function(fn) {
    var count = 0;
    for (var i = 0; i < this.length; i++) {
        if(fn(this[i])) {
            count++;
        }
    }
    return count;
};

