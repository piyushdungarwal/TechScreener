import controller from './appHome.controller';

const appHomeComponent = {
  restrict: 'E',
  templateUrl: 'main/home/appHome.html',
  controller,
  controllerAs: 'vm'
};

export default appHomeComponent;
