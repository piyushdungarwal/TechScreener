class watchListController {

    constructor($log, $timeout, $scope, $compile, $stateParams, WatchListUserService) {
        "ngInject";

        const vm = this;
        // vm.enableSettings = false;

        vm.name = 'stockList';

        if ($stateParams.data) {
            WatchListUserService.watchListUsers.push($stateParams.data);
        };
        vm.mylist = WatchListUserService.watchListUsers;
        vm.addnewEntry = function() {
            var divElement = angular.element(document.querySelector('#addNewDiv'));
            var appendHtml = $compile('<add-new mylist=vm.mylist></add-new>')($scope);
            divElement.append(appendHtml);
        }

    }

}

export default watchListController;
