app.controller('apiClubController', function($scope, Gapi, $rootScope, $modal) {
        
    $rootScope.trampLevels = [
        {name: "Novice", value: 1},
        {name: "Intermediate", value: 2},
        {name: "Inter-advanced", value: 3},
        {name: "Advanced", value: 4},
        {name: "Elite", value: 5},
        {name: "Elite-pro", value: 6}
    ];
    
    $rootScope.syncLevels = [
        {name: "Novice and Intermediate", value: 1},
        {name: "Intervanced and Advanced", value: 2},
        {name: "Elite and Pro-Elite", value: 3}
    ];
    
    $rootScope.teams = [
        {name: "A", value: 1},
        {name: "B", value: 2},
        {name: "C", value: 3}
    ];
    
    
    // Set stats
    $scope.socialCount = 0;
    $scope.MarshallsCount = 0;
    $scope.ScorekeeperCount = 0;
    
    $scope.trampJudgesCount = 0;
    $scope.tumblingJudgesCount = 0;
    $scope.dmtJudges = 0;
    $scope.totalJudges = 0;
    
    //Tramp
    $scope.trampCount1 = 0;
    $scope.trampCount2 = 0;
    $scope.trampCount3 = 0;
    $scope.trampCount4 = 0;
    $scope.trampCount5 = 0;
    $scope.trampCount6 = 0;
    
    //Tumbling
    $scope.tumblingCount1 = 0;
    $scope.tumblingCount2 = 0;
    $scope.tumblingCount3 = 0;
    $scope.tumblingCount4 = 0;
    $scope.tumblingCount5 = 0;
    
    //Tumbling
    $scope.dmtCount1 = 0;
    $scope.dmtCount2 = 0;
    $scope.dmtCount3 = 0;
    
    if(typeof gapi.client.api !== 'undefined'){
        gapi.client.api.getClub({Name: $rootScope.currentUser.clubName}).execute(
            	function(resp){
                    $scope.club  = resp;

                    if(resp.members){
                        for(var i = 0; i < resp.members.length; i++){
                            var member = resp.members[i];
                            
                            //stats
                            if(member.socialTicket){
                                $scope.socialCount++
                            }
                            
                            if(member.marshling){
                                $scope.MarshallsCount++
                            }
                            
                            if(member.scorekeeper){
                                $scope.ScorekeeperCount++
                            }
                            
                            //judges
                            if(member.trampolineFormJudge){
                                $scope.trampJudgesCount++
                            }
                            
                            if(member.tumblingJudge){
                                $scope.tumblingJudgesCount++
                            }
                            
                            if(member.dmtJudge){
                                $scope.dmtJudges++
                            }
                            
                            if(member.trampolineFormJudge || member.tumblingJudge || member.dmtJudge){
                                $scope.totalJudges++
                            }
    
                            //tramp
                            if(member.trampolineLevel){
                                switch (member.trampolineLevel) {
                                    case "1":
                                        $scope.trampCount1++;
                                        break;
                                    case "2":
                                        $scope.trampCount2++;
                                        break;
                                    case "3":
                                        $scope.trampCount3++;
                                        break;
                                    case "4":
                                        $scope.trampCount4++;
                                        break;
                                    case "5":
                                        $scope.trampCount5++;
                                        break;
                                    case "6":
                                        $scope.trampCount6++;
                                        break;
                                }
                            }
                            
                            //tumbling
                            if(member.tumblingLevel){
                                switch (member.tumblingLevel) {
                                    case "1":
                                        $scope.tumblingCount1++;
                                        break;
                                    case "2":
                                        $scope.tumblingCount2++;
                                        break;
                                    case "3":
                                        $scope.tumblingCount3++;
                                        break;
                                    case "4":
                                        $scope.tumblingCount4++;
                                        break;
                                    case "5":
                                        $scope.tumblingCount5++;
                                        break;
                                }
                            }
                            
                            //dmt
                            if(member.dmtLevel){
                                switch (member.dmtLevel) {
                                    case "1":
                                        $scope.dmtCount1++;
                                        break;
                                    case "2":
                                        $scope.dmtCount2++;
                                        break;
                                    case "3":
                                        $scope.dmtCount3++;
                                        break;
                                }
                            }
                        }
                    }
                    $scope.$apply()
                    
            	}
            )
    } else {
        Gapi.load()
        .then(function () {
            gapi.client.api.getClub({ Name: $rootScope.currentUser.clubName}).execute(
            	function(resp){
                    $scope.club  = resp;
                    if(resp.members){
                        for(var i = 0; i < resp.members.length; i++){
                            var member = resp.members[i];
                            
                            //stats
                            if(member.socialTicket){
                                $scope.socialCount++
                            }
                            
                            if(member.marshling){
                                $scope.MarshallsCount++
                            }
                            
                            if(member.scorekeeper){
                                $scope.ScorekeeperCount++
                            }
                            
                            //judges
                            if(member.trampolineFormJudge){
                                $scope.trampJudgesCount++
                            }
                            
                            if(member.tumblingJudge){
                                $scope.tumblingJudgesCount++
                            }
                            
                            if(member.dmtJudge){
                                $scope.dmtJudges++
                            }
                            
                            if(member.trampolineFormJudge || member.tumblingJudge || member.dmtJudge){
                                $scope.totalJudges++
                            }
    
                            //tramp
                            if(member.trampolineLevel){
                                switch (member.trampolineLevel) {
                                    case "1":
                                        $scope.trampCount1++;
                                        break;
                                    case "2":
                                        $scope.trampCount2++;
                                        break;
                                    case "3":
                                        $scope.trampCount3++;
                                        break;
                                    case "4":
                                        $scope.trampCount4++;
                                        break;
                                    case "5":
                                        $scope.trampCount5++;
                                        break;
                                    case "6":
                                        $scope.trampCount6++;
                                        break;
                                }
                            }
                            
                            //tumbling
                            if(member.tumblingLevel){
                                switch (member.tumblingLevel) {
                                    case "1":
                                        $scope.tumblingCount1++;
                                        break;
                                    case "2":
                                        $scope.tumblingCount2++;
                                        break;
                                    case "3":
                                        $scope.tumblingCount3++;
                                        break;
                                    case "4":
                                        $scope.tumblingCount4++;
                                        break;
                                    case "5":
                                        $scope.tumblingCount5++;
                                        break;
                                }
                            }
                            
                            //dmt
                            if(member.dmtLevel){
                                switch (member.dmtLevel) {
                                    case "1":
                                        $scope.dmtCount1++;
                                        break;
                                    case "2":
                                        $scope.dmtCount2++;
                                        break;
                                    case "3":
                                        $scope.dmtCount3++;
                                        break;
                                }
                            }
                        }
                    }
                    $scope.$apply() 
            	}
            )
        })
        .catch(function() {
            console.log("Error loading api");
        })
    }
    
    $scope.deleteMemberModal = function(clubName, name){
        var instance = $modal.open({
            templateUrl: 'partials/deleteMemberModal.html',
            controller: 'deleteMemberModalController',
            controllerAs: 'deleteMemberModalController',
            resolve: {
                clubName: function(){ return clubName },
                name: function(){ return name }
            }
        })
        
        return instance;
    }
    
})