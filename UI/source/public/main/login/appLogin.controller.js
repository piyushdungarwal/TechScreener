
class appLoginController {

    constructor($location, AuthenticationService) {
        "ngInject";

        var vm = this;
 
        // vm.title='Login Ctrl';
        vm.login = login;
 
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                console.log("success res", response)
                if (response.data.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    // FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
 
    }

}

export default appLoginController;