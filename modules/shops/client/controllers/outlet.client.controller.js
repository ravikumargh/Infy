(function () {
	'use strict';

	angular
		.module('outlets')
		.controller('OutletsController', OutletsController);

	OutletsController.$inject = ['$scope', '$state', '$stateParams', '$log', '$uibModal', 'Authentication', 'OutletsService', 'CategoriesService', 'Notification'];

	function OutletsController($scope, $state, $stateParams, $log, $uibModal, Authentication, OutletsService, CategoriesService, Notification) {
		var vm = this;

		vm.outlet = new OutletsService;
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
			if ($stateParams.outletId) {
				vm.outlet = OutletsService.get({
					outletId: $stateParams.outletId
				});
			} else {
				vm.outlets = OutletsService.query();
			}
			vm.categories = CategoriesService.query();
		}

		function create(isValid) {
			if (!isValid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.outletForm');

				return false;
			}

			var outlet = vm.outlet;
			if (vm.place) {
				outlet.address.place = vm.place.name;
				outlet.address.phone = vm.place.international_phone_number;
			}
			debugger;

			outlet.shop = $stateParams.shopId;

			outlet.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (outlet._id) {
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Outlet updated successfully!' });
					outlet = null;
				} else {
					vm.departments.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Outlet saved successfully!' });
				}
				$state.go('admin.shop', {
					shopId: $stateParams.shopId
				});
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Outlet save error!' });
			}

		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.outlets) {
					if (vm.outlets[i] === item) {
						vm.outlets.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Outlet deleted successfully!' });
			});
		}

		function save(item) {
			var outlet = new OutletsService({
				_id: item._id,
				name: item.name,
				description: item.description
			});
			// Create a new outlet, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (outlet._id) {
					for (var i in vm.outlets) {
						if (vm.outlets[i]._id === outlet._id) {
							vm.outlets[i] = outlet;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Outlet updated successfully!' });
					outlet = null;
				} else {
					vm.outlets.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Outlet saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Outlet save error!' });
			}
		}

		$scope.openAddOutletModal = function (item) {
			vm.selectedOutlet = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/outlets/client/views/create-outlet.client.view.html',
				controller: 'OutletsCreateModalController',
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
		$scope.openDeleteOutletModal = function (item) {
			vm.selectedOutlet = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/outlets/client/views/delete-outlet.client.view.html',
				controller: 'OutletsDeleteModalController',
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
			$scope.selectedOutlet = item;
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
		$scope.$watch('vm.outlet.address.components.location.lat', function (searchAddress) {
			if (searchAddress) {
				$scope.center = [vm.outlet.address.components.location.lat, vm.outlet.address.components.location.long];
				$scope.location.H = vm.outlet.address.components.location.lat;
				$scope.location.L = vm.outlet.address.components.location.long;
				addMarker(new google.maps.LatLng($scope.location.H, $scope.location.L))
			}
		});
		/*address search ends*/
	}


	angular.module('outlets')
		.controller('OutletsCreateModalController', OutletsCreateModalController);

	OutletsCreateModalController.$inject = ['$scope', 'Authentication', 'OutletsService', '$uibModalInstance', 'ParentScope'];
	function OutletsCreateModalController($scope, Authentication, OutletsService, $uibModalInstance, ParentScope) {

		$scope.outlet = new OutletsService({
			name: this.name
		});
		$scope.headerText = 'New Outlet';
		if (ParentScope.vm.selectedOutlet) {
			$scope.headerText = 'Edit Outlet';
			$scope.outlet = angular.copy(ParentScope.vm.selectedOutlet);
		}
		$scope.isBaseVersionTemp = $scope.outlet.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.outlets, function (value, key) {
				if ($scope.outlet._id !== value._id && value.name.trim() === $scope.outlet.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This outlet already exist.';
				return;
			}
			$uibModalInstance.close($scope.outlet);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedOutletChanged = function (selectedOutlet) {
			if (selectedOutlet) {
				$scope.outlet.name = selectedOutlet.originalObject.name;
			} else {
				$scope.outlet.name = '';
			}
		};

	}


	angular.module('outlets')
		.controller('OutletsDeleteModalController', OutletsDeleteModalController);
	OutletsDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function OutletsDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedOutlet);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
