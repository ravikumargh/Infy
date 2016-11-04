(function () {
  'use strict';

  angular
    .module('publishedmatrixes')
    .controller('PublishedMatrixesController', PublishedMatrixesController);

  PublishedMatrixesController.$inject = ['$scope', '$state', '$stateParams', '$log', '$uibModalInstance', 'Authentication', 'PublishedMatrixResource', 'ParentScope'];

  function PublishedMatrixesController($scope, $state, $stateParams, $log, $uibModalInstance, Authentication, PublishedMatrixResource, ParentScope) {
    var vm = this;

    vm.authentication = Authentication;
  vm.selectedCategory = ParentScope.selectedCategory;
    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      $scope.categoryMatrix = PublishedMatrixResource.get({
        categoryId: vm.selectedCategory._id
      });

    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


  }
} ());
