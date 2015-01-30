app.controller('deleteMemberModalController', function ($scope, $state, name, clubName) {
    
    
    $scope.name = name;
    $scope.clubName = clubName;
    
    $scope.delete = function(name, clubName){

        gapi.client.api.deleteMember({ 
            Club: name,
            Name: clubName
        }).execute(function(resp){
            console.log(resp);
            $scope.$dismiss();
            $state.reload();
        })
        
    }
    
    $scope.cancel = function() {
    
        $scope.$dismiss();
    }
    
})