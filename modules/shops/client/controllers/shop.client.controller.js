(function () {
	'use strict';

	angular
		.module('shops')
		.controller('ShopsController', ShopsController);

	ShopsController.$inject = ['$scope', '$state', '$stateParams', '$log', '$uibModal', 'Authentication', 'ShopsService', 'CategoriesService', 'Notification'];

	function ShopsController($scope, $state, $stateParams, $log, $uibModal, Authentication, ShopsService, CategoriesService, Notification) {
		var vm = this;

		vm.shop = new ShopsService;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;
		// vm.update = update;
		vm.create = create;
		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			if ($stateParams.shopId) {
				vm.shop = ShopsService.get({
					shopId: $stateParams.shopId
				});
			} else {
				vm.shops = ShopsService.query();
			}
			vm.categories = CategoriesService.query();
		}

		function create(isValid) {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.shopForm');

				return false;
			}

			var shop = vm.shop;
			if (vm.place) {
				shop.address.place = vm.place.name;
				shop.address.phone = vm.place.international_phone_number;
			}
			debugger;
			// shop.$save(function () {
			// 	$state.go('admin.shops.list', {
			// 		shopId: shop._id
			// 	});
			// 	Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> shop saved successfully!' });
			// }, function (errorResponse) {
			// 	Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> shop update error!' });
			// });



			shop.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (shop._id) {
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop updated successfully!' });
					shop = null;
				} else {
					vm.departments.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop saved successfully!' });
				}
				$state.go('admin.shops.list');
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Shop save error!' });
			}

		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.shops) {
					if (vm.shops[i] === item) {
						vm.shops.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop deleted successfully!' });
			});
		}

		function save(item) {
			var shop = new ShopsService({
				_id: item._id,
				name: item.name,
				description: item.description
			});
			// Create a new shop, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (shop._id) {
					for (var i in vm.shops) {
						if (vm.shops[i]._id === shop._id) {
							vm.shops[i] = shop;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop updated successfully!' });
					shop = null;
				} else {
					vm.shops.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Shop saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Shop save error!' });
			}
		}

		$scope.openAddShopModal = function (item) {
			vm.selectedShop = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/shops/client/views/create-shop.client.view.html',
				controller: 'ShopsCreateModalController',
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
		$scope.openDeleteShopModal = function (item) {
			vm.selectedShop = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/shops/client/views/delete-shop.client.view.html',
				controller: 'ShopsDeleteModalController',
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
			$scope.selectedShop = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				size: 'lg',
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

		/*Map starts***********************************************************/
		var map;

		$scope.location = { H: 12.3474743, L: 76.6033769 }
		$scope.center = [$scope.location.H, $scope.location.L];

		$scope.$on('mapInitialized', function (evt, evtMap) {
			map = evtMap;

			$scope.position = map.center;

			map.addListener('click', function (event) {
				clearMarkers();
				$scope.position = event.latLng;
				//console.log($scope.position);
				addMarker(event.latLng);
			});
		});

		var markers = [];
		// Adds a marker to the map and push to the array.
		function addMarker(location) {
			var marker = new google.maps.Marker({
				position: location,
				map: map,
				draggable: true
			});
			markers.push(marker);
			marker.addListener('drag', function (position) {
				$scope.position = position.latLng;
				//$scope.development.location.address = $scope.searchAddress.address
				$scope.latitude = position.latLng.H;
				$scope.longitude = position.latLng.L;
				//console.log($scope.development.location);
			});
		}

		// Sets the map on all markers in the array.
		function setMapOnAll(map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}

		// Removes the markers from the map, but keeps them in the array.
		function clearMarkers() {
			setMapOnAll(null);
		}

		// Shows any markers currently in the array.
		function showMarkers() {
			setMapOnAll(map);
		}

		// Deletes all markers in the array by removing references to them.
		function deleteMarkers() {
			clearMarkers();
			markers = [];
		}

		/*Map ends*/
		/*address search starts*/
		//$scope.searchAddress = { address: '', latitude: '', longitude: '',landmark:'' };
		$scope.searchOptions = null;
		$scope.searchResultDetails = '';
		$scope.searchOptions = {
			types: ['(address)'],
			componentRestrictions: { country: 'IN' }
		}
		$scope.$watch('vm.shop.address.components.location.lat', function (searchAddress) {
			if (searchAddress) {
				$scope.center = [vm.shop.address.components.location.lat, vm.shop.address.components.location.long];
				$scope.location.H = vm.shop.address.components.location.lat;
				$scope.location.L = vm.shop.address.components.location.long;
				addMarker(new google.maps.LatLng($scope.location.H, $scope.location.L))
			}
		});
		/*address search ends*/
	}


	angular.module('shops')
		.controller('ShopsCreateModalController', ShopsCreateModalController);

	ShopsCreateModalController.$inject = ['$scope', 'Authentication', 'ShopsService', '$uibModalInstance', 'ParentScope'];
	function ShopsCreateModalController($scope, Authentication, ShopsService, $uibModalInstance, ParentScope) {

		$scope.shop = new ShopsService({
			name: this.name
		});
		$scope.headerText = 'New Shop';
		if (ParentScope.vm.selectedShop) {
			$scope.headerText = 'Edit Shop';
			$scope.shop = angular.copy(ParentScope.vm.selectedShop);
		}
		$scope.isBaseVersionTemp = $scope.shop.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.shops, function (value, key) {
				if ($scope.shop._id !== value._id && value.name.trim() === $scope.shop.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This shop already exist.';
				return;
			}
			$uibModalInstance.close($scope.shop);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedShopChanged = function (selectedShop) {
			if (selectedShop) {
				$scope.shop.name = selectedShop.originalObject.name;
			} else {
				$scope.shop.name = '';
			}
		};

	}


	angular.module('shops')
		.controller('ShopsDeleteModalController', ShopsDeleteModalController);
	ShopsDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function ShopsDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedShop);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
