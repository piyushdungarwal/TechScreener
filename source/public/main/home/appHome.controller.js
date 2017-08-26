class appHomeController {

    constructor($state) {
        "ngInject";

        const vm = this;
        vm.filter1 = {
            filterLabel: "Filter1",
            people: [{
                name: 'A',
                email: 'A'
            }, {
                name: 'B',
                email: 'B'
            }, {
                name: 'C',
                email: 'C'
            }, {
                name: 'D',
                email: 'D'
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

        vm.changePerson = function(item, filterobj) {
            filterobj.filterSelected = item.name;
        }
        vm.updateForm = function(){
          console.log("Submit clicked");
          $state.go('stockList');
        }

    }

}

export default appHomeController;
