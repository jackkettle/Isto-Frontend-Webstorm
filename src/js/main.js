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
    .module('istoApp', ['ngRoute', 'ui.bootstrap', 'ngTable'])

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
    
    .controller('apiClubController', function($scope, $route) {
    
        gapi.client.api.getAllClubNames()
            .execute(
            	function(resp){
            	    console.log(resp);
                	 $scope.clubNames  = resp;
                	 $scope.$apply() 
            	}
            ) 
        
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


    /// API STUFF START
    
    .controller('commistoController', function($scope, $http) {
        

    })

    ///M API STUFF END

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
                console.log($scope.travelData);
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

    .controller('competitionController', function($scope, $routeParams, $http) {
        $scope.params = $routeParams;
        if($scope.params.id == 'info'){
            $scope.tab1 = true;
        }
        if($scope.params.id == 'routines'){
            $scope.tab2 = true;
        }
        if($scope.params.id == 'schedule'){
            $scope.tab3 = true;
        }
        if($scope.params.id == 'tariff'){
            $scope.tab4 = true;
        }
        if($scope.params.id == 'travel'){
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
                console.log($scope.travelData);
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
    .config(function($routeProvider, $locationProvider) {
        
        $routeProvider

            .when('/', {
                templateUrl : 'partials/index.html'
            })

            .when('/competition', {
                templateUrl : 'partials/competition.html',
                controller  : 'defaultCompetitionController'
            })

            .when('/competition/:id', {
                templateUrl : 'partials/competition.html',
                controller  : 'competitionController'
            })

            .when('/sponsor', {
                templateUrl : 'partials/sponsor.html',
                controller  : 'sponsorController'
            })

            .when('/photo', {
                templateUrl : 'partials/photo.html',
                controller  : 'photoController'
            })

            .when('/commisto', {
                templateUrl : 'partials/commisto.html',
                controller  : 'commistoController'
            })

            .when('/history', {
                templateUrl : 'partials/history.html',
                controller  : 'defaultHistoryController'
            })

            .when('/charity', {
                templateUrl : 'partials/charity.html',
                controller  : 'charityController'
            })
            
            .when('/form', {
                templateUrl : 'partials/form.html',
                controller  : 'addCompetitorController'
            })
            
            .when('/dashboard', {
                templateUrl : 'partials/dashboard.html'
            })

            .otherwise({
                templateUrl: 'partials/404.html'
            });

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    })
    