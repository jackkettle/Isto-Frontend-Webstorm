app.service('UsersApi', function ($modal, $rootScope) {

    return function (userName, password) {
        
        var details = {
            User: userName, 
            Password: password
        }
            
        var user = gapi.client.api.loginHash(details);
        return user;
    }
})