
class profileController {

    constructor($location, AuthenticationService) {
        "ngInject";

        var vm = this;

        vm.$onInit = () => { 
            AuthenticationService.getProfile(function(response) {
                console.log("controller get Profile", response)
            });
        }
 
        // vm.title='Login Ctrl';
        // vm.login = login;
 
        // (function initController() {
        //     // reset login status
        //     AuthenticationService.ClearCredentials();
        // })();
 
        // function login() {
        //     vm.dataLoading = true;
        //     AuthenticationService.Login(vm.username, vm.password, function (response) {
        //         if (response.success) {
        //             AuthenticationService.SetCredentials(vm.username, vm.password);
        //             $location.path('/');
        //         } else {
        //             // FlashService.Error(response.message);
        //             vm.dataLoading = false;
        //         }
        //     });
        // };
 
    }

}

export default profileController;