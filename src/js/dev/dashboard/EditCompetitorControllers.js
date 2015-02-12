app.controller('editCompetitorController', function ($scope, $rootScope, $state, $stateParams, $timeout) {
    
    // GLOBAL CONSTANTS
    $scope.submitted = false;
    
    $rootScope.formType = "Edit";
    
    $rootScope.teams = [
        {name: "", value: 'n/a'},
        {name: "A", value: 1},
        {name: "B", value: 2},
        {name: "C", value: 3}
    ];
    $scope.dmtLevels = [1,2,3];
    $rootScope.trampLevels = [
        {name: "Novice", value: 1},
        {name: "Intermediate", value: 2},
        {name: "Inter-advanced", value: 3},
        {name: "Advanced", value: 4},
        {name: "Elite", value: 5},
        {name: "Elite-pro", value: 6}
    ];
    $scope.tumblingLevels = [1,2,3,4,5];
    $scope.shirtSizes = [
        {name: "S (34\/36\")", value: 1},
        {name: "M (38\/40\")", value: 2},
        {name: "L (42\/44\")", value: 3},
        {name: "XL (46\/48\")", value: 4},
        {name: "2XL (50\/52\")", value: 5}
    ];
    $scope.shirtColors = [
        {name: "Pink", value: 1},
        {name: "Navy", value: 2},
        {name: "Green", value: 3},
        {name: "Orange", value: 4},
        {name: "Red", value: 5}
    ];
    $rootScope.syncLevels = [
        {name: "Novice and Intermediate", value: 1},
        {name: "Intervanced and Advanced", value: 2},
        {name: "Elite and Pro-Elite", value: 3}
    ];
    $scope.gender = [
        "Male",
        "Female"
    ];
    
    
    // if no members go to dashboard to get them
    //console.log($rootScope.club.name);
    
    if($rootScope.data === undefined){
        $state.go('dashboard');
    }else{
        // get member from members
        angular.forEach($rootScope.data, function(member) {
            if(member.key.id === $stateParams.id){
                $scope.currentEditMember= member;
            }
        });
        
        // Starting values for our form object
        $scope.form = {
            basic: {
                name        : $scope.currentEditMember.name,
                commisto    : $scope.currentEditMember.pastCommISTO,  
                social      : $scope.currentEditMember.socialTicket,
                guest       : $scope.currentEditMember.guest,
                gender      : $scope.currentEditMember.gender
            },
            helper: {
                scorekeeper : $scope.currentEditMember.scorekeeper,
                marshall    : $scope.currentEditMember.marshling,
                shirt       : $scope.currentEditMember.shirt,
                shirtSize   : parseInt($scope.currentEditMember.shirtSize),
                shirtColor  : parseInt($scope.currentEditMember.shirtColor),
            },
            competition: {
                trampolining: {
                    competing   : $scope.currentEditMember.trampolineCompetitor,
                    sync        : $scope.currentEditMember.trampolineSyncCompetitor,
                    syncpartner : $scope.currentEditMember.trampolineSyncPartner,
                    synclevel   : parseInt($scope.currentEditMember.trampolineSyncLevel),
                    team        : parseInt($scope.currentEditMember.trampolineTeam),
                    level       : parseInt($scope.currentEditMember.trampolineLevel),
                },
                tumbling: {
                    competing   : $scope.currentEditMember.tumblingCompetitor,
                    level       : parseInt($scope.currentEditMember.tumblingLevel),
                },
                dmt: {
                    competing   : $scope.currentEditMember.dmtCompetitor,
                    level       : parseInt($scope.currentEditMember.dmtLevel),
                }
            },
            judging: {
                trampoline: {
                    form        : $scope.currentEditMember.trampolineFormJudge,
                    tariff      : $scope.currentEditMember.trampolineTariffJudge,
                    sync        : $scope.currentEditMember.trampolineSyncJudge,
                    superior    : $scope.currentEditMember.trampolineSuperiorJudge,
                    level       : parseInt($scope.currentEditMember.trampolineJudgeLevel),
                    
                },
                tumbling: {
                    judge       : $scope.currentEditMember.tumblingJudge,
                    superior    : $scope.currentEditMember.tumblingSuperiorJudge,
                    level       : parseInt($scope.currentEditMember.tumblingJudgeLevel),
                },
                dmt: {
                    judge       : $scope.currentEditMember.dmtJudge,
                    superior    : $scope.currentEditMember.dmtSuperiorJudge,
                    level       : parseInt($scope.currentEditMember.dmtJudgeLevel),
                }
            }
        }
    }

    $scope.onCompetitorSubmit=function(){
        
        var data=$scope.form;
        
        $scope.submitted = true;
        $scope.checkBool = true;
        
        // checks for limited spots
        // tumbling
        if(!$scope.currentEditMember.tumblingCompetitor && data.competition.tumbling.competing){
            
            console.log($rootScope.maxTotalTumbling);
            console.log($rootScope.maxTumbling);
            if($rootScope.maxTotalTumbling < $rootScope.maxTumbling){
                
                gapi.client.api.updateMember({
                    Club                        : $rootScope.club.name,
                    Id                          : $scope.currentEditMember.key.id,
                    Name                        : data.basic.name,
                    CommISTO                    : data.basic.commisto,
                    socialTicket                : data.basic.social,
                    guest                       : data.basic.guest,
                    gender                      : data.basic.gender,
                    scorekeeper                 : data.helper.scorekeeper,
                    marshling                   : data.helper.marshall,
                    Shirt                       : data.helper.shirt,
                    ShirtSize                   : data.helper.shirtSize,
                    ShirtColor                  : data.helper.shirtColor,
                    trampolineCompetitor        : data.competition.trampolining.competing,
                    trampolineSyncCompetitor    : data.competition.trampolining.sync,
                    trampolineSyncPartner       : data.competition.trampolining.syncpartner,
                    trampolineSyncLevel         : data.competition.trampolining.synclevel,
                    trampolineTeam              : data.competition.trampolining.team,
                    trampolineLevel             : data.competition.trampolining.level,
                    dmtCompetitor               : data.competition.dmt.competing,
                    dmtLevel                    : data.competition.dmt.level,
                    tumblingCompetitor          : data.competition.tumbling.competing,
                    tumblingLevel               : data.competition.tumbling.level,
                    trampolineFormJudge         : data.judging.trampoline.form,
                    trampolineTariffJudge       : data.judging.trampoline.tariff,
                    trampolineSyncJudge         : data.judging.trampoline.sync,
                    trampolineSuperiorJudge     : data.judging.trampoline.superior,
                    trampolineJudgeLevel        : data.judging.trampoline.level,
                    tumblingJudge               : data.judging.tumbling.judge,
                    tumblingJudgeLevel          : data.judging.tumbling.level,
                    tumblingSuperiorJudge       : data.judging.tumbling.superior,
                    dmtJudge                    : data.judging.dmt.judge,
                    dmtJudgeLevel               : data.judging.dmt.level,
                    dmtSuperiorJudge            : data.judging.dmt.superior
                }).execute(function (resp) {
                    console.log(resp);
                    $state.go('dashboard');
                });
            }else{
                    $rootScope.errorMessage = "We're sorry but the limit for tumbling competitors has been reached."
        	        $rootScope.submitted = false;
        	        $rootScope.$apply();
            }
        // dmt
        }else if(!$scope.currentEditMember.dmtCompetitor && data.competition.dmt.competing){
            if($rootScope.maxTotalDmt < $rootScope.maxDMT){
                gapi.client.api.updateMember({
                    Club                        : $rootScope.club.name,
                    Id                          : $scope.currentEditMember.key.id,
                    Name                        : data.basic.name,
                    CommISTO                    : data.basic.commisto,
                    socialTicket                : data.basic.social,
                    guest                       : data.basic.guest,
                    gender                      : data.basic.gender,
                    scorekeeper                 : data.helper.scorekeeper,
                    marshling                   : data.helper.marshall,
                    Shirt                       : data.helper.shirt,
                    ShirtSize                   : data.helper.shirtSize,
                    ShirtColor                  : data.helper.shirtColor,
                    trampolineCompetitor        : data.competition.trampolining.competing,
                    trampolineSyncCompetitor    : data.competition.trampolining.sync,
                    trampolineSyncPartner       : data.competition.trampolining.syncpartner,
                    trampolineSyncLevel         : data.competition.trampolining.synclevel,
                    trampolineTeam              : data.competition.trampolining.team,
                    trampolineLevel             : data.competition.trampolining.level,
                    dmtCompetitor               : data.competition.dmt.competing,
                    dmtLevel                    : data.competition.dmt.level,
                    tumblingCompetitor          : data.competition.tumbling.competing,
                    tumblingLevel               : data.competition.tumbling.level,
                    trampolineFormJudge         : data.judging.trampoline.form,
                    trampolineTariffJudge       : data.judging.trampoline.tariff,
                    trampolineSyncJudge         : data.judging.trampoline.sync,
                    trampolineSuperiorJudge     : data.judging.trampoline.superior,
                    trampolineJudgeLevel        : data.judging.trampoline.level,
                    tumblingJudge               : data.judging.tumbling.judge,
                    tumblingJudgeLevel          : data.judging.tumbling.level,
                    tumblingSuperiorJudge       : data.judging.tumbling.superior,
                    dmtJudge                    : data.judging.dmt.judge,
                    dmtJudgeLevel               : data.judging.dmt.level,
                    dmtSuperiorJudge            : data.judging.dmt.superior
                }).execute(function (resp) {
                    console.log(resp);
                    $state.go('dashboard');
                });
            }else{
                    $rootScope.errorMessage = "We're sorry but the limit for dmt competitors has been reached."
        	        $rootScope.submitted = false;
        	        $rootScope.$apply();
            }
            
        // Sync
        }else if(!$scope.currentEditMember.trampolineSyncCompetitor && data.competition.trampolining.sync){
            if($rootScope.maxTotalSync < $rootScope.maxSync){
                gapi.client.api.updateMember({
                    Club                        : $rootScope.club.name,
                    Id                          : $scope.currentEditMember.key.id,
                    Name                        : data.basic.name,
                    CommISTO                    : data.basic.commisto,
                    socialTicket                : data.basic.social,
                    guest                       : data.basic.guest,
                    gender                      : data.basic.gender,
                    scorekeeper                 : data.helper.scorekeeper,
                    marshling                   : data.helper.marshall,
                    Shirt                       : data.helper.shirt,
                    ShirtSize                   : data.helper.shirtSize,
                    ShirtColor                  : data.helper.shirtColor,
                    trampolineCompetitor        : data.competition.trampolining.competing,
                    trampolineSyncCompetitor    : data.competition.trampolining.sync,
                    trampolineSyncPartner       : data.competition.trampolining.syncpartner,
                    trampolineSyncLevel         : data.competition.trampolining.synclevel,
                    trampolineTeam              : data.competition.trampolining.team,
                    trampolineLevel             : data.competition.trampolining.level,
                    dmtCompetitor               : data.competition.dmt.competing,
                    dmtLevel                    : data.competition.dmt.level,
                    tumblingCompetitor          : data.competition.tumbling.competing,
                    tumblingLevel               : data.competition.tumbling.level,
                    trampolineFormJudge         : data.judging.trampoline.form,
                    trampolineTariffJudge       : data.judging.trampoline.tariff,
                    trampolineSyncJudge         : data.judging.trampoline.sync,
                    trampolineSuperiorJudge     : data.judging.trampoline.superior,
                    trampolineJudgeLevel        : data.judging.trampoline.level,
                    tumblingJudge               : data.judging.tumbling.judge,
                    tumblingJudgeLevel          : data.judging.tumbling.level,
                    tumblingSuperiorJudge       : data.judging.tumbling.superior,
                    dmtJudge                    : data.judging.dmt.judge,
                    dmtJudgeLevel               : data.judging.dmt.level,
                    dmtSuperiorJudge            : data.judging.dmt.superior
                }).execute(function (resp) {
                    console.log(resp);
                    $state.go('dashboard');
                });
            }
            else{
                    $rootScope.errorMessage = "We're sorry but the limit for sync competitors has been reached."
        	        $rootScope.submitted = false;
        	        $rootScope.$apply();
            }
        }else{
            gapi.client.api.updateMember({
                Club                        : $rootScope.club.name,
                Id                          : $scope.currentEditMember.key.id,
                Name                        : data.basic.name,
                CommISTO                    : data.basic.commisto,
                socialTicket                : data.basic.social,
                guest                       : data.basic.guest,
                gender                      : data.basic.gender,
                scorekeeper                 : data.helper.scorekeeper,
                marshling                   : data.helper.marshall,
                Shirt                       : data.helper.shirt,
                ShirtSize                   : data.helper.shirtSize,
                ShirtColor                  : data.helper.shirtColor,
                trampolineCompetitor        : data.competition.trampolining.competing,
                trampolineSyncCompetitor    : data.competition.trampolining.sync,
                trampolineSyncPartner       : data.competition.trampolining.syncpartner,
                trampolineSyncLevel         : data.competition.trampolining.synclevel,
                trampolineTeam              : data.competition.trampolining.team,
                trampolineLevel             : data.competition.trampolining.level,
                dmtCompetitor               : data.competition.dmt.competing,
                dmtLevel                    : data.competition.dmt.level,
                tumblingCompetitor          : data.competition.tumbling.competing,
                tumblingLevel               : data.competition.tumbling.level,
                trampolineFormJudge         : data.judging.trampoline.form,
                trampolineTariffJudge       : data.judging.trampoline.tariff,
                trampolineSyncJudge         : data.judging.trampoline.sync,
                trampolineSuperiorJudge     : data.judging.trampoline.superior,
                trampolineJudgeLevel        : data.judging.trampoline.level,
                tumblingJudge               : data.judging.tumbling.judge,
                tumblingJudgeLevel          : data.judging.tumbling.level,
                tumblingSuperiorJudge       : data.judging.tumbling.superior,
                dmtJudge                    : data.judging.dmt.judge,
                dmtJudgeLevel               : data.judging.dmt.level,
                dmtSuperiorJudge            : data.judging.dmt.superior
            }).execute(function (resp) {
                console.log(resp);
                $state.go('dashboard');
            });
        }
    }
})
