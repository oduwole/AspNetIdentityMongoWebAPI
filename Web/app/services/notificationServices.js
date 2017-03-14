app.factory("notificationService", ['$q', function($q) {

    var notificationServiceFactory = {};
    var _notifyClickMe = function(message) {
        defer = $q.defer();
        console.log('notify start');
        window.addEventListener('click', function() {
            // At first, let's check if we have permission for notification
            // If not, let's ask for it
            if (window.Notification && Notification.permission !== "granted") {
                Notification.requestPermission(function(status) {
                    if (Notification.permission !== status) {
                        Notification.permission = status;
                    }
                });
            }

            //button.addEventListener('click', function() {
            // If the user agreed to get notified
            // Let's try to send ten notifications
            if (window.Notification && Notification.permission === "granted") {
                var i = 0;

                var n = new Notification(message + ' said Hi!' + i, {
                    tag: 'soManyNotification'
                });
                n.onclick = function() {

                    window.location = "http://google.com";
                }


                /*var n = new Notification(message + " said Hi! " + i, {
                     tag: 'soManyNotification'
                 });*/
                // Using an interval cause some browsers (including Firefox) are blocking notifications if there are too much in a certain time.
                /*var interval = window.setInterval(function() {
                    // Thanks to the tag, we should only see the "Hi! 9" notification 
                    var n = new Notification(message + ' said Hi!' + i, {
                        tag: 'soManyNotification'
                    });
                    n.onclick = function() {

                            window.location = "http://google.com";
                        }
                        
                    if (i++ == 9) {
                        window.clearInterval(interval);
                    }
                }, 200);*/
            }

            // If the user hasn't told if he wants to be notified or not
            // Note: because of Chrome, we are not sure the permission property
            // is set, therefore it's unsafe to check for the "default" value.
            else if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function(status) {
                    // If the user said okay
                    if (status === "granted") {
                        var i = 0;

                        var n = new Notification(message + " said Hi! " + i, {
                            tag: 'soManyNotification'
                        });
                        // Using an interval cause some browsers (including Firefox) are blocking notifications if there are too much in a certain time.
                        /*var interval = window.setInterval(function() {
                            // Thanks to the tag, we should only see the "Hi! 9" notification 
                            
                            if (i++ == 9) {
                                window.clearInterval(interval);
                            }
                        }, 200);*/
                    }

                    // Otherwise, we can fallback to a regular modal alert
                    else {
                        alert(message);
                    }
                });
            }

            // If the user refuses to get notified
            else {
                // We can fallback to a regular modal alert
                alert("Hi!");
            }
            // });
        });
        return defer.promise;
    }

    var _notifyMe = function(message) {
        defer = $q.defer();
        console.log('notify start');
        window.addEventListener('load', function() {
            // At first, let's check if we have permission for notification
            // If not, let's ask for it
            if (window.Notification && Notification.permission !== "granted") {
                Notification.requestPermission(function(status) {
                    if (Notification.permission !== status) {
                        Notification.permission = status;
                    }
                });
            }

            //button.addEventListener('click', function() {
            // If the user agreed to get notified
            // Let's try to send ten notifications
            if (window.Notification && Notification.permission === "granted") {
                var i = 0;

                var n = new Notification(message + ' said Hi!' + i, {
                    tag: 'soManyNotification'
                });
                n.onclick = function() {

                    window.location = "http://google.com";
                }


                /*var n = new Notification(message + " said Hi! " + i, {
                     tag: 'soManyNotification'
                 });*/
                // Using an interval cause some browsers (including Firefox) are blocking notifications if there are too much in a certain time.
                /*var interval = window.setInterval(function() {
                    // Thanks to the tag, we should only see the "Hi! 9" notification 
                    var n = new Notification(message + ' said Hi!' + i, {
                        tag: 'soManyNotification'
                    });
                    n.onclick = function() {

                            window.location = "http://google.com";
                        }
                        
                    if (i++ == 9) {
                        window.clearInterval(interval);
                    }
                }, 200);*/
            }

            // If the user hasn't told if he wants to be notified or not
            // Note: because of Chrome, we are not sure the permission property
            // is set, therefore it's unsafe to check for the "default" value.
            else if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function(status) {
                    // If the user said okay
                    if (status === "granted") {
                        var i = 0;

                        var n = new Notification(message + " said Hi! " + i, {
                            tag: 'soManyNotification'
                        });
                        // Using an interval cause some browsers (including Firefox) are blocking notifications if there are too much in a certain time.
                        /*var interval = window.setInterval(function() {
                            // Thanks to the tag, we should only see the "Hi! 9" notification 
                            
                            if (i++ == 9) {
                                window.clearInterval(interval);
                            }
                        }, 200);*/
                    }

                    // Otherwise, we can fallback to a regular modal alert
                    else {
                        alert(message);
                    }
                });
            }

            // If the user refuses to get notified
            else {
                // We can fallback to a regular modal alert
                alert("Hi!");
            }
            // });
        });
        return defer.promise;
    }

    notificationServiceFactory.notifyMe = _notifyMe;
    notificationServiceFactory.notifyClickMe = _notifyClickMe;
    return notificationServiceFactory;
}]);