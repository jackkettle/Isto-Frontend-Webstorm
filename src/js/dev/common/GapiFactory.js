app.factory('Gapi', function($timeout, $q) {
    return {
        load: function load() {
            if (typeof gapi.client.api === 'undefined') {
                return $timeout(load, 500);
            }else{
                $q.promise
            }
        }
    };
})