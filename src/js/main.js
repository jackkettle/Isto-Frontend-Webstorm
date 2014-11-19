// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs

var commistoJson = "json/commisto.json";
var sponsorJson = "json/sponsor.json";
var photoJson = "json/photos.json";

angular

    .module('istoApp', ['ngRoute', 'ui.bootstrap'])

    .controller('socialController', function($scope) {
        $scope.twitter  = 'https://twitter.com/COMMISTO';
        $scope.facebook = 'https://www.facebook.com/pages/Irish-Student-Trampoline-Open/139153787666';
        $scope.google   = 'https://plus.google.com/u/0/114618181369690971121/posts';
        $scope.mail     = 'mailto:info@isto.ie';
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

    .controller('navController', function($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    })

    // configure our routes
    .config(function($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl : 'partials/index.html'
            })

            .when('/competition', {
                templateUrl : 'partials/competition.html'
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
                templateUrl : 'partials/history.html'
            })

            .when('/contact', {
                templateUrl : 'partials/contact.html'
            })

            .otherwise({
                templateUrl: 'partials/404.html'
            });

    })