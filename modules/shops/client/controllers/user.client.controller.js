(function () {
	'use strict';

	angular
		.module('users')
		.controller('UsersController', UsersController);

	UsersController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication',  'UsersService', 'Notification'];

	function UsersController($scope, $state, $log, $uibModal, Authentication,  UsersService, Notification) {
		var vm = this;

		//vm.user = user;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.users = UsersService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.users) {
					if (vm.users[i] === item) {
						vm.users.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
			});
		}

		function save(item) {
			var user = new UsersService({
				_id: item._id,
				name: item.name,
				description: item.description
			});

			// Create a new user, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (user._id) {
					for (var i in vm.users) {
						if (vm.users[i]._id === user._id) {
							vm.users[i] = user;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User updated successfully!' });
					user = null;
				} else {
					vm.users.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User save error!' });
			}
		}

		$scope.openAddUserModal = function (item) {
			vm.selectedUser = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/users/client/views/create-user.client.view.html',
				controller: 'UsersCreateModalController',
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
		$scope.openDeleteUserModal = function (item) {
			vm.selectedUser = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/users/client/views/delete-user.client.view.html',
				controller: 'UsersDeleteModalController',
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
			$scope.selectedUser = item;
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


	angular.module('users')
		.controller('UsersCreateModalController', UsersCreateModalController);

	UsersCreateModalController.$inject = ['$scope', 'Authentication', 'UsersService', '$uibModalInstance', 'ParentScope'];
	function UsersCreateModalController($scope, Authentication, UsersService, $uibModalInstance, ParentScope) {

		$scope.user = new UsersService({
			name: this.name
		});
		$scope.headerText = 'New User';
		if (ParentScope.vm.selectedUser) {
			$scope.headerText = 'Edit User';
			$scope.user = angular.copy(ParentScope.vm.selectedUser);
		}
		$scope.isBaseVersionTemp = $scope.user.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.users, function (value, key) {
				if ($scope.user._id !== value._id && value.name.trim() === $scope.user.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This user already exist.';
				return;
			}
			$uibModalInstance.close($scope.user);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedUserChanged = function (selectedUser) {
			if (selectedUser) {
				$scope.user.name = selectedUser.originalObject.name;
			} else {
				$scope.user.name = '';
			}
		};

	}


	angular.module('users')
		.controller('UsersDeleteModalController', UsersDeleteModalController);
	UsersDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function UsersDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedUser);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
