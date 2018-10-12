import controller from './appLogin.controller';

const appLoginComponent = {
  restrict: 'E',
  templateUrl: 'main/login/appLogin.html',
  controller,
  controllerAs: 'vm'
};

export default appLoginComponent;
