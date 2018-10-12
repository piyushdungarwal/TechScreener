
class registerController {

    constructor(UserService, $location, $rootScope) {
        "ngInject";

        var vm = this;
 
        vm.register = register;
 
        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    console.log("response", response)
                    if (response.success) {
                        // FlashService.Success('Registration successful', true);
                        console.log("Registration successful");
                        // set session user code
                        $location.path('/login');
                    } else {
                        // FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

    }

}

export default registerController;