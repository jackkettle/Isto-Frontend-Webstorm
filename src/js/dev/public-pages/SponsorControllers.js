app.controller('sponsorController', function($scope, $http) {
    $http.get(sponsorJson)
        .then(function(res){
            $scope.sponsors = res.data;
        });
})