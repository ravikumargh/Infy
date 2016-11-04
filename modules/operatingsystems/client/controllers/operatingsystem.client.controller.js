(function () {
	'use strict';

	angular
		.module('operatingsystems')
		.controller('OperatingSystemsController', OperatingSystemsController);

	OperatingSystemsController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication', 'operatingsystemResolve', 'OperatingSystemsService', 'SupportedOperatingSystemsService', 'Notification'];

	function OperatingSystemsController($scope, $state, $log, $uibModal, Authentication, operatingsystem, OperatingSystemsService, SupportedOperatingSystemsService, Notification) {
		var vm = this;

		vm.operatingsystem = operatingsystem;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.operatingsystems = OperatingSystemsService.query();
			vm.supportedOperatingSystems = SupportedOperatingSystemsService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.operatingsystems) {
					if (vm.operatingsystems[i] === item) {
						vm.operatingsystems.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> OperatingSystem deleted successfully!' });
			});
		}

		function save(item) {
			var operatingsystem = new OperatingSystemsService({
				_id: item._id,
				name: item.name,
				version: item.version,
				type: item.type
			});

			// Create a new operatingsystem, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (operatingsystem._id) {
					for (var i in vm.operatingsystems) {
						if (vm.operatingsystems[i]._id === operatingsystem._id) {
							vm.operatingsystems[i] = operatingsystem;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Operating System updated successfully!' });
					operatingsystem = null;
				} else {
					vm.operatingsystems.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Operating System saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> OperatingSystem save error!' });
			}
		}

		$scope.openAddOperatingSystemModal = function (item) {
			vm.selectedOperatingSystem = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/operatingsystems/client/views/create-operatingsystem.client.view.html',
				controller: 'OperatingSystemsCreateModalController',
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
		$scope.openDeleteOperatingSystemModal = function (item) {
			vm.selectedOperatingSystem = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/operatingsystems/client/views/delete-operatingsystem.client.view.html',
				controller: 'OperatingSystemsDeleteModalController',
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

	}


	angular.module('operatingsystems')
		.controller('OperatingSystemsCreateModalController', OperatingSystemsCreateModalController);

	OperatingSystemsCreateModalController.$inject = ['$scope', 'Authentication', 'OperatingSystemsService', '$uibModalInstance', 'ParentScope'];
	function OperatingSystemsCreateModalController($scope, Authentication, OperatingSystemsService, $uibModalInstance, ParentScope) {

		$scope.operatingsystem = new OperatingSystemsService({
			name: this.name,
			version: this.version,
			type: 'desktop'
		});
		$scope.supportedOperatingSystems = ParentScope.vm.supportedOperatingSystems;
		if (ParentScope.vm.selectedOperatingSystem) {
			$scope.initialValue = window._.find(ParentScope.vm.supportedOperatingSystems, { 'name': ParentScope.vm.selectedOperatingSystem.name });
		}

		$scope.headerText = 'New Operating System';
		if (ParentScope.vm.selectedOperatingSystem) {
			$scope.headerText = 'Edit Operating System';
			$scope.operatingsystem = angular.copy(ParentScope.vm.selectedOperatingSystem);
		}

		$scope.create = function () {
			var found = false;
			this.error = '';
			if (!$scope.operatingsystem.version && $scope.operatingsystem.isBaseVersion) {
				$scope.error = 'Please remove the base version.';
				$scope.isBaseVersionTemp = $scope.operatingsystem.isBaseVersion;
				return;
			}
			angular.forEach(ParentScope.vm.operatingsystems, function (value, key) {
				if ($scope.operatingsystem._id !== value._id && value.name.trim() === $scope.operatingsystem.name.trim() && value.version === $scope.operatingsystem.version) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This operatingsystem already exist.';
				return;
			}
			$uibModalInstance.close($scope.operatingsystem);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedOperatingSystemChanged = function (selectedOperatingSystem) {
			if (selectedOperatingSystem) {
				$scope.operatingsystem.name = selectedOperatingSystem.originalObject.name;
			} else {
				$scope.operatingsystem.name = '';
			}
		};

	}


	angular.module('operatingsystems')
		.controller('OperatingSystemsDeleteModalController', OperatingSystemsDeleteModalController);
	OperatingSystemsDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function OperatingSystemsDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedOperatingSystem);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
