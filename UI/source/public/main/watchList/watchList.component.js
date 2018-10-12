import controller from './watchList.controller.js';

const watchListComponent = {
  restrict: 'E',
  templateUrl: 'main/watchList/watchList.html',
  controller,
  controllerAs: 'vm'
};

export default watchListComponent;
