app.controller('deleteUserController', function($scope, Gapi, $state) {
    
    Gapi.load()
        .then(function () { 
            console.log("addUserController")
            gapi.client.api.getAllUserNames().execute(function(resp){
                if(resp.items){
                    console.log(resp);
                    $scope.allUserNames = resp.items;
                    $scope.disabledVar = false;
                }
                $scope.$apply();
            })
        })
        
    $scope.deleteUser = function(name){
        console.log("Deleting name " + name);
        gapi.client.api.deleteUser({Name: name}).execute(function(resp){
            $state.go("dashboard");
        })
    }
})
