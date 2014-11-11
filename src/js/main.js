// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs
angular

    .module('scotchApp', ['ngRoute'])

    // configure our routes
    .config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'partials/index.html'
            })

            .when('/competition', {
                templateUrl : 'partials/competition.html'
            })

            .when('/sponsor', {
                templateUrl : 'partials/sponser.html'
            })

            .when('/photo', {
                templateUrl : 'partials/photo.html'
            })

            .when('/history', {
                templateUrl : 'partials/history.html'
            })

            .when('/contact', {
                templateUrl : 'partials/contact.html'
            })

            .otherwise({
                redirectTo: 'partials/404.html'
            });


    })

    // create the controller and inject Angular's $scope
    .controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });
