(function () {
	'use strict';

	angular
		.module('departments')
		.controller('DepartmentsController', DepartmentsController);

	DepartmentsController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication',  'DepartmentsService', 'Notification'];

	function DepartmentsController($scope, $state, $log, $uibModal, Authentication,  DepartmentsService, Notification) {
		var vm = this;

		//vm.department = department;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.departments = DepartmentsService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.departments) {
					if (vm.departments[i] === item) {
						vm.departments.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department deleted successfully!' });
			});
		}

		function save(item) {
			var department = new DepartmentsService({
				_id: item._id,
				name: item.name,
				description: item.description
			});

			// Create a new department, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (department._id) {
					for (var i in vm.departments) {
						if (vm.departments[i]._id === department._id) {
							vm.departments[i] = department;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department updated successfully!' });
					department = null;
				} else {
					vm.departments.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Department save error!' });
			}
		}

		$scope.openAddDepartmentModal = function (item) {
			vm.selectedDepartment = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/departments/client/views/create-department.client.view.html',
				controller: 'DepartmentsCreateModalController',
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
		$scope.openDeleteDepartmentModal = function (item) {
			vm.selectedDepartment = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/departments/client/views/delete-department.client.view.html',
				controller: 'DepartmentsDeleteModalController',
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
			$scope.selectedDepartment = item;
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


	angular.module('departments')
		.controller('DepartmentsCreateModalController', DepartmentsCreateModalController);

	DepartmentsCreateModalController.$inject = ['$scope', 'Authentication', 'DepartmentsService', '$uibModalInstance', 'ParentScope'];
	function DepartmentsCreateModalController($scope, Authentication, DepartmentsService, $uibModalInstance, ParentScope) {

		$scope.department = new DepartmentsService({
			name: this.name
		});
		$scope.headerText = 'New Department';
		if (ParentScope.vm.selectedDepartment) {
			$scope.headerText = 'Edit Department';
			$scope.department = angular.copy(ParentScope.vm.selectedDepartment);
		}
		$scope.isBaseVersionTemp = $scope.department.isBaseVersion;

		$scope.create = function () {
			var found = false;
			this.error = '';

			angular.forEach(ParentScope.vm.departments, function (value, key) {
				if ($scope.department._id !== value._id && value.name.trim() === $scope.department.name.trim()) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This department already exist.';
				return;
			}
			$uibModalInstance.close($scope.department);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedDepartmentChanged = function (selectedDepartment) {
			if (selectedDepartment) {
				$scope.department.name = selectedDepartment.originalObject.name;
			} else {
				$scope.department.name = '';
			}
		};

	}


	angular.module('departments')
		.controller('DepartmentsDeleteModalController', DepartmentsDeleteModalController);
	DepartmentsDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function DepartmentsDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedDepartment);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
