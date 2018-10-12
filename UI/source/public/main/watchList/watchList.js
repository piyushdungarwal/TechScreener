import watchListComponent from './watchList.component.js';
import watchAddDirective from './watchAdd.directive.js';

var watchListModule = angular.module('watchListModule', [])
.component('appWatchlist', watchListComponent)
.directive('addNew', watchAddDirective);

export default watchListModule;
