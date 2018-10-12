// import Highcharts from 'highcharts/highstock.src';

const AppResolve = {
    initCompany: ($q, $log, $http, $state, $stateParams, $timeout) => {
        "ngInject";

        const defer = $q.defer();

        $http.get('../../../../filetrail.json').then(function(data) {
            console.log("Data of query param is:", $stateParams.name, $stateParams);
            // split the data set into ohlc and volume
            var ohlc = [],
                volume = [],
                dataResponse = data.data.data,
                dataLength = dataResponse.length,
                // set the allowed units for data grouping
                groupingUnits = [
                    [
                        'week', // unit name
                        [1] // allowed multiples
                    ],
                    [
                        'month', [1, 2, 3, 4, 6]
                    ]
                ],

                i = 0;

            for (i; i < dataLength; i += 1) {
                ohlc.push([
                    dataResponse[i][0], // the date
                    dataResponse[i][1], // open
                    dataResponse[i][2], // high
                    dataResponse[i][3], // low
                    dataResponse[i][4] // close
                ]);

                volume.push([
                    dataResponse[i][0], // the date
                    dataResponse[i][5] // the volume
                ]);
            }

            var chartConfig = {

                chart: {

                    zoomType: 'xy'
                },


                // create the chart
                // Highcharts.stockChart('container', {

                rangeSelector: {
                    selected: 1
                },

                // chart: {
                //     width: 800,
                //     height: 700
                // },

                title: {
                    text: 'AAPL Historical'
                },
                xAxis: {
                    categories: null,
                    dateTimeLabelFormats: {
                        milliseconds: "%H %M"
                    },
                    type: "datetime",
                    title: {
                        text: ""
                    },
                    labels: {
                        overflow: "justify"
                    },
                    isX: true
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'OHLC'
                    },
                    height: '60%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'Volume'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2
                }],

                tooltip: {
                    split: true
                },
                

                func: function(chart) {
                    $timeout(function() {
                        chart.reflow();
                        //The below is an event that will trigger all instances of charts to reflow
                        //$scope.$broadcast('highchartsng.reflow');
                    }, 0);
                },

                series: [{
                    type: 'candlestick',
                    name: 'AAPL',
                    data: ohlc,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }, {
                    type: 'column',
                    name: 'Volume',
                    data: volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: groupingUnits
                    }
                }]
            };
            console.log("Main chart Config:", chartConfig);
            defer.resolve(chartConfig);
        }, function(error) {
            $log.log("Error in file");
            defer.reject();
        });
        return defer.promise;
    }
};

export default AppResolve;