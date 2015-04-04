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