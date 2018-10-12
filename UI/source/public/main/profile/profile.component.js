import controller from './profile.controller';

const profileComponent = {
  restrict: 'E',
  templateUrl: 'main/profile/profile.html',
  controller,
  controllerAs: 'vm'
};

export default profileComponent;
