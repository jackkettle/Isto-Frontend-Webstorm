app.controller('defaultCompetitionController', function($scope, $http) {
   $scope.tab = "info";
   
   // load in routines json
    $http.get(routinesJson)
        .then(function(res){
            $scope.routineData = res.data;
        });
        
    $http.get(travelJson)
        .then(function(res){
            $scope.travelData = res.data;
        });

    $scope.getTotalTariff = function( $scope ){
        var total = 0;
        for(var i = 0; i < $scope.length; i++){
            total += $scope[i].tariff;
        }

        total = Math.round( total * 10) / 10;
        return total;
    }

})

app.controller('competitionController', function($scope, $stateParams, $http) {
        
    if($stateParams.id == 'info'){
        $scope.tab1 = true;
    }
    if($stateParams.id == 'routines'){
        $scope.tab2 = true;
    }
    if($stateParams.id == 'schedule'){
        $scope.tab3 = true;
    }
    if($stateParams.id == 'tariff'){
        $scope.tab4 = true;
    }
    if($stateParams.id == 'travel'){
        $scope.tab5 = true;
    }

    // load in routines json
    $http.get(routinesJson)
        .then(function(res){
            $scope.routineData = res.data;
        });
        
    $http.get(travelJson)
        .then(function(res){
            $scope.travelData = res.data;
        });

    $scope.getTotalTariff = function( $scope ){
        var total = 0;
        for(var i = 0; i < $scope.length; i++){
            total += $scope[i].tariff;
        }

        total = Math.round( total * 10) / 10;
        return total;
    }
    
})

app.controller("scheduleController", function($scope, $http) {
    $http.get(scheduleJson).then(function(res){
           console.log(res);
           $scope.daysData = res.data;
    });
})

app.controller("socialController", function($scope, $http) {
    $http.get(socialJson).then(function(res){
           console.log(res);
           $scope.socialData = res.data;
    });
})