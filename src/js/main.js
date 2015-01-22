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

function checkApi() {
    if(gapi.client.api == undefined){
        
    }
}


angular
    .module('istoApp', ['ui.router', 'ui.bootstrap', 'ngTable'])

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
    
    .controller('addCompetitorController', function ($scope) {
        
        // GLOBAL CONSTANTS
        $scope.teams = [
            {name: "A", value: 1},
            {name: "B", value: 2},
            {name: "C", value: 3}
        ];
        $scope.trampLevels = [
            {name: "Novice", value: 1},
            {name: "Intermediate", value: 2},
            {name: "Inter-advanced", value: 3},
            {name: "Advanced", value: 4},
            {name: "Elite", value: 5},
            {name: "Elite-pro", value: 6}
        ];
        $scope.dmtLevels = [1,2,3];
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
        $scope.syncLevels = [
            {name: "Novice and Intermediate", value: 1},
            {name: "Intervanced and Advanced", value: 2},
            {name: "Elite and Pro-Elite", value: 3}
        ];

        
        // Starting values for our form object
        $scope.form = {
            basic: {
                name        : "",
                commisto    : false,  
                social      : false,
                guest       : false
            },
            helper: {
                scorekeeper : false,
                marshall    : false,
                shirt       : false,
                shirtSize   : "",
                shirtColor  : ""
            },
            competition: {
                trampolining: {
                    competing   : false,
                    sync        : false,
                    syncpartner : "",
                    team        : "",
                    level       : ""
                },
                tumbling: {
                    competing   : false,
                    level       : ""
                },
                dmt: {
                    competing   : false,
                    level       : ""
                }
            },
            judging: {
                trampolining: {
                    form        : false,
                    tariff      : false,
                    sync        : false,
                    superior    : false,
                    level       : ""
                    
                },
                tumbling: {
                    judge       : false,
                    superior    : false,
                    level       : ""
                },
                dmt: {
                    judge       : false,
                    superior    : false,
                    level       : ""
                }
            }
        }
        
        $scope.addCompetitorSubmit=function(){
            var data=$scope.form;  
            /* post to server*/
            console.log("submitted"); 
            console.log(data);     
        }
    })
    
    
    .controller('apiClubController', function($scope) {
        
        $scope.loadClub = function(clubName) {
            console.log("loadClub");
            gapi.client.api.getClub({ Name: clubName}).execute(
            	function(resp){
            	    console.log(resp);
                	 $scope.club  = resp;
                	 $scope.$apply() 
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
                templateUrl: "partials/dashboard.html",
                controller: "apiClubController",
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
    
    .controller('loginNavController', function ($scope, $state, loginModal) {

        $scope.logModal = function () {
            loginModal()
                .then(function () {
                        $state.go('dashboard');
                    })
                    .catch(function () {
                        $state.go('home');
                    });
        }
        
    })
    
    .controller('LoginModalCtrl', function ($scope, UsersApi) {

        this.cancel = function () {
            console.log("cancel");
            $scope.$dismiss();
        }
        
        this.submit = function (email, password) {
            console.log("submit");
            UsersApi(email, password).then(function (user) {
                console.log(user);
                console.log(user.result);
                if(user.result == false){
                    $scope.warning = true;
                    $scope.message = "Invalid user or password.";
                    $scope.apply();
                }else{
                    $scope.$close(user);
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
    
    .run(function ($rootScope, $state, loginModal) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            
            var requireLogin = toState.data.requireLogin;   
            
            
            if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                event.preventDefault();
                console.log("Get me a login modal!");
                
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
                
            var user = gapi.client.api.login(details)
            return user;
        }
    })
    
    .service('loginModal', function ($modal, $rootScope) {

        function assignCurrentUser (user) {
            $rootScope.currentUser = user;
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
    