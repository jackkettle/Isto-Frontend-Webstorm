app.controller('charityController', function($scope, $http) {
    $http.get(charityJson)
        .then(function(res){
            $scope.charity = res.data;
        });
})