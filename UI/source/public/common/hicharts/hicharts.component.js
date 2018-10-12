import controller from './hicharts.controller';

const hichartsComponent = {
    restrict: 'E',
    templateUrl: 'common/hicharts/hicharts.html',
    bindings: {
        chartoptions: '='
    },
    controller,
    controllerAs: 'vm'

};

export default hichartsComponent;