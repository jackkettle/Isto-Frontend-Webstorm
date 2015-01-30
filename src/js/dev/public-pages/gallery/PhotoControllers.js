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