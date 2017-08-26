import Highcharts from 'highcharts/highstock.src';
require('highcharts/modules/treemap.src')(Highcharts);
require('highcharts/modules/no-data-to-display.src')(Highcharts);
require('highcharts/highcharts-more.src')(Highcharts);

const hichartsDirective = ($timeout) => {
    "ngInject";

    const directive = {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            options: '='
        },
        link: (scope, element) => {
            //destroy charts to prevent memory leaks
            element.on('$destroy', function() {
                if (angular.element(element[0]).highcharts()) {
                    const elHighchart = angular.element(element[0]).highcharts();
                    try {
                        if (elHighchart.destroy) {
                            elHighchart.destroy();
                        }
                    } catch (exp) {}
                }
            });

            Highcharts.chart(element[0], scope.options);

        }
    };
    return directive;
};
export default hichartsDirective;
