import stockListComponent from './stockList.component.js';
import stockAddDirective from './stockAdd.directive.js';

var stockListModule = angular.module('stockListModule', [])
.component('appStocklist', stockListComponent)
.directive('addNew', stockAddDirective);

export default stockListModule;
