class stockListController {

    constructor($log, $timeout, $scope, $state, companiesService) {
        "ngInject";

        const vm = this;

        vm.name = 'stockList';

        vm.filter1 = {
            filterLabel: "Price",
            people: [{
                name: '<50',
                id: 1
            }, {
               name: '50 - 100',
                id: 2
            }, {
                name: '100 - 150',
                id: 3
            }, {
                name: '150 - 200',
                id: 4
            }],
            filterSelected: 'N/A'
        };

        vm.filter2 = {
            filterLabel: "Filter2",
            people: [{
                name: 'W',
                email: 'W'
            }, {
                name: 'X',
                email: 'X'
            }, {
                name: 'Y',
                email: 'Y'
            }, {
                name: 'Z',
                email: 'Z'
            }],
            filterSelected: 'N/A'
        };
        vm.changeFilter = function(item, filterobj) {
            filterobj.filterSelected = item.name;
            console.log("Change Filter called");
        }

        vm.updateForm = function() {
            console.log("Submit clicked");
            $state.go('stockList');
        }

        vm.mylist = [];
        // companiesService.companiesList.then(function(result) {
        //     console.log("result:", result.data.mydata);
        //     var companyList = result.data.mydata;
        //     companyList.forEach(function(item, index) {
        //         vm.mylist.push({
        //             company: item,
        //             place: item,
        //             location: item
        //         });                
        //     });
        // }, function() {
        //     $log.log("Error error");
        // });
        vm.gridOptions = {
            data: vm.mylist,
            enableSorting: true,
            enableGridMenu: true,
            enableFiltering: true,
            columnDefs: [{
                field: 'company',
                name: 'Company',
                enableFiltering: false
                // ,
                // width: 200
            }, {
                field: 'place',
                name: 'Place',
                enableFiltering: false
                // ,
                // width: 200
            }, {
                field: 'location',
                name: 'Location',
                enableFiltering: false
                // ,
                // width: 200
            }, {
                name: 'Button',
                enableFiltering: false,
                cellTemplate: '<button class="btn btn-primary" style="margin-left: 5px; height:25px; padding-top: 2px" ng-click="grid.appScope.addToWatchList(x)">Add to watchList</button>'
                // ,
                // width: 250
            }]
        };
        $scope.addToWatchList = function(x) {
          console.log("click done stocks");
            $state.go('watchList', {
                data: x
            });
        }

    }

}

export default stockListController;
