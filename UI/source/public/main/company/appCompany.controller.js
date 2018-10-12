class appCompanyController {

    constructor($state, $log, $scope, $rootScope, companiesService) {
        "ngInject";
        // let vm = this;

        const vm = this;

        $("a.scrollLink").click(function(e) {

            $('.innerCategories li.active').removeClass('active');

        // this.addClass('active');
        var $parent = $(this).parent();
        $parent.addClass('active');

            $('html, body').animate({
                scrollTop: $($(this).attr("href")).offset().top-150
            }, 2000);
             return false;

        });

        vm.$onInit = function() {
            vm.chartConfig = Object.assign({}, vm.initcompany);
            var w = document.getElementById('charts').offsetWidth - 100;
            var w2 = {
                width: w
            }
            vm.chartConfig.chart = w2;
            vm.companySearch = $rootScope.companyNameSearch;
            vm.companyInfo = {};
        }
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

        vm.label1 = "Label 1";
        vm.label2 = "Label 2";
        vm.label3 = "Label 3";
        vm.label4 = "Label 4";
        vm.label5 = "Label 5";
        vm.label6 = "Label 6";
        vm.label7 = "Label 7";
        vm.label8 = "Label 8";
        vm.label9 = "Label 9";
        vm.label10 = "Label 10";


        // vm.valueTrial = 2;

        vm.addToWatchList = function(x) {
            console.log("click done");
            $state.go('watchList', {
                data: x
            });
        }

        vm.changeFilter = function(item, filterobj) {
            filterobj.filterSelected = item.name;
            console.log("Change Filter called");
        }


    }

}

export default appCompanyController;