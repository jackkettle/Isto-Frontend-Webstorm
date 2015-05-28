app.controller('resultsController', function ($scope, $stateParams, ngTableParams, Gapi, $filter, $timeout, $q) {
    
    
    Gapi.load()
        .then(function () { 
            console.log("resultsController")
            gapi.client.api.getWinningScores({event: "trampoline"}).execute(function(resp){
                if(resp.items){
                    $scope.trampolineScores = resp.items;
                    console.log(resp.items);
                    $scope.level1 = resp.items.slice(0,3);
                    $scope.level2 = resp.items.slice(3,6);
                    $scope.level3 = resp.items.slice(6,9);
                    $scope.level4 = resp.items.slice(9,12);
                    $scope.level5 = resp.items.slice(12,15);
                    $scope.level6 = resp.items.slice(15,18);
                    $scope.disabledVar = false;
                    
                    console.log($scope.level1);
                }
                $scope.$apply();
            })
        })
})

