class DropdownListController {
    constructor() {
        const vm = this;

        vm.onupdatefilter = function(item) {
            vm.updatefilter({
                item: item,
                filterobj: vm.filterobj
            });
        }
    }
}

export default DropdownListController;
