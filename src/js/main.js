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
                templateUrl : 'partials/home.html'
            })

            // route for the about page
            .when('/about', {
                templateUrl : 'partials/404.html'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : 'partials/home.html'
            });
    })

    // create the controller and inject Angular's $scope
    .controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });
