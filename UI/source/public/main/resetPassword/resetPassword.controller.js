
class resetPasswordController {

    constructor($location, AuthenticationService) {
        "ngInject";

        var vm = this;
 
        // vm.title='Login Ctrl';
        vm.forgotPswd = forgotPswd;
 
        // (function initController() {
        //     // reset login status
        //     AuthenticationService.ClearCredentials();
        // })();
 
        function forgotPswd() {
            vm.dataLoading = true;
            AuthenticationService.forgotPswd(vm.username, function (response) {
                console.log("success res", response)
                if (response.data.success) {
                    // AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    // FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
 
    }

}

export default resetPasswordController;