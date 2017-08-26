import controller from './appChart.controller.js';

const appchartsComponent = {
  restrict: 'E',
  templateUrl: 'main/chart/appChart.html',
  controller,
  controllerAs: 'vm'
};

export default appchartsComponent;
