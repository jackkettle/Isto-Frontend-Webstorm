app.controller('addCompetitorController', function ($scope, $rootScope, $state) {
    
    // GLOBAL CONSTANTS
    $rootScope.submitted = false;
    
    $rootScope.formType = "Add";
    
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


    
    // Starting values for our form object
    $scope.form = {
        basic: {
            name        : "",
            commisto    : false,  
            social      : false,
            guest       : false,
            gender      : ""
        },
        helper: {
            scorekeeper : false,
            marshall    : false,
            shirt       : false,
            shirtSize   : "n/a",
            shirtColor  : "n/a"
        },
        competition: {
            trampolining: {
                competing   : false,
                sync        : false,
                syncpartner : "n/a",
                synclevel   : "n/a",
                team        : "n/a",
                level       : "n/a"
            },
            tumbling: {
                competing   : false,
                level       : "n/a"
            },
            dmt: {
                competing   : false,
                level       : "n/a"
            }
        },
        judging: {
            trampoline: {
                form        : false,
                tariff      : false,
                sync        : false,
                superior    : false,
                level       : "n/a"
                
            },
            tumbling: {
                judge       : false,
                superior    : false,
                level       : "n/a"
            },
            dmt: {
                judge       : false,
                superior    : false,
                level       : "n/a"
            }
        }
    }
    console.log($rootScope.club.name);
    $scope.onCompetitorSubmit=function(){
        var data=$scope.form;
        
        $rootScope.submitted = true;
        
        /* post to server*/
        console.log("submitted"); 
        console.log(data);
        $scope.checkBool = true;
        // check for max values
        // tumbling
        if(data.competition.tumbling.competing){
            gapi.client.api.getDmtTumblingCount({Option: 1}).execute(
        	function(resp){
        	    console.log(resp);
        	    console.log("Testing 1");
        	    console.log(resp.items[0] );
        	    if(resp.items[0] >= $rootScope.maxTumbling){
        	        $rootScope.errorMessage = "We're sorry but the limit for tumbling competitors has been reached."
        	        $rootScope.submitted = false;
        	        $rootScope.$apply();
        	    }else{
        	        gapi.client.api.addMember({ 
                        Club                        : $rootScope.club.name,
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
                    }).execute(
                    	function(resp){
                    	    console.log(resp);
                    	    $state.go('dashboard');
                    	}
                    )
        	    }
        	})
        }
        // dmt
        if(data.competition.dmt.competing){
            gapi.client.api.getDmtTumblingCount({Option: 2}).execute(
        	function(resp){
        	    console.log(resp);
        	    console.log("Testing 2");
        	    console.log(resp.items[0] );
        	    if(resp.items[0] >= $rootScope.maxDmt){
        	        $rootScope.errorMessage = "We're sorry but the limit for dmt competitors has been reached."
        	        $rootScope.submitted = false;
        	        $rootScope.$apply();
        	    }else{
        	        gapi.client.api.addMember({ 
                        Club                        : $rootScope.club.name,
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
                    }).execute(
                    	function(resp){
                    	    console.log(resp);
                    	    $state.go('dashboard');
                    	}
                    )
        	    }
        	})
        }
        // sync
        if(data.competition.trampolining.sync){
            gapi.client.api.getDmtTumblingCount({Option: 3}).execute(
        	function(resp){
        	    console.log(resp);
        	    console.log("Testing 3");
        	    console.log(resp.items[0] );
        	    if(resp.items[0] >= $rootScope.maxSync){
        	        $rootScope.errorMessage = "We're sorry but the limit for sync competitors has been reached."
        	        $rootScope.submitted = false;
        	        $rootScope.$apply();
        	    }else{
        	        gapi.client.api.addMember({ 
                        Club                        : $rootScope.club.name,
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
                    }).execute(
                    	function(resp){
                    	    console.log(resp);
                    	    $state.go('dashboard');
                    	}
                    )
        	    }
        	})
        }
        if(!data.competition.trampolining.sync && !data.competition.tumbling.competing && !data.competition.dmt.competing){
            gapi.client.api.addMember({ 
                Club                        : $rootScope.club.name,
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
            }).execute(
            	function(resp){
            	    console.log(resp);
            	    $state.go('dashboard');
            	}
            )   
        }
    }
})
