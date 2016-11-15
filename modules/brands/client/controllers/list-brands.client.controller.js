
(function () {
	'use strict';

	angular
		.module('brands')
		.controller('BrandsAdminListController', BrandsAdminListController);

	BrandsAdminListController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication',   'BrandsService', 'Notification'];

	function BrandsAdminListController($scope, $state, $log, $uibModal, Authentication,   BrandsService, Notification) {
		var vm = this;

		// vm.brand = brand;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.brands = BrandsService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.brands) {
					if (vm.brands[i] === item) {
						vm.brands.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Brand deleted successfully!' });
			});
		}

		function save(item) {
			var brand = new BrandsService({
				_id: item._id,
				name: item.name,
				description: item.description
			});

			// Create a new brand, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (brand._id) {
					for (var i in vm.brands) {
						if (vm.brands[i]._id === brand._id) {
							vm.brands[i] = brand;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Brand updated successfully!' });
					brand = null;
				} else {
					vm.brands.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Brand saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Brand save error!' });
			}
		}

		$scope.openAddBrandModal = function (item) {
			vm.selectedBrand = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/brands/client/views/create-brand.client.view.html',
				controller: 'BrandsCreateModalController',
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
		$scope.openDeleteBrandModal = function (item) {
			vm.selectedBrand = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/brands/client/views/delete-brand.client.view.html',
				controller: 'BrandsDeleteModalController',
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
			$scope.selectedBrand = item;
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


	angular.module('brands')
		.controller('BrandsCreateModalController', BrandsCreateModalController);

	BrandsCreateModalController.$inject = ['$scope', 'Authentication', 'BrandsService', '$uibModalInstance', 'ParentScope'];
	function BrandsCreateModalController($scope, Authentication, BrandsService, $uibModalInstance, ParentScope) {

		$scope.brand = new BrandsService({
			name: this.name
		});
		$scope.headerText = 'New Brand';
		if (ParentScope.vm.selectedBrand) {
			$scope.headerText = 'Edit Brand';
			$scope.brand = angular.copy(ParentScope.vm.selectedBrand);
		}
		$scope.isBaseVersionTemp = $scope.brand.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.brands, function (value, key) {
				if ($scope.brand._id !== value._id && value.name.trim() === $scope.brand.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This brand already exist.';
				return;
			}
			$uibModalInstance.close($scope.brand);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedBrandChanged = function (selectedBrand) {
			if (selectedBrand) {
				$scope.brand.name = selectedBrand.originalObject.name;
			} else {
				$scope.brand.name = '';
			}
		};

	}


	angular.module('brands')
		.controller('BrandsDeleteModalController', BrandsDeleteModalController);
	BrandsDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function BrandsDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedBrand);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
