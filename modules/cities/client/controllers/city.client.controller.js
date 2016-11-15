(function () {
	'use strict';

	angular
		.module('cities')
		.controller('CitiesController', CitiesController);

	CitiesController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication',   'CitiesService', 'Notification'];

	function CitiesController($scope, $state, $log, $uibModal, Authentication,   CitiesService, Notification) {
		var vm = this;

		// vm.city = city;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		vm.options = {
			types: ['(cities)'],
			componentRestrictions: { country: 'IN' }
		};
		vm.citys = [];

		vm.newcity = {
			'placeid': '',
			'name': '',
			'location': { latitude: '', longitude: '' }
		}

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.cities = CitiesService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.cities) {
					if (vm.cities[i] === item) {
						vm.cities.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> City deleted successfully!' });
			});
		}

		function save(item) {
			var city = new CitiesService({
				_id: item._id,
				name: item.name,
				version: item.version,
				isBaseVersion: item.isBaseVersion
			});

			// Create a new city, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (city._id) {
					for (var i in vm.cities) {
						if (vm.cities[i]._id === city._id) {
							vm.cities[i] = city;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> City updated successfully!' });
					city = null;
				} else {
					vm.cities.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> City saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> City save error!' });
			}
		}

		$scope.openAddCityModal = function (item) {
			vm.selectedCity = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/cities/client/views/create-city.client.view.html',
				controller: 'CitiesCreateModalController',
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
		$scope.openDeleteCityModal = function (item) {
			vm.selectedCity = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/cities/client/views/delete-city.client.view.html',
				controller: 'CitiesDeleteModalController',
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
			$scope.selectedCity = item;
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
	}


	angular.module('cities')
		.controller('CitiesCreateModalController', CitiesCreateModalController);

	CitiesCreateModalController.$inject = ['$scope', 'Authentication', 'CitiesService', '$uibModalInstance', 'ParentScope'];
	function CitiesCreateModalController($scope, Authentication, CitiesService, $uibModalInstance, ParentScope) {
$scope.options = {
			types: ['(cities)'],
			componentRestrictions: { country: 'IN' }
		};
		$scope.citys = [];

		$scope.city = new CitiesService({
			'placeid': '',
			'name': '',
			'location': { latitude: '', longitude: '' }
		})

		 
		$scope.headerText = 'New City';
		if (ParentScope.vm.selectedCity) {
			$scope.headerText = 'Edit City';
			$scope.city = angular.copy(ParentScope.vm.selectedCity);
		}
		$scope.isBaseVersionTemp = $scope.city.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.cities, function (value, key) {
				if ($scope.city._id !== value._id && value.name.trim() === $scope.city.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This city already exist.';
				return;
			}
			$uibModalInstance.close($scope.city);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedCityChanged = function (selectedCity) {
			if (selectedCity) {
				$scope.city.name = selectedCity.originalObject.name;
			} else {
				$scope.city.name = '';
			}
		};

	}


	angular.module('cities')
		.controller('CitiesDeleteModalController', CitiesDeleteModalController);
	CitiesDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function CitiesDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedCity);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
