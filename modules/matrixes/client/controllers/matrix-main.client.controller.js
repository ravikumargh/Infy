(function () {
  'use strict';

  angular
    .module('chat')
    .controller('MatrixMainController', MatrixMainController);

  MatrixMainController.$inject = ['$scope', '$state', 'Authentication'];

  function MatrixMainController($scope, $state, Authentication) {
    var vm = this;
    
    vm.authentication = Authentication;
    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
    }
  }
} ());
