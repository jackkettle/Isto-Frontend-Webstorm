app.controller('deleteMemberModalController', function ($scope, $state, clubName, id, name) {
    
    
    $scope.id = id;
    $scope.clubName = clubName;
    $scope.name = name;
    
    $scope.delete = function(clubName, id){

        console.log("id " + id);
        console.log("clubName " + clubName);
        
        gapi.client.api.deleteMemberId({ 
            Id: id,
            Club: clubName
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