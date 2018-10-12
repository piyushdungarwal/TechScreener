import appCompanyComponent from './appCompany.component';
import AppCompanyResolve from './appCompany.resolve.js';
import AppCompanyController from './appCompany.controller.js';

var appCompanyModule = angular.module('appCompanyModule', []);

appCompanyModule.config(($stateProvider) => {
    "ngInject";
    $stateProvider
        .state('company', {
            url: '/company/:name',
            template: '<app-company initcompany="$resolve.initCompany"></app-company>',
            // controller: AppCompanyController,
            resolve: AppCompanyResolve
        });
}).component('appCompany', appCompanyComponent);

export default appCompanyModule;