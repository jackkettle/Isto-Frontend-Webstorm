app.controller('LoginModalCtrl', function ($scope, UsersApi, $cookieStore,$rootScope) {

    this.cancel = function () {
        $scope.$dismiss();
    }
    
    this.submit = function (email, password) {
        UsersApi(email, password).then(function (user) {
            if(user.result == false){
                $scope.warning = true;
                $scope.message = "Invalid user or password.";
                $scope.apply();
            }else{
                var newUser = {
                    id : user.result.id,
                    clubName : user.result.clubName,
                    userName : user.result.userName,
                    userType : user.result.userType
                }
                $rootScope.currentUser = newUser;
                $scope.$close(newUser);
            }
        });
    };
})