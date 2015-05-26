app.controller('resultsController', function ($scope, $stateParams, ngTableParams, Gapi, $filter, $timeout, $q) {
    
    
    Gapi.load()
        .then(function () { 
            console.log("resultsController")
            gapi.client.api.getWinningScores({event: "trampoline"}).execute(function(resp){
                if(resp.items){
                    $scope.trampolineScores = resp.items;
                    console.log(resp.items);
                    $scope.level1 = resp.items.slice(0,3);
                    $scope.level2 = resp.items.slice(3,7);
                    $scope.level3 = resp.items.slice(7,11);
                    $scope.level4 = resp.items.slice(11,15);
                    $scope.level5 = resp.items.slice(15,19);
                    $scope.level6 = resp.items.slice(19,23);
                    $scope.disabledVar = false;
                    
                    console.log($scope.level1);
                }
                $scope.$apply();
            })
        })
})

