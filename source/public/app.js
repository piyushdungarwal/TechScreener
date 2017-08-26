import angular from 'angular';
import uiRouter from 'angular-ui-router';
import $ from 'jquery';
import Hicharts from './common/hicharts/hicharts.js';
import DropdownList from './common/dropdownList/dropdownList.js';
import uiSelect from 'ui-select';
import ngSanitize from 'angular-sanitize';
import angularUIBootstrap from 'angular-ui-bootstrap';
import appHomeModule from './main/home/appHome.js';
import appChartModule from './main/chart/appChart.js';
import appChart2Module from './main/chart2/appChart2.js';
import stockListModule from './main/stockList/stockList.js';
import highchart from 'highcharts/highstock.src';
import highchartNg from 'highcharts-ng/dist/highcharts-ng';

var app = angular.module('app', [uiRouter, uiSelect, highchartNg, ngSanitize, angularUIBootstrap, Hicharts.name, DropdownList.name, appHomeModule.name, appChartModule.name, appChart2Module.name, stockListModule.name]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode({
        requireBase: true,
        enabled: true
    }).hashPrefix('!');
    $stateProvider.state('home', {
        url: '/home',
        template: '<app-home></app-home>'
    }).state('chart', {
        url: '/charts',
        template: '<app-chart></app-chart>'
    }).state('chart2', {
        url: '/charts2',
        template: '<app-chart2></app-chart2>'
    }).state('stockList', {
        url: '/list',
        template: '<app-stocklist></app-stocklist>'
    });
    $urlRouterProvider.otherwise('/home');
});


$(".nav li").on("click", function() {
    $(".nav li").removeClass("active");
    $(this).addClass("active");
});
