import stockListComponent from './stockList.component.js';

var stockListModule = angular.module('stockListModule', [])
.component('appStocklist', stockListComponent)


export default stockListModule;
