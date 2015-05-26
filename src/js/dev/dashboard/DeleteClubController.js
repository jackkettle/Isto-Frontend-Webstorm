app.controller('deleteClubController', function($scope, Gapi) {
    
    Gapi.load()
        .then(function () { 
            console.log("deleteClubController")
            gapi.client.api.getAllClubNames().execute(function(resp){
                if(resp.items){
                    console.log(resp);
                    $scope.allClubNames = resp.items;
                    $scope.disabledVar = false;
                    for(var i = 0; i < $scope.allClubNames.length; i++){
                        $scope.allClubNames[i] = $scope.allClubNames[i].toLowerCase();
                    }
                }
                $scope.$apply();
            })
        })
        
    $scope.deleteClub = function(name){
        console.log("Deleting club " + name);
        gapi.client.api.deleteClub({Club: name}).execute(function(resp){
            $state.go("dashboard");
        })
    }
    
})
