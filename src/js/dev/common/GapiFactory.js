app.factory('Gapi', function($timeout, $q) {
    return {
        load: function load() {
            if (typeof gapi.client === 'undefined') {
                console.log("gapi.client");
                return $timeout(load, 500);
            } else if (typeof gapi.client.api === 'undefined') {
                console.log("gapi.client.api");
                return $timeout(load, 500); 
            } else{
                return $timeout(function() {
                    console.log("Api loaded");
                }, 500);
            }
        },
    };
})