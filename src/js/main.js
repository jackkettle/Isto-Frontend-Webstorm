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

angular
    .module('istoApp', ['ui.router', 'ui.bootstrap', 'ngTable', 'ngCookies'])

    .controller('socialController', function($scope) {
        $scope.twitter  = 'https://twitter.com/COMMISTO';
        $scope.facebook = 'https://www.facebook.com/pages/Irish-Student-Trampoline-Open/139153787666';
        $scope.google   = 'https://plus.google.com/u/0/114618181369690971121/posts';
        $scope.youtube  = 'https://www.youtube.com/user/isto2012/';
        $scope.mail     = 'mailto:info@isto.ie';
    })

    .controller('defaultHistoryController', function ($scope, $http) {
        $http.get(historyJson)
            .then(function(res){
                $scope.history = res.data;
            });
    })
    
    .controller('addCompetitorController', function ($scope, $rootScope, $state) {
        
        // GLOBAL CONSTANTS
        $rootScope.teams = [
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
        
        $scope.addCompetitorSubmit=function(){
            var data=$scope.form;  
            /* post to server*/
            console.log("submitted"); 
            console.log(data);
            gapi.client.api.addMember({ 
                Club                        : $rootScope.currentUser.clubName,
                Name                        : data.basic.name,
                CommISTO                    : data.basic.commisto,
                socialTicket                : data.basic.social,
                guest                       : data.basic.guest,
                gender                       : data.basic.gender,
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

    .controller('commistoController', function($scope, $http) {
        $http.get(commistoJson)
            .then(function(res){
                $scope.committee = res.data;
            });
    })

    .controller('sponsorController', function($scope, $http) {
        $http.get(sponsorJson)
            .then(function(res){
                $scope.sponsors = res.data;
            });
    })
    
    .controller('charityController', function($scope, $http) {
        $http.get(charityJson)
            .then(function(res){
                $scope.charity = res.data;
            });
    })

    .controller('photoController', function($scope, $http, $modal) {
        $http.get(photoJson)
            .then(function(res){
                $scope.albums = res.data;
            });

        $scope.open = function (image) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'modalInstanceController',
                resolve: {
                    image: function () {
                        return image;
                    }
                }
            });
        };
    })

    .controller('modalInstanceController', function($scope, $modalInstance, image) {
        $scope.image = image;
    })

    .controller('navController', function($scope, $location, $rootScope) {
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

    .controller('defaultCompetitionController', function($scope, $http) {
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

    .controller('competitionController', function($scope, $stateParams, $http) {
        
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
    
    .controller("tariffController", function ($scope, $http) {
    
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

// configure our routes
    .config(function($stateProvider, $urlRouterProvider) {
        
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
                    requireLogin: true // this property will apply to all children of 'app'
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

    })
    
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------
    
    .controller('loginNavController', function ($scope, $state, loginModal, $rootScope, $cookieStore) {

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
        
    })
    
    .controller('LoginModalCtrl', function ($scope, UsersApi, $cookieStore,$rootScope) {

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

    
    .config(function ($httpProvider) {
    
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
                            $state.go('home');
                            deferred.reject(rejection);
                        });
                    return deferred.promise;
                }
            }
        })
    })
    
    .run(function ($rootScope, $state, $injector, loginModal,$cookieStore) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            
            var requireLogin = toState.data.requireLogin;
            
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
    
    .service('UsersApi', function ($modal, $rootScope) {

        return function (userName, password) {
            
            var details = {
                User: userName, 
                Password: password
            }
                
            var user = gapi.client.api.login(details);
            return user;
        }
    })
    
    .service('loginModal', function ($modal, $rootScope, $cookieStore) {

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
    
    .factory('Gapi', function($timeout, $q) {
        return {
            load: function load() {
                if (typeof gapi.client.api === 'undefined') {
                    return $timeout(load, 500);
                }else{
                    $q.promise
                }
            }
        }
    })
    
    .controller('deleteMemberModalController', function ($scope, $state, name, clubName) {
        
        
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
    
    
    .controller('apiClubController', function($scope, Gapi, $rootScope, $modal) {
        
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
        
        if(typeof gapi.client.api !== 'undefined'){
            gapi.client.api.getClub({Name: $rootScope.currentUser.clubName}).execute(
                	function(resp){
                        $scope.club  = resp;
                        console.log(resp);
                        $scope.$apply() 
                	}
                )
        } else {
            Gapi.load()
            .then(function () {
                gapi.client.api.getClub({ Name: $rootScope.currentUser.clubName}).execute(
                	function(resp){
                        $scope.club  = resp;
                        console.log(resp);
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
    
