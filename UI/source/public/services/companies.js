const companiesService = function($log, $http) {
    function getCompaniesList() {
        return $http({
            method: 'GET',
            url: '/companies/all'
        });
    };

    function getCompanyInfo(value){
        return $http({
            method: 'GET',
            url:'/companyinfo/?name=' + value
        });
    };

    return {
        // companiesList: getCompaniesList(),
        getCompanyInfo: getCompanyInfo()
    }
};

export default companiesService;
