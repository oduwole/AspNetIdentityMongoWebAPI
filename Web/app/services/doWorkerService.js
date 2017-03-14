'use strict';

/* Services */
//var app = angular.module('myApp.services', []);

app.factory("HelloWorldService", ['$q', function($q) {

    var doWorkerServiceFactory = {};
    // var worker = new Worker('js/doWork.js');
    var worker = new Worker('app/primes.js');
    //var worker = new Worker("demoworker.js");
    var defer;
    worker.addEventListener('load', function(e) {
        console.log('Worker said: ', e.data);
        defer.resolve(e.data);
    }, false);

    var _doWork = function(myData) {
        defer = $q.defer();
        /// console.log(myData);
        // worker.postMessage(myData); // Send data to our worker. 
        worker.onmessage = function(event) { //Listen for thread messages
            console.log(event);
            console.log(event.data); //Log to the Chrome console
        };
        worker.postMessage(myData);
        /*worker.postMessage({
            from: 1,
            to: 10
        });*/ //Start the worker with args
        return defer.promise;
    }

    var _testWorker = function() {
        var worker; //Construct worker

        if (typeof(Worker) !== "undefined") {
            if (typeof(w) == "undefined") {
                worker = new Worker('primes.js');
            }
            worker.onmessage = function(event) {
                console.log(event);
            };

            //worker.onmessage('segun');
            worker.postMessage('{"from": 1,"to": 100}'); //Start the worker with args


            worker.onerror = function(error) {
                console.log(error);
            };
            console.log(worker);
        } else {
            console.log("Sorry, your browser does not support Web Workers...");
        }

    }

    var _startWorker = function() {
        console.log('web worker started');
        if (typeof(Worker) !== "undefined") {
            if (typeof(w) == "undefined") {
                worker = new Worker("demoworker.js");
            }
            worker.onmessage = function(event) {
                document.getElementById("result").innerHTML = event.data;
                // console.log(event);
            };
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
        }
    }

    var _stopWorker = function() {
        worker.terminate();
        worker = undefined;
    }

    doWorkerServiceFactory.doWork = _doWork;
    doWorkerServiceFactory.testWorker = _testWorker;
    doWorkerServiceFactory.startWorker = _startWorker
    doWorkerServiceFactory.stopWorker = _stopWorker;
    return doWorkerServiceFactory;

}]);

/*


 */