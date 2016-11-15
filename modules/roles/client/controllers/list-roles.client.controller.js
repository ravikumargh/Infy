(function () {
	'use strict';

	angular
		.module('roles')
		.controller('RolesAdminListController', RolesAdminListController);

	RolesAdminListController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication',   'RolesService', 'Notification'];

	function RolesAdminListController($scope, $state, $log, $uibModal, Authentication,   RolesService, Notification) {
		var vm = this;

		// vm.role = role;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.roles = RolesService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.roles) {
					if (vm.roles[i] === item) {
						vm.roles.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Role deleted successfully!' });
			});
		}

		function save(item) {
			var role = new RolesService({
				_id: item._id,
				name: item.name,
				description: item.description
			});

			// Create a new role, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (role._id) {
					for (var i in vm.roles) {
						if (vm.roles[i]._id === role._id) {
							vm.roles[i] = role;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Role updated successfully!' });
					role = null;
				} else {
					vm.roles.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Role saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Role save error!' });
			}
		}

		$scope.openAddRoleModal = function (item) {
			vm.selectedRole = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/roles/client/views/create-role.client.view.html',
				controller: 'RolesCreateModalController',
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
		$scope.openDeleteRoleModal = function (item) {
			vm.selectedRole = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/roles/client/views/delete-role.client.view.html',
				controller: 'RolesDeleteModalController',
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
			$scope.selectedRole = item;
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


	angular.module('roles')
		.controller('RolesCreateModalController', RolesCreateModalController);

	RolesCreateModalController.$inject = ['$scope', 'Authentication', 'RolesService', '$uibModalInstance', 'ParentScope'];
	function RolesCreateModalController($scope, Authentication, RolesService, $uibModalInstance, ParentScope) {

		$scope.role = new RolesService({
			name: this.name
		});
		$scope.headerText = 'New Role';
		if (ParentScope.vm.selectedRole) {
			$scope.headerText = 'Edit Role';
			$scope.role = angular.copy(ParentScope.vm.selectedRole);
		}
		$scope.isBaseVersionTemp = $scope.role.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.roles, function (value, key) {
				if ($scope.role._id !== value._id && value.name.trim() === $scope.role.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This role already exist.';
				return;
			}
			$uibModalInstance.close($scope.role);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedRoleChanged = function (selectedRole) {
			if (selectedRole) {
				$scope.role.name = selectedRole.originalObject.name;
			} else {
				$scope.role.name = '';
			}
		};

	}


	angular.module('roles')
		.controller('RolesDeleteModalController', RolesDeleteModalController);
	RolesDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function RolesDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedRole);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
