import Highcharts from 'highstock-release/highstock.src';
require('highstock-release/modules/treemap.src')(Highcharts);
require('highstock-release/modules/no-data-to-display.src')(Highcharts);
require('highstock-release/highcharts-more.src')(Highcharts);

const hichartsDirective = ($timeout) => {
    "ngInject";
    
    const directive = {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            chartoptions: '='
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
            // scope.chartoptions.width = 800;
            // scope.chartoptions.height = 500;
            console.log("directive options:", scope.chartoptions);
            Highcharts.chart(element[0], scope.chartoptions);

        }
    };
    return directive;
};
export default hichartsDirective;