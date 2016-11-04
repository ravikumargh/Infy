(function () {
	'use strict';

	angular
		.module('categories')
		.controller('CategoriesController', CategoriesController);

	CategoriesController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication', 'categoryResolve', 'CategoriesService', 'Notification'];

	function CategoriesController($scope, $state, $log, $uibModal, Authentication, category, CategoriesService, Notification) {
		var vm = this;

		vm.category = category;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.categories = CategoriesService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.categories) {
					if (vm.categories[i] === item) {
						vm.categories.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category deleted successfully!' });
			});
		}

		function save(item) {
			var category = new CategoriesService({
				_id: item._id,
				name: item.name,
				version: item.version,
				isBaseVersion: item.isBaseVersion
			});

			// Create a new category, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (category._id) {
					for (var i in vm.categories) {
						if (vm.categories[i]._id === category._id) {
							vm.categories[i] = category;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category updated successfully!' });
					category = null;
				} else {
					vm.categories.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Category saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Category save error!' });
			}
		}

		$scope.openAddCategoryModal = function (item) {
			vm.selectedCategory = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/categories/client/views/create-category.client.view.html',
				controller: 'CategoriesCreateModalController',
				resolve: {
					ParentScope: function () {
						return $scope;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				vm.save(selectedItem);
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
		$scope.openDeleteCategoryModal = function (item) {
			vm.selectedCategory = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/categories/client/views/delete-category.client.view.html',
				controller: 'CategoriesDeleteModalController',
				resolve: {
					ParentScope: function () {
						return $scope;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				vm.remove(selectedItem);
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
		$scope.openViewPublishedMatrixModal = function (item) {			
			$scope.selectedCategory = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				size:'lg',
				templateUrl: '/modules/publishedmatrixes/client/views/publishedmatrix.client.view.html',
				controller: 'PublishedMatrixesController',
				resolve: {
					ParentScope: function () {
						return $scope;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
				 
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
	}


	angular.module('categories')
		.controller('CategoriesCreateModalController', CategoriesCreateModalController);

	CategoriesCreateModalController.$inject = ['$scope', 'Authentication', 'CategoriesService', '$uibModalInstance', 'ParentScope'];
	function CategoriesCreateModalController($scope, Authentication, CategoriesService, $uibModalInstance, ParentScope) {

		$scope.category = new CategoriesService({
			name: this.name
		});
		$scope.headerText = 'New Category';
		if (ParentScope.vm.selectedCategory) {
			$scope.headerText = 'Edit Category';
			$scope.category = angular.copy(ParentScope.vm.selectedCategory);
		}
		$scope.isBaseVersionTemp = $scope.category.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.categories, function (value, key) {
				if ($scope.category._id !== value._id && value.name.trim() === $scope.category.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This category already exist.';
				return;
			}
			$uibModalInstance.close($scope.category);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedCategoryChanged = function (selectedCategory) {
			if (selectedCategory) {
				$scope.category.name = selectedCategory.originalObject.name;
			} else {
				$scope.category.name = '';
			}
		};

	}


	angular.module('categories')
		.controller('CategoriesDeleteModalController', CategoriesDeleteModalController);
	CategoriesDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function CategoriesDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedCategory);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
