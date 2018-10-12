import controller from './appCompany.controller';

const appCompanyComponent = {
    restrict: 'E',
    templateUrl: 'main/company/appCompany.html',
    bindings: {
        initcompany: '<'
    },
    controller,
    controllerAs: 'vm'
};

export default appCompanyComponent;