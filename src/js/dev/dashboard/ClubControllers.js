app.controller('apiClubController', function($scope, Gapi, $rootScope, $modal, $timeout, $filter, ngTableParams) {
    
        
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
    $scope.memberCount = 0;
    $scope.socialCount = 0;
    $scope.MarshallsCount = 0;
    $scope.ScorekeeperCount = 0;
    $scope.commistoCount = 0;
    
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
    
    $rootScope.data = [];
    
    // table vars
    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 5,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        },
        filter: {

        }
    }, {
        counts: [5,10,25,50],
        total: 0,
        getData: function($defer, params) {
            params.total($scope.data.length);
            
            var filteredData = params.filter() ?
                    $filter('filter')($scope.data, params.filter()) :
                    $scope.data;
            
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                $scope.data;
                
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    },{
    });
    $scope.tableParams.settings().$scope = $scope;
    
    // Get club members and compute stats
    $scope.callApiGetClub = function(nameParam) {
        
        // Set stats
        $scope.memberCount = 0;
        $scope.socialCount = 0;
        $scope.MarshallsCount = 0;
        $scope.ScorekeeperCount = 0;
        $scope.commistoCount = 0;
        
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
        
        gapi.client.api.getDmtTumblingCount({Option: 1}).execute(function(resp) {
            if(resp.items){
                $rootScope.maxTotalTumbling = resp.items[0];
                $rootScope.$apply();
            }
        })
        
        gapi.client.api.getDmtTumblingCount({Option: 2}).execute(function(resp) {
            if(resp.items){
                $rootScope.maxTotalDmt = resp.items[0];
                $rootScope.$apply();
            }
        })
        
        gapi.client.api.getDmtTumblingCount({Option: 3}).execute(function(resp) {
            if(resp.items){
                $rootScope.maxTotalSync = resp.items[0];
                $rootScope.$apply();
            }
        })
        
        gapi.client.api.getClub({ Name: nameParam}).execute(function(resp){
            $rootScope.club  = resp;
            if(resp.members){
                $rootScope.data = $scope.club.members;
                
                // Get stats for each member
                for(var i = 0; i < resp.members.length; i++){
                    var member = resp.members[i];
                    
                    //stats
                    $scope.memberCount++;
                    if(member.socialTicket){        $scope.socialCount++ }
                    if(member.marshling){           $scope.MarshallsCount++ }
                    if(member.scorekeeper){         $scope.ScorekeeperCount++ }
                    if(member.pastCommISTO){        $scope.commistoCount++ }
                    
                    //judges
                    if(member.trampolineFormJudge){ $scope.trampJudgesCount++ }
                    if(member.tumblingJudge){       $scope.tumblingJudgesCount++ }
                    if(member.dmtJudge){            $scope.dmtJudges++ }
                    if(member.trampolineFormJudge || member.tumblingJudge || member.dmtJudge){
                        $scope.totalJudges++
                    }

                    //tramp
                    if(member.trampolineLevel && member.trampolineCompetitor){
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
                    if(member.tumblingLevel && member.tumblingCompetitor){
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
                    if(member.dmtLevel && member.dmtCompetitor){
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
                $scope.tableParams.reload();
                $scope.$apply();
            }
    	})
    }
    
    $scope.deleteMemberModal = function(clubName, id, name){
        var instance = $modal.open({
            templateUrl: 'partials/deleteMemberModal.html',
            controller: 'deleteMemberModalController',
            controllerAs: 'deleteMemberModalController',
            resolve: {
                clubName: function(){ return clubName },
                id: function(){ return id },
                name: function(){ return name }
            }
        })
        
        return instance;
    }

    // Call club details
    Gapi.load()
        .then(function () { 
            $scope.callApiGetClub($rootScope.currentUser.clubName);
            
            // if commISTO user add club options also
            if($rootScope.currentUser.userType === 2){
                gapi.client.api.getAllClubNames().execute(
                    function(resp){
                        if(resp.items){
                            $scope.allClubNames = resp;
                        }
                        $scope.$apply();
                    })
            }
            
        });
})


