app.controller('addUserController', function($scope, Gapi, $state) {
    
    $scope.disabledVar = true;
    
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
            gapi.client.api.getAllClubNames().execute(function(resp){
                if(resp.items){
                    $scope.allClubNames = resp.items;
                    $scope.disabledVar = false;
                }
                $scope.$apply();
            })
        })
        
    $scope.$watch('username', function(value) {
        if($scope.allUserNames){
            if(!contains( $scope.allUserNames, value)){
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
