import controller from './dropdownList.controller';

const dropdownListComponent = {
  restrict: 'E',
  templateUrl: 'common/dropdownList/dropdownList.html',
  bindings: {
    filterobj: '=',
    filterlist: '=',
    updatefilter: '&'
  },
  controller,
  controllerAs: 'vm'
};

export default dropdownListComponent;
