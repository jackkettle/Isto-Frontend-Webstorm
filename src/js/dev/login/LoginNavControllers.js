app.controller('loginNavController', function ($scope, $state, loginModal, $rootScope, $cookieStore) {

    var _Club = 1;
    var _CommISTO = 2;
    var _ScoreKeeper = 3;
    
    var _ClubText = "Club";
    var _CommISTOText = "CommISTO";
    var _ScoreKeeperText = "ScoreKeeper";

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
    
    $scope.getUserType = function (User) {
        var tmp = '';
        if(User !== 'undefined' && User.userType !== 'undefined'){
            switch(User.userType) {
                case _Club:
                    tmp = _ClubText;
                    break;
                case _CommISTO:
                    tmp = _CommISTOText;
                    break;
                case _ScoreKeeper:
                    tmp = _ScoreKeeperText;
                    break;
                default:
                    tmp = '';
            }
        }
        return tmp;
    }
})