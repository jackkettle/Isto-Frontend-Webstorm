app.controller('addUserController', function($scope, Gapi) {
    
    $scope.disabledVar = true;
    
    Gapi.load()
        .then(function () { 
            console.log("addUserController")
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
   
    $scope.addUser = function(name, password, club, type){
        gapi.client.api.addUser({Name: name, Password: password, Club: club, Type: type}).execute(function(resp){
            console.log("User added " + name + ", " + password + ", " + club + ", " + type);
            $state.go("dashboard");
        })
    }
})
