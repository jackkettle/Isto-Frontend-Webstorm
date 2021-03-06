// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs

var commistoJson = "json/commisto.json";
var sponsorJson = "json/sponsor.json";
var photoJson = "json/gallery.json";
var historyJson = "json/history.json";
var routinesJson = "json/routines.json";
var charityJson = "json/charity.json";
var travelJson = "json/travel.json";
var scheduleJson = "json/schedule.json";
var travelJson = "json/travel.json";
var socialJson = "json/social.json";

var app = angular.module('istoApp', ['ui.router', 'ui.bootstrap', 'ngTable', 'ngCookies'])

// configure our routes
app.config(function($stateProvider, $urlRouterProvider) {
    
    // If route does not exist
    $urlRouterProvider.otherwise("/");
    
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/index.html",
            data: {
                requireLogin: false
            }
        })

        .state('competition', {
            url: "/competition",
            templateUrl: "partials/competition.html",
            controller: "defaultCompetitionController",
            data: {
                requireLogin: false
            }
        })
        
        .state('competition.id', {
            url: "/:id",
            views: {
                "@": {
                    templateUrl: "partials/competition.html",
                    controller: "competitionController"
                }
            }
        })
        
        .state('sponsor', {
            url: "/sponsor",
            templateUrl: "partials/sponsor.html",
            controller: "sponsorController",
            data: {
                requireLogin: false
            }
        })
        
        .state('photo', {
            url: "/photo",
            templateUrl: "partials/photo.html",
            controller: "photoController",
            data: {
                requireLogin: false
            }
        })
        
        .state('commisto', {
            url: "/commisto",
            templateUrl: "partials/commisto.html",
            controller: "commistoController",
            data: {
                requireLogin: false
            }
        })
        
        .state('history', {
            url: "/history",
            templateUrl: "partials/history.html",
            controller: "defaultHistoryController",
            data: {
                requireLogin: false
            }
        })
        
        .state('charity', {
            url: "/charity",
            templateUrl: "partials/charity.html",
            controller: "charityController",
            data: {
                requireLogin: false
            }
        })
        
        // Auth required URLs
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "partials/dashboard.1.html",
            data: {
                requireLogin: true, // this property will apply to all children of 'app'
                userTypes: [1,2]
            }

        })
        
        .state('dashboard.add', {
            url: "/add",
            views: {
                "@": {
                    templateUrl: "partials/form.html",
                    controller: "addCompetitorController"
                }
            }
        })
        
        .state('dashboard.edit', {
            url: "/edit/:id",
            views: {
                "@": {
                    templateUrl: "partials/form.html",
                    controller: "editCompetitorController"
                }
            }
        })
        
        .state('dashboard.addClub', {
            url: "/addclub",
            views: {
                "@": {
                    templateUrl: "partials/AddClub.html",
                    controller: "addClubController"
                }
            }
        })
        
        .state('dashboard.deleteClub', {
            url: "/deleteclub",
            views: {
                "@": {
                    templateUrl: "partials/deleteClub.html",
                    controller: "deleteClubController"
                }
            }
        })
        
        .state('dashboard.addUser', {
            url: "/adduser",
            views: {
                "@": {
                    templateUrl: "partials/AddUser.html",
                    controller: "addUserController"
                }
            }
        })
        
        .state('dashboard.deleteUser', {
            url: "/deleteUser",
            views: {
                "@": {
                    templateUrl: "partials/deleteUser.html",
                    controller: "deleteUserController"
                }
            }
        })
        
        .state('events', {
            url: "/events",
            views: {
                "@": {
                    templateUrl: "partials/events.html"
                }
            },
            data: {
                requireLogin: true,
                userTypes: [2,3]
            }
        })
        
        .state('events.record', {
            url: "/record/:event/:level",
            views: {
                "@": {
                    templateUrl: "partials/record.html",
                    controller: "recorderController"
                }
            }
        })
        
        .state('events.results', {
            url: "/results",
            views: {
                "@": {
                    templateUrl: "partials/results.html",
                    controller: "resultsController"
                }
            },
            data: {
                userTypes: [2]
            }
        })
})

// Catch 401 errors when trying to view restrcited pages
app.config(function ($httpProvider) {

    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
        var loginModal, $http, $state;
        
        // this trick must be done so that we don't receive
        // `Uncaught Error: [$injector:cdep] Circular dependency found`
        $timeout(function () {
            loginModal = $injector.get('loginModal');
            $http = $injector.get('$http');
            $state = $injector.get('$state');
        });
            
        
        return {
            responseError: function (rejection) {
                if (rejection.status !== 401) {
                    return rejection;
                }
                
                var deferred = $q.defer();
                
                loginModal()
                    .then(function () {
                        deferred.resolve( $http(rejection.config) );
                    })
                    .catch(function () {
                        deferred.reject(rejection);
                    });
                return deferred.promise;
            }
        }
    })
})

app.run(function ($rootScope, $state, $injector, loginModal,$cookieStore, $location) {


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

    $rootScope.tumblingLevels = [1,2,3,4,5];
    $rootScope.dmtLevels = [1,2,3];

    $rootScope.maxTumbling  = 80;
    $rootScope.maxDMT       = 80;
    $rootScope.maxSync      = 165;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        
        var requireLogin = toState.data.requireLogin;
        var userTypes = toState.data.userTypes;
        
        if($cookieStore.get('istoUserId')){
            
            var idCookie = $cookieStore.get('istoUserId');
            var clubNameCookie = $cookieStore.get('istoUserClub');
            var userNameCookie = $cookieStore.get('istoUserName');
            var userTypeCookie = $cookieStore.get('istoUserType');
            
            $rootScope.currentUser = {
                id : idCookie,
                clubName : clubNameCookie,
                userName : userNameCookie,
                userType : userTypeCookie
            };
            
        }
        if(userTypes){
            var check = userTypes.indexOf($rootScope.currentUser.userType);
            if(check === -1){
                event.preventDefault();
                $state.go('home');
            }
        }
        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            
            // login modal
            loginModal()
                .then(function () {
                    return $state.go(toState.name, toParams);
                })
                .catch(function () {
                    return $state.go('home');
                });
        }
    });

})

app.controller('commonFunctionsController', function($rootScope) {
    
    /*
     * See if string is numeric
     */
    $rootScope.isNumeric = function (value) {
        var num = parseInt(value);
        if(isNaN(num)){
           return  false;
        }
        return true;
    }
    
})
app.factory('Gapi', function($timeout, $q) {
    return {
        load: function load() {
            if (typeof gapi.client === 'undefined') {
                return $timeout(load, 500);
            } else if (typeof gapi.client.api === 'undefined') {
                return $timeout(load, 500); 
            } else{
                return $timeout(function() {
                }, 500);
            }
        },
    };
})
app.controller('navController', function($scope, $location, $rootScope) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    
    var absUrl= $location.absUrl();
    //check for src
    
    if(absUrl.indexOf("src") > -1){
        $rootScope.base = $location.protocol() + "://" + $location.host() + "/src/";
    }else{
        $rootScope.base = $location.protocol() + "://" + $location.host() + "/";
    }
})
app.controller('socialController', function($scope) {
    $scope.twitter  = 'https://twitter.com/COMMISTO';
    $scope.facebook = 'https://www.facebook.com/pages/Irish-Student-Trampoline-Open/139153787666';
    $scope.google   = 'https://plus.google.com/u/0/114618181369690971121/posts';
    $scope.youtube  = 'https://www.youtube.com/user/isto2012/';
    $scope.mail     = 'mailto:info@isto.ie';
})

/* Smooth scrolling para anclas */  
$(document).on('click','a.smooth', function(e){
    e.preventDefault();
    var $link = $(this);
    var anchor = $link.attr('href');
    $('html, body').stop().animate({
        scrollTop: $(anchor).offset().top
    }, 1000);
});

/* MixItUp */
$(function() {
    $('#Grid').mixitup();
});


/* Hover Touch */
$(document).ready(function() {
    $('.hover').bind('touchstart', function(e) {
        e.preventDefault();
        $(this).toggleClass('cs-hover');
    });
});



$(document).ready(function(){

    // hide #back-top first
    $("#back-top").hide();
    
    // fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    });

});
app.controller('addClubController', function($scope, Gapi, $state) {
    
    $scope.disabledVar = true;
    
    Gapi.load()
        .then(function () { 
            console.log("addClubController")
            gapi.client.api.getAllClubNames().execute(function(resp){
                if(resp.items){
                    $scope.allClubNames = resp.items;
                    $scope.disabledVar = false;
                    for(var i = 0; i < $scope.allClubNames.length; i++){
                        $scope.allClubNames[i] = $scope.allClubNames[i].toLowerCase();
                    }
                }
                $scope.$apply();
            })
        })
        
    $scope.$watch('clubName', function(value) {
        if($scope.allClubNames){
            if(!contains( $scope.allClubNames, value)){
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
   
    $scope.addClub = function(club){
        gapi.client.api.addClub({Name: club}).execute(function(resp){
            console.log("Club added " + club)
            $state.go("dashboard");
        })
    }
})

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
    
    $scope.callApiGetAllMembers = function() {
        
        console.log("callApiGetAllMembers");
        
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
        
        gapi.client.api.getAllClubs().execute(function(resp){
            console.log("callApiGetAllMembers - returned");
            var allMembers = [];
            console.log(resp.items.length)
            for(var i = 0; i < resp.items.length; i++){
                if(resp.items[i].members && resp.items[i].members.length > 0){
                    var tmpMembers = resp.items[i].members;
                    allMembers = allMembers.concat(tmpMembers);
                }
            }
            
            $rootScope.club  = { name: "All members" }
            $rootScope.data = allMembers;
            // Get stats for each member
            for(var i = 0; i < allMembers.length; i++){
                var member = allMembers[i];
                
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



app.controller('deleteClubController', function($scope, Gapi) {
    
    Gapi.load()
        .then(function () { 
            console.log("deleteClubController")
            gapi.client.api.getAllClubNames().execute(function(resp){
                if(resp.items){
                    console.log(resp);
                    $scope.allClubNames = resp.items;
                    $scope.disabledVar = false;
                    for(var i = 0; i < $scope.allClubNames.length; i++){
                        $scope.allClubNames[i] = $scope.allClubNames[i].toLowerCase();
                    }
                }
                $scope.$apply();
            })
        })
        
    $scope.deleteClub = function(name){
        console.log("Deleting club " + name);
        gapi.client.api.deleteClub({Club: name}).execute(function(resp){
            $state.go("dashboard");
        })
    }
    
})

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
app.controller('deleteUserController', function($scope, Gapi, $state) {
    
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
        })
        
    $scope.deleteUser = function(name){
        console.log("Deleting name " + name);
        gapi.client.api.deleteUser({Name: name}).execute(function(resp){
            $state.go("dashboard");
        })
    }
})

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


app.controller('resultsController', function ($scope, $stateParams, ngTableParams, Gapi, $filter, $timeout, $q) {
    
    
    Gapi.load()
        .then(function () { 
            console.log("resultsController")
            gapi.client.api.getWinningScores({event: "trampoline"}).execute(function(resp){
                if(resp.items){
                    $scope.trampolineScores = resp.items;
                    console.log(resp.items);
                    $scope.level1 = resp.items.slice(0,3);
                    $scope.level2 = resp.items.slice(3,6);
                    $scope.level3 = resp.items.slice(6,9);
                    $scope.level4 = resp.items.slice(9,12);
                    $scope.level5 = resp.items.slice(12,15);
                    $scope.level6 = resp.items.slice(15,18);
                    $scope.disabledVar = false;
                    
                    console.log($scope.level1);
                }
                $scope.$apply();
            })
        })
})


function OnLoadCallback() {
    var ROOT="https://1-dot-bamboo-depth-694.appspot.com/_ah/api";
    gapi.client.load('api', 'v1', null, ROOT);
}
app.controller('LoginModalCtrl', function ($scope, UsersApi, $cookieStore,$rootScope) {

    this.cancel = function () {
        $scope.$dismiss();
    }
    
    this.submit = function (email, password) {
        UsersApi(email, password).then(function (user) {
            if(user.result == false){
                $scope.warning = true;
                $scope.message = "Invalid user or password.";
                $scope.apply();
            }else{
                var newUser = {
                    id : user.result.id,
                    clubName : user.result.clubName,
                    userName : user.result.userName,
                    userType : user.result.userType
                }
                $rootScope.currentUser = newUser;
                $scope.$close(newUser);
            }
        });
    };
})
app.service('loginModal', function ($modal, $rootScope, $cookieStore) {

    function assignCurrentUser (user) {
        $rootScope.currentUser = user;
        // Cookies
        $cookieStore.put('istoUserId', user.id);
        $cookieStore.put('istoUserClub', user.clubName);
        $cookieStore.put('istoUserName', user.userName);
        $cookieStore.put('istoUserType', user.userType);
        
        return user;
    }
    
    return function() {
        var instance = $modal.open({
            templateUrl: 'partials/loginModalTemplate.html',
            controller: 'LoginModalCtrl',
            controllerAs: 'LoginModalCtrl'
        })
    
        return instance.result.then(assignCurrentUser);
    };
})
app.controller('loginNavController', function ($scope, $state, loginModal, $rootScope, $cookieStore) {

    var _Club = 1;
    var _CommISTO = 2;
    var _ScoreKeeper = 3;
    
    var _ClubText = "Club";
    var _CommISTOText = "CommISTO";
    var _ScoreKeeperText = "ScoreKeeper";

    $scope.logOut = function () {
        $rootScope.currentUser = null;
        $cookieStore.remove('istoUserId');
        $cookieStore.remove('istoUserClub');
        $cookieStore.remove('istoUserName');
        $cookieStore.remove('istoUserType');
        $state.go('home');
        location.reload();
    }
    
    $scope.logModal = function () {
        loginModal()
            .then(function () {
                    $state.go('dashboard');
            })
    }
    
    $scope.getUserType = function (User) {
        var tmp = '';
        if(User !== 'undefined' && User.userType !== 'undefined'){
            switch(User.userType) {
                case _Club:
                    tmp = _ClubText;
                    break;
                case _CommISTO:
                    tmp = _CommISTOText;
                    break;
                case _ScoreKeeper:
                    tmp = _ScoreKeeperText;
                    break;
                default:
                    tmp = '';
            }
        }
        return tmp;
    }
})
app.service('UsersApi', function ($modal, $rootScope) {

    return function (userName, password) {
        
        var details = {
            User: userName, 
            Password: password
        }
            
        var user = gapi.client.api.loginHash(details);
        return user;
    }
})
app.controller('charityController', function($scope, $http) {
    $http.get(charityJson)
        .then(function(res){
            $scope.charity = res.data;
        });
})
app.controller('commistoController', function($scope, $http) {
    $http.get(commistoJson)
        .then(function(res){
            $scope.committee = res.data;
        });
})

app.controller('defaultHistoryController', function ($scope, $http) {
    $http.get(historyJson)
        .then(function(res){
            $scope.history = res.data;
        });
})
app.controller("scheduleController", function($scope, $http) {
    $http.get(scheduleJson).then(function(res){
           $scope.daysData = res.data;
    });
})

app.controller("scheduleController", function($scope, $http) {
    $http.get(scheduleJson).then(function(res){
           $scope.daysData = res.data;
    });
})

app.controller('sponsorController', function($scope, $http) {
    $http.get(sponsorJson)
        .then(function(res){
            $scope.sponsors = res.data;
        });
})
app.controller('defaultCompetitionController', function($scope, $http) {
   $scope.tab = "info";
   
   // load in routines json
    $http.get(routinesJson)
        .then(function(res){
            $scope.routineData = res.data;
        });
        
    $http.get(travelJson)
        .then(function(res){
            $scope.travelData = res.data;
        });

    $scope.getTotalTariff = function( $scope ){
        var total = 0;
        for(var i = 0; i < $scope.length; i++){
            total += $scope[i].tariff;
        }

        total = Math.round( total * 10) / 10;
        return total;
    }

})

app.controller('competitionController', function($scope, $stateParams, $http) {
        
    if($stateParams.id == 'info'){
        $scope.tab1 = true;
    }
    if($stateParams.id == 'routines'){
        $scope.tab2 = true;
    }
    if($stateParams.id == 'schedule'){
        $scope.tab3 = true;
    }
    if($stateParams.id == 'tariff'){
        $scope.tab4 = true;
    }
    if($stateParams.id == 'travel'){
        $scope.tab5 = true;
    }

    // load in routines json
    $http.get(routinesJson)
        .then(function(res){
            $scope.routineData = res.data;
        });
        
    $http.get(travelJson)
        .then(function(res){
            $scope.travelData = res.data;
        });

    $scope.getTotalTariff = function( $scope ){
        var total = 0;
        for(var i = 0; i < $scope.length; i++){
            total += $scope[i].tariff;
        }

        total = Math.round( total * 10) / 10;
        return total;
    }
    
})
app.controller("tariffController", function ($scope, $http) {

    $scope.useroutine = new Array(10);
    
    $http.get('json/tariff_skills.json')
    .then(function(res){
        $scope.moves = res.data;
    })
    
    $scope.Math = window.Math;
    $scope.userRoutine = [1,2,3,4,5,6,7,8,9,10];
    
    $scope.onChangeSelect = function () {
        
        var newMove = null;
        // check for repeat skills
        for (var i = $scope.userRoutine.length - 1; i >= 1; i--) {
            
            // check if skill is set
            if($scope.userRoutine[i].skill){
                $scope.userRoutine[i].repeatMove = false;
                // check moves below move i
                for (var j = i - 1; j >= 0; j--) {
                
                    // if skills match and shapes match 
                    if($scope.userRoutine[j].skill 
                    && $scope.userRoutine[i].skill === $scope.userRoutine[j].skill 
                    && $scope.userRoutine[i].tariff === 0){
                    
                        newMove = angular.copy($scope.userRoutine[i]);
                        newMove.repeatMove = true;
                        $scope.userRoutine[i] = newMove; 
                    
                    } else if($scope.userRoutine[j].skill 
                    && $scope.userRoutine[i].skill === $scope.userRoutine[j].skill 
                    && $scope.userRoutine[i].shape 
                    && $scope.userRoutine[i].shape === $scope.userRoutine[j].shape
                    && $scope.userRoutine[i].tariff !== 0){
                    
                        newMove = angular.copy($scope.userRoutine[i]);
                        newMove.repeatMove = true;
                        $scope.userRoutine[i] = newMove; 
                    
                    
                    } else if($scope.userRoutine[j].skill 
                    && $scope.userRoutine[i].skill === $scope.userRoutine[j].skill  
                    && !$scope.userRoutine[i].shape){
                        
                        newMove = angular.copy($scope.userRoutine[i]);
                        newMove.repeatMove = true;
                        $scope.userRoutine[i] = newMove;   
                    }
                }
            }
        }
        // update total tariff on every change
        $scope.sum = $scope.checkTariff($scope.userRoutine);
    }
    
    $scope.checkMoveTariff = function (move) {
        var sum = 0.0;
        if(move.repeatMove === undefined 
        || move.repeatMove === false){
            if(move.tariff && move.shape){
                sum += move.tariff;
                if(move.shape === 'straight' || move.shape === 'pike' ){
                    sum += move.shape_bonus;
                }
                sum = Math.round( sum * 10) / 10;
            }else if(move.tariff){
                sum += move.tariff;
                sum = Math.round( sum * 10) / 10;
            } else if(move.tariff === 0){
                return 0.0;
            }
        }
        return sum;
    }
    
    $scope.checkTariff = function (userRoutine) {
        var sum = 0.0;
        for(var i = userRoutine.length - 1; i >= 0; i--){
            sum += $scope.checkMoveTariff(userRoutine[i]);
        }
        return Math.round( sum * 10) / 10;
    }

})
app.controller('photoController', function($scope, $http, $modal) {
    $http.get(photoJson)
        .then(function(res){
            $scope.albums = res.data;
        });

    $scope.open = function (image) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'photoModalInstanceController',
            resolve: {
                image: function () {
                    return image;
                }
            }
        });
    };
})

app.controller('photoModalInstanceController', function($scope, $modalInstance, image) {
    $scope.image = image;
})