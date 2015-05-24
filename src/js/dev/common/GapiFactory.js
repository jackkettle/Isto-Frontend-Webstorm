app.factory('Gapi', function($timeout, $q) {
    return {
        load: function load() {
            if (typeof gapi.client === 'undefined') {
                return $timeout(load, 500);
            } else if (typeof gapi.client.api === 'undefined') {
                return $timeout(load, 500); 
            } else{
                return $timeout(function() {
                }, 500);
            }
        },
    };
})