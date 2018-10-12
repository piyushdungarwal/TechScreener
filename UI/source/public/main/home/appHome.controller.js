
class appHomeController {

    constructor($state, $http) {
        "ngInject";

        const vm = this;


        vm.myC={};
        vm.companyList1 = [];
        vm.myC.companies={};
        vm.$onInit = () => {
            setTimeout(function() {
                var ele = document.getElementById('parentHome');
                var ele2 = ele.querySelector('.ui-select-toggle');
                var ele3 = ele.querySelector('.ui-select-search');
                var ele4 = ele.querySelector('.ui-select-match-text');
                ele2.style.height = '45px';
                ele3.style.height = '45px';
                ele4.style.position = 'relative';
                ele4.style.top = '7px';
            }, 1000);
        }
        vm.refreshCompanies1 = function(address) {
            if(address === ''){
                address = {};
            }
            var params = {address: address, sensor: false};
            return $http.get(
              'http://maps.googleapis.com/maps/api/geocode/json',
              {params: params}, {
                headers: {
                    'authorization': undefined
                }
              }
            ).then(function(response) {
              vm.companyList1 = response.data.results;
            }).catch(function(response) {
                // errror 
            });
        
        };

    }

}

export default appHomeController;