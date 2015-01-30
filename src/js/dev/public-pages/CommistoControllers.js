app.controller('commistoController', function($scope, $http) {
    $http.get(commistoJson)
        .then(function(res){
            $scope.committee = res.data;
        });
})
