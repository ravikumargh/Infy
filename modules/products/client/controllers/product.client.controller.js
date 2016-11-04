(function () {
	'use strict';

	angular
		.module('products')
		.controller('ProductsController', ProductsController);

	ProductsController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication', 'productResolve', 'ProductsService', 'Notification'];

	function ProductsController($scope, $state, $log, $uibModal, Authentication, product, ProductsService, Notification) {
		var vm = this;

		vm.product = product;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.products = ProductsService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.products) {
					if (vm.products[i] === item) {
						vm.products.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Product deleted successfully!' });
			});
		}

		function save(item) {
			var product = new ProductsService({
				_id: item._id,
				name: item.name,
				version: item.version,
				isBaseVersion: item.isBaseVersion
			});

			// Create a new product, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (product._id) {
					for (var i in vm.products) {
						if (vm.products[i]._id === product._id) {
							vm.products[i] = product;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Product updated successfully!' });
					product = null;
				} else {
					vm.products.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Product saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Product save error!' });
			}
		}

		$scope.openAddProductModal = function (item) {
			vm.selectedProduct = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/products/client/views/create-product.client.view.html',
				controller: 'ProductsCreateModalController',
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
		$scope.openDeleteProductModal = function (item) {
			vm.selectedProduct = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/products/client/views/delete-product.client.view.html',
				controller: 'ProductsDeleteModalController',
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
			$scope.selectedProduct = item;
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


	angular.module('products')
		.controller('ProductsCreateModalController', ProductsCreateModalController);

	ProductsCreateModalController.$inject = ['$scope', 'Authentication', 'ProductsService', '$uibModalInstance', 'ParentScope'];
	function ProductsCreateModalController($scope, Authentication, ProductsService, $uibModalInstance, ParentScope) {

		$scope.product = new ProductsService({
			name: this.name
		});
		$scope.headerText = 'New Product';
		if (ParentScope.vm.selectedProduct) {
			$scope.headerText = 'Edit Product';
			$scope.product = angular.copy(ParentScope.vm.selectedProduct);
		}
		$scope.isBaseVersionTemp = $scope.product.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.products, function (value, key) {
				if ($scope.product._id !== value._id && value.name.trim() === $scope.product.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This product already exist.';
				return;
			}
			$uibModalInstance.close($scope.product);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedProductChanged = function (selectedProduct) {
			if (selectedProduct) {
				$scope.product.name = selectedProduct.originalObject.name;
			} else {
				$scope.product.name = '';
			}
		};

	}


	angular.module('products')
		.controller('ProductsDeleteModalController', ProductsDeleteModalController);
	ProductsDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function ProductsDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedProduct);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
