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
                requireLogin: true // this property will apply to all children of 'app'
            }

        })
        /*
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
        */
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
                        $state.go('home');
                        deferred.reject(rejection);
                    });
                return deferred.promise;
            }
        }
    })
})

app.run(function ($rootScope, $state, $injector, loginModal,$cookieStore) {


    $rootScope.maxTumbling  = 80;
    $rootScope.maxDMT       = 80;
    $rootScope.maxSync      = 165;

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
