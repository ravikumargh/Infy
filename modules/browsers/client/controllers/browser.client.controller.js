(function () {
	'use strict';

	angular
		.module('browsers')
		.controller('BrowsersController', BrowsersController);

	BrowsersController.$inject = ['$scope', '$state', '$log', '$uibModal', 'Authentication', 'browserResolve', 'BrowsersService', 'SupportedBrowsersService', 'Notification'];

	function BrowsersController($scope, $state, $log, $uibModal, Authentication, browser, BrowsersService, SupportedBrowsersService, Notification) {
		var vm = this;

		vm.browser = browser;
		vm.authentication = Authentication;
		vm.remove = remove;
		vm.save = save;

		init();

		function init() {
			// If user is not signed in then redirect back home
			if (!Authentication.user) {
				$state.go('home');
			}
			vm.browsers = BrowsersService.query();
			vm.supportedBrowsers = SupportedBrowsersService.query();
		}

		// Remove existing Article
		function remove(item) {
			item.$remove(function () {
				for (var i in vm.browsers) {
					if (vm.browsers[i] === item) {
						vm.browsers.splice(i, 1);
					}
				}
				Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Browser deleted successfully!' });
			});
		}

		function save(item) {
			var browser = new BrowsersService({
				_id: item._id,
				name: item.name,
				version: item.version,
				isBaseVersion: item.isBaseVersion
			});

			// Create a new browser, or update the current instance
			item.createOrUpdate()
				.then(successCallback)
				.catch(errorCallback);

			function successCallback(res) {
				if (browser._id) {
					for (var i in vm.browsers) {
						if (vm.browsers[i]._id === browser._id) {
							vm.browsers[i] = browser;
							break;
						}
					}
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Browser updated successfully!' });
					browser = null;
				} else {
					vm.browsers.unshift(res);
					Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Browser saved successfully!' });
				}
			}

			function errorCallback(res) {
				Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Browser save error!' });
			}
		}

		$scope.openAddBrowserModal = function (item) {
			vm.selectedBrowser = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/browsers/client/views/create-browser.client.view.html',
				controller: 'BrowsersCreateModalController',
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
		$scope.openDeleteBrowserModal = function (item) {
			vm.selectedBrowser = item;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/browsers/client/views/delete-browser.client.view.html',
				controller: 'BrowsersDeleteModalController',
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


	angular.module('browsers')
		.controller('BrowsersCreateModalController', BrowsersCreateModalController);

	BrowsersCreateModalController.$inject = ['$scope', 'Authentication', 'BrowsersService', '$uibModalInstance', 'ParentScope'];
	function BrowsersCreateModalController($scope, Authentication, BrowsersService, $uibModalInstance, ParentScope) {

		$scope.browser = new BrowsersService({
			name: this.name,
			version: this.version,
			isBaseVersion: this.isBaseVersion
		});
		$scope.supportedBrowsers = ParentScope.vm.supportedBrowsers;
		if (ParentScope.vm.selectedBrowser) {
			$scope.initialValue = window._.find(ParentScope.vm.supportedBrowsers, { 'name': ParentScope.vm.selectedBrowser.name });
		}

		$scope.headerText = 'New Browser';
		if (ParentScope.vm.selectedBrowser) {
			$scope.headerText = 'Edit Browser';
			$scope.browser = angular.copy(ParentScope.vm.selectedBrowser);
		}
		$scope.isBaseVersionTemp = $scope.browser.isBaseVersion;
		$scope.$watch(
			'browser.version',
			function handleFooChange(newValue, oldValue) {
				if (!newValue) {
					$scope.browser.isBaseVersion = false;
				} else {
					$scope.browser.isBaseVersion = $scope.isBaseVersionTemp;
				}
			}
		);

		$scope.create = function () {
			var found = false;
			this.error = '';
			if (!$scope.browser.version && $scope.browser.isBaseVersion) {
				$scope.error = 'Please remove the base version.';
				$scope.isBaseVersionTemp = $scope.browser.isBaseVersion;
				return;
			}
			angular.forEach(ParentScope.vm.browsers, function (value, key) {
				if ($scope.browser._id !== value._id && value.name.trim() === $scope.browser.name.trim() && value.version === $scope.browser.version) {
					found = true;
					return;
				}
			});
			if (found) {
				$scope.error = 'This browser already exist.';
				return;
			}
			$uibModalInstance.close($scope.browser);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

		$scope.selectedBrowserChanged = function (selectedBrowser) {
			if (selectedBrowser) {
				$scope.browser.name = selectedBrowser.originalObject.name;
			} else {
				$scope.browser.name = '';
			}
		};

	}


	angular.module('browsers')
		.controller('BrowsersDeleteModalController', BrowsersDeleteModalController);
	BrowsersDeleteModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

	function BrowsersDeleteModalController($scope, Authentication, $uibModalInstance, ParentScope) {
		var vm = this;
		$scope.create = function () {
			$uibModalInstance.close(ParentScope.vm.selectedBrowser);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

} ());
