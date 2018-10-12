import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

import $ from 'jquery';

import WatchListUserService from './services/watchListUsers';
import companiesService from './services/companies';
import UserService from './services/UserService';
import AuthenticationService from './services/AuthenticationService';


import Hicharts from './common/hicharts/hicharts.js';
import DropdownList from './common/dropdownList/dropdownList.js';

import uiSelect from 'ui-select';
import ngSanitize from 'angular-sanitize';
import angularUIBootstrap from 'angular-ui-bootstrap';
import uiGrid from 'angular-ui-grid';

import appHomeModule from './main/home/appHome.js';
import appChartModule from './main/chart/appChart.js';
import appChart2Module from './main/chart2/appChart2.js';
import watchListModule from './main/watchList/watchList.js';
import stockListModule from './main/stockList/stockList.js';
import companyInfoModule from './main/company/appCompany.js';
import appLoginModule from './main/login/appLogin.js';
import resetPasswordModule from './main/resetPassword/resetPassword.js';

import profileModule from './main/profile/profile.js';
import appRegisterModule from './main/register/register.js';

import highchart from 'highcharts-release/highcharts.src';
import highchartNg from 'highcharts-ng/dist/highcharts-ng';

var app = angular.module('app', [uiRouter, ngCookies, uiSelect, uiGrid, highchartNg, ngSanitize, angularUIBootstrap, 
    Hicharts.name, DropdownList.name, appHomeModule.name, appChartModule.name, appChart2Module.name, watchListModule.name,
    stockListModule.name, companyInfoModule.name, appLoginModule.name, appRegisterModule.name, profileModule.name, resetPasswordModule.name]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    "ngInject";
    $locationProvider.html5Mode({
        requireBase: true,
        enabled: true
    }).hashPrefix('!');
    $stateProvider.state('login', {
        url: '/login',
        template: '<app-login></app-login>',
        data: {
            rule: function(user) {
                return false
            }
        }
    }).state('register', {
        url: '/register',
        template: '<register></register>',
        data: {
            rule: function(user) {
                return false
            }
        }
    }).state('resetPassword', {
        url: '/resetPassword',
        template: '<reset-password><reset-password>'
    }).state('home', {
        url: '/home',
        template: '<app-home></app-home>',
        data: {
            rule: function(user) {
                return false
            }
        }
    }).state('charts', {
        url: '/charts',
        template: '<app-chart></app-chart>',
        data: {
            rule: function(user) {
                return false
            }
        }
    }).state('chart2', {
        url: '/charts2',
        template: '<app-chart2></app-chart2>',
        data: {
            rule: function(user) {
                return false
            }
        }
    }).state('watchList', {
        url: '/watchlist',
        template: '<app-watchlist></app-watchlist>',
        data: {
            rule: function(user) {
                return false
            }
        },
        params: {
            'data': null
        }
    }).state('stockList', {
        url: '/stockList',
        template: '<app-stocklist></app-stocklist>',
        data: {
            rule: function(user) {
                return false
            }
        }
    }).state('profile', {
        url: '/profile',
        template: '<profile></profile>',
        data: {
            rule: function(user) {
                return true
            }
        }
    });
    $urlRouterProvider.otherwise('/home');
    // let myToken = localStorage.getItem('token');
    // $httpProvider.defaults.headers.post['token'] = myToken;
});

// app.config(['$httpProvider', function ($httpProvider) {
//     $httpProvider.defaults.headers.post['token'] = 'your_token';
// }]);

app.run(function($rootScope, $location, $state, $http, $cookies) {
    
    // login related

    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        // $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }
 
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
        // var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var restrictedPage = false;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });


    // get auth token
    $http.defaults.headers.common['authorization'] = localStorage.getItem('token');

    $rootScope.logout = function() {
        localStorage.setItem('token', null)
        $http.defaults.headers.common['authorization'] = null
    }

    $rootScope.companyNameSearch = '';
    
    $rootScope.getCompanyInfo = function(a) {
        $state.go('company',{
            name: a.selected.formatted_address
        });
    };

    $rootScope.myCompanies={};
    $rootScope.myCompanies.companies={};
    $rootScope.refreshCompanies = function(address) {
        if(address === ''){
            address = {};
        }
        var params = {address: address, sensor: false};
        return $http.get(
          'http://maps.googleapis.com/maps/api/geocode/json',
          {params: params},{
                headers: {
                    'authorization': undefined
                }
              }
        ).then(function(response) {
          $rootScope.companyList = response.data.results;
        });
      };

    // $('.nav li a').click(function(e) {

    //     $('.nav li.active').removeClass('active');

    //     var $parent = $(this).parent();
    //     $parent.addClass('active');
    // });   
    
});

app.factory('UserService', UserService)
    .factory('AuthenticationService', AuthenticationService)
    .factory('WatchListUserService', WatchListUserService)
    .factory('companiesService', companiesService);

app.directive('placeholderAlwaysVisible', function() {
  return {
    require: 'uiSelect',
    link: function($scope, $element, attrs, $select) {     
      $select.getPlaceholder = function () {
        return $select.placeholder;
      }
    }
  }
});