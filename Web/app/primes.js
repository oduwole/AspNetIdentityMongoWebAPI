//this.onmessage = function(event) {
/*this.addEventListener('load', function(event) {
    // postMessage('hello segun');
    console.log(event);
    for (var n = event.data.from; n <= event.data.to; n += 1) {
        var found = false;
        for (var i = 2; i <= Math.sqrt(n); i += 1) {
            if (n % i == 0) {
                found = true;
                console.log(found);
                postMessage(n);
                break;
            }
        }
        if (!found) {
            // found a prime!
            postMessage(n);
        }
    }
});*/

/*self.addEventListener('message', function(event) {
    var data = event.data;
    console.log(data);
    postMessage(data.to);
}, false);*/

self.onmessage = function(event) {
    for (var n = event.data.from; n <= event.data.to; n += 1) {
        var found = false;
        for (var i = 2; i <= Math.sqrt(n); i += 1) {
            if (n % i == 0) {
                found = true;
                break;
            }
        }
        if (!found) {
            // found a prime!
            console.log(n);
            postMessage(n);
        }
    }
}