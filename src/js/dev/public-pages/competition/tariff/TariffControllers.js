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