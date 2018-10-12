import angular from 'angular';
import dropDownListComponent from './dropdownList.component';

const dropdownListModule = angular.module('dropdownList', [])

.component('dropdownList', dropDownListComponent);

export default dropdownListModule;
