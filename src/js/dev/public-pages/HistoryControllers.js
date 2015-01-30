app.controller('defaultHistoryController', function ($scope, $http) {
    $http.get(historyJson)
        .then(function(res){
            $scope.history = res.data;
        });
})