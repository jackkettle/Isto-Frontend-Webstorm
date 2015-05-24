app.controller('addClubController', function($scope, Gapi, $state) {
    
    $scope.disabledVar = true;
    
    Gapi.load()
        .then(function () { 
            console.log("addClubController")
            gapi.client.api.getAllClubNames().execute(function(resp){
                if(resp.items){
                    $scope.allClubNames = resp.items;
                    $scope.disabledVar = false;
                    for(var i = 0; i < $scope.allClubNames.length; i++){
                        $scope.allClubNames[i] = $scope.allClubNames[i].toLowerCase();
                    }
                }
                $scope.$apply();
            })
        })
        
    $scope.$watch('clubName', function(value) {
        if($scope.allClubNames){
            if(!contains( $scope.allClubNames, value)){
                $scope.disabledVar = false;
                $scope.disabledMessageVar = true;
            }else{
                $scope.disabledVar = true;
                $scope.disabledMessageVar = false;
            }
        }
   });
   
    var contains = function(list, value){
       for (var i = list.length; i--; ) {
           if(list[i].toLowerCase() === value.toLowerCase()){
               return true;
           }
       }
       return false;
    }
   
    $scope.addClub = function(club){
        gapi.client.api.addClub({Name: club}).execute(function(resp){
            console.log("Club added " + club)
            $state.go("dashboard");
        })
    }
})
