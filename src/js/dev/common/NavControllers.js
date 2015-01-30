app.controller('navController', function($scope, $location, $rootScope) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    
    var absUrl= $location.absUrl();
    //check for src
    
    if(absUrl.indexOf("src") > -1){
        $rootScope.base = $location.protocol() + "://" + $location.host() + "/src/";
    }else{
        $rootScope.base = $location.protocol() + "://" + $location.host() + "/";
    }
})