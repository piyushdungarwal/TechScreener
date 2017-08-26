import angular from 'angular';
import hichartsComponent from './hicharts.component';
import hichartsDirective from './hicharts.directive';

const hichartsModule = angular.module('hicharts', [])

.component('hicharts', hichartsComponent)
  .directive('hcChart', hichartsDirective);

export default hichartsModule;
