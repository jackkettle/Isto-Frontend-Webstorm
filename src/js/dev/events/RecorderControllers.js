app.controller('recorderController', function ($scope, $stateParams, ngTableParams, Gapi, $filter) {
    
    // State params
    $scope.event = $stateParams.event;
    $scope.level = $stateParams.level;
    
    // init data
    $scope.data = [];
    
    console.log($scope.event);
    console.log($scope.level);
    
    // int Table
    $scope.tableParamsRecord = new ngTableParams({
        page: 1,            // show first page
        count: 20,          // count per page
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
    });
    $scope.tableParamsRecord.settings().$scope = $scope;
    
    
    // Get members
    Gapi.load().then(function () { 
        gapi.client.api.getAllClubs().execute(function(resp){
            
            // iterate through clubs 
            for (var i = resp.items.length; i--; ) {
                
                var club = resp.items[i];
                if(club.members){
                    for (var j = club.members.length; j--; ) {
                        
                        if(isInEvent(club.members[j], $scope.event, $scope.level) ){
                            console.log(club.members[j]);
                            club.members[j].club=club.name;
                            $scope.data.push(club.members[j]);
                        }
                        
                    }
                }
                
            }
            $scope.loadingVar = false;
            $scope.tableParamsRecord.reload();
            $scope.$apply();
        })
    });

    var isInEvent = function (member, event, level) {
        var bool = false;
        
        switch(event) {
            case TRAMPOLINE:
                
                if(member.trampolineLevel === level){
                    bool = true;
                }
                
                break;
            case SYNCRO:
                
                if(member.trampolineSyncLevel === level){
                    bool = true;
                }
                
                break;
            case TUMBLING:
                
                if(member.tumblingLevel === level){
                    bool = true;
                }
                
                break;
            case DMT:
                
                if(member.dmtLevel === level){
                    bool = true;
                }
                
                break;
            default:
        }   
        
        return bool;
    }
    
    // Sort out whos doing said event
    
    $scope.getEventMembers = function(event, level) {
        
    }
    
    $scope.setMemberScore = function() {
        
    }
    
    var TRAMPOLINE = 'trampoline';
    var SYNCRO = 'syncro';
    var TUMBLING = 'tumbling';
    var DMT = 'dmt';
    
})