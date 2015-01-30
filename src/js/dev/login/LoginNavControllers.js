app.controller('loginNavController', function ($scope, $state, loginModal, $rootScope, $cookieStore) {

    $scope.logOut = function () {
        $rootScope.currentUser = null;
        $cookieStore.remove('istoUserId');
        $cookieStore.remove('istoUserClub');
        $cookieStore.remove('istoUserName');
        $cookieStore.remove('istoUserType');
        $state.go('home');
        location.reload();
    }
    
    $scope.logModal = function () {
        loginModal()
            .then(function () {
                    $state.go('dashboard');
            })
    }
    
})