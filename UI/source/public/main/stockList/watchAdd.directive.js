const addNewDirective = function() {

    return {
        restrict: "E",
        scope: {
            mylist: '='
        },
        templateUrl: 'main/stockList/addNew.html',
        controller: function($rootScope, $scope, $element) {
            $scope.newObj = {
                company: '',
                city: '',
                price: ''
            };
            $scope.saveDetails = function(newObj) {
              console.log("Earlier list: ", $scope.mylist);
                console.log("Saving details");
                $scope.mylist.push(newObj);
                $element.remove();
                $scope.$destroy();
            };

            $scope.Delete = function(e) {
                //remove element and also destoy the scope that element
                $element.remove();
                $scope.$destroy();
            }
        }
    }

}

export default addNewDirective;
