app.controller('recorderController', function ($scope, $stateParams, ngTableParams, Gapi, $filter, $timeout, $q) {
    
    var TRAMPOLINE = 'trampoline';
    var TUMBLING = 'tumbling';
    var DMT = 'dmt';
    
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
            angular.forEach(resp.items, function(club) {
                if(club.members){
                    angular.forEach(club.members, function(member) {
                        if(isInEvent(member, $scope.event, $scope.level) ){
                        	
                        	var userId =  member.key.id;
                        	var userParentId = member.key.parent.id;
                        	var event = $scope.event;
                        	var user = member;
                        	
                        	// Proptype users
                        	member.club=club.name;
                        	(function(member) {
                                $scope.getScore(userId, userParentId, event, member).then(function () {
                                if(member.trampolinescore){
                                    member.trampolinescore.set.total = $scope.getUserSetScore(member);
                            		member.trampolinescore.vol.total = $scope.getUserVolScore(member);
                            		member.trampolinescore.total = $scope.getUserTotalScore(member);
                            		$scope.data.push(member);
                                }else{
                                    $scope.data.push(member);   
                                }
                                
                        	})
                            })(member);
                        }
                    })
                }
            });

            $timeout(function() {
                
                
                angular.forEach($scope.data, function(member) {
                     if(member.trampolinescore && member.trampolinescore.total){
                        member.trampolinescore.rank = getRank(member.trampolinescore.total, $scope.data);
                     }
                })
                
                $scope.loadingVar = false;
                $scope.tableParamsRecord.reload();
                $scope.$apply();
            }, 4000);
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
    
    $scope.getSetScore = function(setArray){
        
        
        var largest = Math.max.apply(Math, setArray);
        var smallest = Math.min.apply(Math, setArray);
        
        var sum = setArray.reduce(function(previousValue, currentValue, index, array) {
            return previousValue + currentValue;
        });
        
        var setScore = sum - (largest + smallest);
        
        return parseFloat(setScore.toFixed(1));
    }
    
    $scope.getVolScore = function (volArray, tariffScore){
        
        var volScore = $scope.getSetScore(volArray) + tariffScore;
        return parseFloat(volScore.toFixed(1));
        
    }
    
    $scope.getUserSetScore = function(user){
        
        if(!user.trampolinescore){
            return 0;
        }else if(!user.trampolinescore.set){
            return 0;
        }
        
        var setArray = [
            parseFloat(user.trampolinescore.set.judge1),
            parseFloat(user.trampolinescore.set.judge2),
            parseFloat(user.trampolinescore.set.judge3),
            parseFloat(user.trampolinescore.set.judge4),
            parseFloat(user.trampolinescore.set.judge5)
        ]
        
        return $scope.getSetScore(setArray);
        
    }
    
    $scope.getUserVolScore = function (user){
        
        if(!user.trampolinescore){
            return 0;
        }else if(!user.trampolinescore.vol){
            return 0;
        }
        
        
        var volArray = [
            parseFloat(user.trampolinescore.vol.judge1),
            parseFloat(user.trampolinescore.vol.judge2),
            parseFloat(user.trampolinescore.vol.judge3),
            parseFloat(user.trampolinescore.vol.judge4),
            parseFloat(user.trampolinescore.vol.judge5)
        ]
        var total = $scope.getVolScore(volArray, parseFloat(user.trampolinescore.vol.tariff))
        return total.toFixed(1);
        
    }
    
    $scope.getUserTotalScore = function (user){
        var a = parseFloat($scope.getUserSetScore(user))
        var b = parseFloat($scope.getUserVolScore(user))
        var total = a + b;
        return total.toFixed(1);
        
    }
    
    $scope.getRank = function(member, members){
        if(member.trampolinescore && member.trampolinescore.total){
            getRank(member.trampolinescore.total);
        }
    }

    
    $scope.downloadAsCsvTrampoline = function (filename) {
        console.log("downloadAsCsv");
        var header = "index,club,name,J1,J2,J3,J4,J5,Set,J1,J2,J3,J4,J5,Tarif,Vol,Total,Rank\n";
        var csvData = header;
        // populate csv var
        var i = 1;
        angular.forEach($scope.data, function(user) {
            // build each row
            var row = "";
            row += i + ",";
            
            row += user.club + ",";
            row += user.name + ",";
            
            if(user.trampolinescore){
                if(user.trampolinescore.set){
                    row += user.trampolinescore.set.judge1 + ",";
                    row += user.trampolinescore.set.judge2 + ",";
                    row += user.trampolinescore.set.judge3 + ",";
                    row += user.trampolinescore.set.judge4 + ",";
                    row += user.trampolinescore.set.judge5 + ",";
                    row += $scope.getUserSetScore(user) + ",";
                    
                }else{
                    row += "0,0,0,0,0,0,";
                }
                if(user.trampolinescore.vol){
                    row += user.trampolinescore.vol.judge1 + ",";
                    row += user.trampolinescore.vol.judge2 + ",";
                    row += user.trampolinescore.vol.judge3 + ",";
                    row += user.trampolinescore.vol.judge4 + ",";
                    row += user.trampolinescore.vol.judge5 + ",";
                    row += user.trampolinescore.vol.tariff + ",";
                    row += $scope.getUserVolScore(user) + ",";
                }
                else{
                     row += "0,0,0,0,0,0,";
                }
                var total = parseFloat($scope.getUserSetScore(user)) + parseFloat($scope.getUserVolScore(user));
                if(total){
                    row += total + ",";
                }else{
                    row += "0,";
                }
            }
            else{
                row += "0,0,0,0,0,0,0,0,0,0,0,0,0,0";
            }
            row += "0" // rank

            row += "\n";
            
            csvData += row;
            i++
        });
        console.log(csvData);
        var blob = new Blob([csvData], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, filename+'.csv');

    }
    
    $scope.refreshScores = function(data, event){
        $scope.refreshed=true;
        console.log("Refreshing scores...");
        angular.forEach(data, function(member) {
            $scope.getScore(member.key.id, member.key.parent.id, event, member)
                .then(function () {
                    if(member.trampolinescore){
                        member.trampolinescore.set.total = $scope.getUserSetScore(member);
                		member.trampolinescore.vol.total = $scope.getUserVolScore(member);
                		member.trampolinescore.total = $scope.getUserTotalScore(member);
                    }
                });
        });
        $scope.refreshed=false;
    }
    
    $scope.refreshScore = function(member){
        $scope.getScore(member.key.id, member.key.parent.id, event, member)
            .then(function () {
                if(member.trampolinescore){
                    member.trampolinescore.set.total = $scope.getUserSetScore(member);
            		member.trampolinescore.vol.total = $scope.getUserVolScore(member);
            		member.trampolinescore.total = $scope.getUserTotalScore(member);
            		member.trampolinescore.rank = getRank(member.trampolinescore.total, $scope.data);
                }
        });

    }
    
    $scope.getScore = function(userId, userParentId, event, user) {
        console.log("getScore");
        
        var deferred = $q.defer();
        
        gapi.client.api.getScores({
            "userId": userId,
            "userParentId": userParentId,
            "userName" : user.name,
    		"userClub" : user.club,
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
            }else{
                
            }
            deferred.resolve();
        })
        
        return deferred.promise;
    }
    
    $scope.setMemberScore = function(user, event) {
        
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
                "userName" : user.name,
    		    "userClub" : user.club,
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
        $scope.refreshScore(user, event);
    }
    
})

function getByOrder(order, scores) {
    for(var i = 0; i < scores.length; i++){
        if(scores[i].order === order){
            return scores[i].score;
        }
    }
}

function getRank(score, members) {
    
    console.log("--------------");
    console.log("Get rank");
    
    var totalScores = []
    angular.forEach(members, function(member) {
        if(member.trampolinescore && member.trampolinescore.total){
            totalScores.push(member.trampolinescore.total)
        }
    })
    
    totalScores.sort();
    var value = totalScores.indexOf(score);
    console.log(value);
    console.log("--------------");
    if(value == -1){
        return 0;
    }else{
        return value;
    }
    
}

