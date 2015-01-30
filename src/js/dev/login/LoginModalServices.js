app.service('loginModal', function ($modal, $rootScope, $cookieStore) {

    function assignCurrentUser (user) {
        $rootScope.currentUser = user;
        // Cookies
        $cookieStore.put('istoUserId', user.id);
        $cookieStore.put('istoUserClub', user.clubName);
        $cookieStore.put('istoUserName', user.userName);
        $cookieStore.put('istoUserType', user.userType);
        
        return user;
    }
    
    return function() {
        var instance = $modal.open({
            templateUrl: 'partials/loginModalTemplate.html',
            controller: 'LoginModalCtrl',
            controllerAs: 'LoginModalCtrl'
        })
    
        return instance.result.then(assignCurrentUser);
    };
})