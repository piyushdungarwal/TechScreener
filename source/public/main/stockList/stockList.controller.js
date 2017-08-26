class stockListController {

    constructor($log, $timeout, $scope, $compile) {
        "ngInject";

        const vm = this;
        // vm.enableSettings = false;

        vm.name = 'stockList';
        vm.mylist = [{
            company: 'A',
            city: 'A',
            price: 10
        }];

        vm.addnewEntry = function() {
            var divElement = angular.element(document.querySelector('#addNewDiv'));
            var appendHtml = $compile('<add-new mylist=vm.mylist></add-new>')($scope);
            divElement.append(appendHtml);
        }

    }

}

export default stockListController;
