app.controller("scheduleController", function($scope, $http) {
    $http.get(scheduleJson).then(function(res){
           $scope.daysData = res.data;
    });
})
