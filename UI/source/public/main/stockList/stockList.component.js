import controller from './stockList.controller.js';

const stockListComponent = {
  restrict: 'E',
  templateUrl: 'main/stockList/stockList.html',
  controller,
  controllerAs: 'vm'
};

export default stockListComponent;
