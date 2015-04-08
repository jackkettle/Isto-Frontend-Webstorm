app.controller('recorderController', function ($scope, $stateParams, ngTableParams, Gapi, $filter, $timeout) {
    
    // State params
    $scope.event = $stateParams.event;
    $scope.level = $stateParams.level;
    
    // init data
    $scope.data = [];
    
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
                            club.members[j].club=club.name;
                            var userId =  club.members[j].key.id;
                            var userParentId = club.members[j].key.parent.id;
                            var event = $scope.event;
                            var user = club.members[j];
                            $scope.getScore(userId, userParentId, event, user);
                            $scope.data.push(club.members[j]);
                        }
                        
                    }
                }
                
            }
            $timeout(function() {
                $scope.loadingVar = false;
                $scope.tableParamsRecord.reload();
                $scope.$apply();
            }, 500);
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
    
    $scope.refreshScores = function(data, event){
        console.log("Refreshing scores...");
        angular.forEach(data, function(user) {
            $scope.getScore(user.key.id, user.key.parent.id, event, user);
        });
    }
    
    $scope.getScore = function(userId, userParentId, event, user) {
        console.log("getScore");
        
        gapi.client.api.getScores({
            "userId": userId,
            "userParentId": userParentId,
            "eventName": event
        }).execute(function(resp){
            if(resp.scores){
                if(event === TRAMPOLINE && resp.scores){
                    user.trampolinescore = {};
                    user.trampolinescore.set = {};
                    user.trampolinescore.set.judge1 = getByOrder(1, resp.scores);
                    user.trampolinescore.set.judge2 = getByOrder(2, resp.scores);
                    user.trampolinescore.set.judge3 = getByOrder(3, resp.scores);
                    user.trampolinescore.set.judge4 = getByOrder(4, resp.scores);
                    user.trampolinescore.set.judge5 = getByOrder(5, resp.scores);
                    user.trampolinescore.vol = {};
                    user.trampolinescore.vol.judge1 = getByOrder(6, resp.scores);
                    user.trampolinescore.vol.judge2 = getByOrder(7, resp.scores);
                    user.trampolinescore.vol.judge3 = getByOrder(8, resp.scores);
                    user.trampolinescore.vol.judge4 = getByOrder(9, resp.scores);
                    user.trampolinescore.vol.judge5 = getByOrder(10, resp.scores);
                    user.trampolinescore.vol.tariff = getByOrder(11, resp.scores);
                }else if(event === "tumbling"){
                    
                }else if(event === "dmt"){
                    
                }
            }
        })
        $timeout(function() {
            $scope.$apply();
        }, 100);
    }
    
    $scope.setMemberScore = function(user, event) {
        
        console.log(event);
        console.log(user);
        
        if(event === TRAMPOLINE){
            
            var scores = [];
            scores.push({
                "score": user.trampolinescore.set.judge1,
                "order": 1
            });
            scores.push({
                "score": user.trampolinescore.set.judge2,
                "order": 2
            });
            scores.push({
                "score": user.trampolinescore.set.judge3,
                "order": 3
            });
            scores.push({
                "score": user.trampolinescore.set.judge4,
                "order": 4
            });
            scores.push({
                "score": user.trampolinescore.set.judge5,
                "order": 5
            });
            scores.push({
                "score": user.trampolinescore.vol.judge1,
                "order": 6
            });
            scores.push({
                "score": user.trampolinescore.vol.judge2,
                "order": 7
            });
            scores.push({
                "score": user.trampolinescore.vol.judge3,
                "order": 8
            });
            scores.push({
                "score": user.trampolinescore.vol.judge4,
                "order": 9
            });
            scores.push({
                "score": user.trampolinescore.vol.judge5,
                "order": 10
            });
            scores.push({
                "score": user.trampolinescore.vol.tariff,
                "order": 11
            });
    
            gapi.client.api.setScores({
                "userId": user.key.id,
                "userParentId": user.key.parent.id,
                "eventName": event,
                "scores": scores
            }).execute(function(resp){
                if(resp.scores){
                    console.log(resp);   
                }
            })

        }else if(event === TUMBLING){
            
        }else if(event === DMT){
            
        }
            
    }
    
    
    var TRAMPOLINE = 'trampoline';
    var TUMBLING = 'tumbling';
    var DMT = 'dmt';
    
})

function getByOrder(order, scores) {
    for(var i = 0; i < scores.length; i++){
        if(scores[i].order === order){
            return scores[i].score;
        }
    }
}