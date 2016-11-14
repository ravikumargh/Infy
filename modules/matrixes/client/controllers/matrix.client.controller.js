(function () {
  'use strict';

  angular
    .module('matrixes')
    .controller('MatrixesController', MatrixesController);

  MatrixesController.$inject = ['$scope', '$state', '$stateParams', '$log', '$uibModal', 'Authentication', 'CitiesService', 'Notification', 'OperatingSystemsService', 'BrowsersService', 'MatrixResource' ,'PublishedMatrixResource'];

  function MatrixesController($scope, $state, $stateParams, $log, $uibModal, Authentication, CitiesService, Notification, OperatingSystemsService, BrowsersService, MatrixResource, PublishedMatrixResource) {
    var vm = this;

    vm.authentication = Authentication;
    vm.oss = [];
    vm.browsers = [];
    vm.categories = [];
    vm.desktopMatrix = [];
    vm.mobileMatrix = [];

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      vm.categories = CitiesService.query();
      vm.oss = OperatingSystemsService.query();
      vm.browsers = BrowsersService.query();

      vm.categories.$promise.then(function (categories) {
        var categoryId = $stateParams.categoryId;
        categories.forEach(function (item) {
          if (item._id === categoryId) {
            vm.selectedCategory = item;
            findOne();
          }
        });
      });

      vm.oss.$promise.then(function (oss) {
        oss.forEach(function (os) {
          if (os.version) {
            os.displayName = os.name + ' ' + os.version;
          } else {
            os.displayName = os.name;
          }
        }, this);

      });

      vm.browsers.$promise.then(function (browsers) {
        browsers.forEach(function (browser) {

          if (browser.version && browser.isBaseVersion) {
            browser.displayName = browser.name + ' ' + browser.version + ' +';
          } else if (browser.version) {
            browser.displayName = browser.name + ' ' + browser.version;
          } else {
            browser.displayName = browser.name;
          }
        }, this);

      });
    }

    /** */
    var findOne = function () {
      if (!vm.selectedCategory) {
        vm.desktopMatrix = [];
        vm.mobileMatrix = [];
        return;
      }
      vm.categoryMatrix = MatrixResource.get({
        categoryId: vm.selectedCategory._id
      }, function () {
        debugger;
      });
      vm.categoryMatrix.$promise.then(function (pm) {
        if (pm.desktopMatrix) {
          if (vm.authentication.user.roles.indexOf('admin') != -1) {
            pm.desktopMatrix.forEach(function (item) {
              item.os = item.os._id;
              item.browsers.forEach(function (b) {
                b.browser = b.browser._id;
              });
            });
            pm.mobileMatrix.forEach(function (item) {
              item.os = item.os._id;
              item.browsers.forEach(function (b) {
                if (b.browser) {
                  b.browser = b.browser._id;
                }
              });
            });
          }
          vm.desktopMatrix = pm.desktopMatrix;
          vm.mobileMatrix = pm.mobileMatrix;
          vm.categoryMatrixToPublish = angular.copy(pm);
        } else {
          vm.desktopMatrix = [];
          vm.mobileMatrix = [];
        }
      });
    };



    vm.addNewOS = function () {
      var newRow = null;
      if (vm.desktopMatrix.length) {
        newRow = angular.copy(vm.desktopMatrix[0]);
        newRow.os = '';
        newRow.browsers.forEach(function (item) {
          item.isSupported = false;
        }, this);
      } else {
        newRow = { 'os': '', 'browsers': [] };
      }
      vm.desktopMatrix.push(angular.copy(newRow));
    };
    vm.addNewBrowser = function () {
      var newColumn = null;
      newColumn = { 'browser': '', 'isSupported': false };
      vm.desktopMatrix.forEach(function (item) {
        item.browsers.push(angular.copy(newColumn));
      }, this);
    };

    vm.addNewOSMobileMatrix = function () {
      var newRow = null;
      if (vm.mobileMatrix.length) {
        newRow = angular.copy(vm.mobileMatrix[0]);
        newRow.os = '';
        newRow.browsers.forEach(function (item) {
          item.isSupported = false;
        }, this);
      } else {
        newRow = { 'os': '', 'browsers': [] };
      }
      vm.mobileMatrix.push(angular.copy(newRow));
    };

    vm.addNewBrowserMobileMatrix = function () {
      var newColumn = null;

      newColumn = { 'browser': '', 'isSupported': false };
      vm.mobileMatrix.forEach(function (item) {
        item.browsers.push(angular.copy(newColumn));
      }, this);
    };

    vm.removeOS = function (item) {
      var index = vm.desktopMatrix.indexOf(item);
      vm.desktopMatrix.splice(index, 1);
    };
    vm.removeBrowser = function (item, index) {
      vm.desktopMatrix.forEach(function (os) {
        os.browsers.splice(index, 1);
      }, this);
    };

    vm.removeOSMobileMatrix = function (item) {
      var index = vm.mobileMatrix.indexOf(item);
      vm.mobileMatrix.splice(index, 1);
    };
    vm.removeBrowserMobileMatrix = function (item, index) {
      vm.mobileMatrix.forEach(function (os) {
        os.browsers.splice(index, 1);
      }, this);
    };

    /** update browser to desktop matrix */
    vm.updateBrowser = function (browser, index) {
      var selectedBrowser = null;
      vm.browsers.forEach(function (item) {
        if (item._id === browser.mb.browser) {
          selectedBrowser = item;
        }
      });
      vm.desktopMatrix.forEach(function (os) {
        if (selectedBrowser) {
          os.browsers[index].browser = selectedBrowser._id;
        } else {
          os.browsers[index].browser = '';
        }
      });
    };
    /** update browser to mobile matrix */
    vm.updateBrowserMobileMatrix = function (browser, index) {
      var selectedBrowser = null;
      vm.browsers.forEach(function (item) {
        if (item._id === browser.mb.browser) {
          selectedBrowser = item;
        }
      });
      vm.mobileMatrix.forEach(function (os) {
        if (selectedBrowser) {
          os.browsers[index].browser = selectedBrowser._id;
        } else {
          os.browsers[index].browser = '';
        }
      });
    };
    /***/
    vm.onChangeCategory = function (matrixForm) {
      matrixForm.$setPristine();
      matrixForm.$setUntouched();
      vm.findOne();
    };
    /** */
    vm.create = function (matrixForm) {
      var categoryMatrix = new MatrixResource({
        category: vm.selectedCategory._id,
        desktopMatrix: vm.desktopMatrix,
        mobileMatrix: vm.mobileMatrix
      });
      var error = validateMatrix(matrixForm, categoryMatrix);
      if (error) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' + error });
        return;
      }

      if (vm.categoryMatrix._id) {
        categoryMatrix.$update(function (response) {
          vm.categoryMatrix = response;
          vm.categoryMatrixToPublish = angular.copy(response);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Matrix updated successfully.' });
        }, function (errorResponse) {
          vm.error = errorResponse.data.message;
        });
      } else {
        categoryMatrix.$save(function (response) {
          vm.categoryMatrix = response;
          vm.categoryMatrixToPublish = angular.copy(response);
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Matrix created successfully.' });
          vm.selectedCategory.isMatrixAvailable = true;
          vm.selectedCategory.matrix = response._id;
          vm.selectedCategory.$update(function (response) {

          }, function (errorResponse) {
            vm.error = errorResponse.data.message;
          });

        }, function (errorResponse) {
          vm.error = errorResponse.data.message;
        });
      }
    };

    var validateMatrix = function (matrixForm, categoryMatrix) {
      var error = '',
        uniqBrowsers,
        uniqOSs;
      if (!matrixForm.$valid) {
        error = error + 'Error : Matrix is invalid!';
        return error;
      }

      if (categoryMatrix.desktopMatrix.length || categoryMatrix.mobileMatrix.length) {
        if ((categoryMatrix.desktopMatrix.length && !categoryMatrix.desktopMatrix[0].browsers.length) || (categoryMatrix.mobileMatrix.length && !categoryMatrix.mobileMatrix[0].browsers.length)) {
          error = error + 'Sorry, Matrix should contains at least an operating system and a browser.<br/>';
        }
        if (categoryMatrix.desktopMatrix.length) {
          uniqBrowsers = window._.uniq(window._.map(categoryMatrix.desktopMatrix[0].browsers, 'browser'));
          uniqOSs = window._.uniq(window._.map(categoryMatrix.desktopMatrix, 'os'));
          if (categoryMatrix.desktopMatrix.length && categoryMatrix.desktopMatrix[0].browsers.length !== uniqBrowsers.length && categoryMatrix.desktopMatrix.length !== uniqOSs.length) {
            error = error + 'Desktop matrix contains duplicate operating system and browser entries.<br/>';
          } else if (categoryMatrix.desktopMatrix.length && categoryMatrix.desktopMatrix[0].browsers.length !== uniqBrowsers.length) {
            error = error + 'Desktop matrix contains duplicate browser entries.<br/>';
          } else if (categoryMatrix.desktopMatrix.length !== uniqOSs.length) {
            error = error + 'Desktop matrix contains duplicate operating system entries.<br/>';
          }
        }
        if (categoryMatrix.mobileMatrix.length) {
          uniqBrowsers = window._.uniq(window._.map(categoryMatrix.mobileMatrix[0].browsers, 'browser'));
          uniqOSs = window._.uniq(window._.map(categoryMatrix.mobileMatrix, 'os'));
          if (categoryMatrix.mobileMatrix.length && categoryMatrix.mobileMatrix[0].browsers.length !== uniqBrowsers.length && categoryMatrix.mobileMatrix.length !== uniqOSs.length) {
            error = error + 'Mobile matrix contains duplicate operating system and browser entries.<br/>';
          } else if (categoryMatrix.mobileMatrix.length && categoryMatrix.mobileMatrix[0].browsers.length !== uniqBrowsers.length) {
            error = error + 'Mobile matrix contains duplicate browser entries.<br/>';
          } else if (categoryMatrix.mobileMatrix.length !== uniqOSs.length) {
            error = error + 'Mobile matrix contains duplicate operating system entries.<br/>';
          }
        }

      } else {
        error = error + 'Matrix should contains atleast one operating system with browser.<br/>';
      }
      return error;
    };

    /**Delete matrix */
    vm.remove = function (matrix) {
      if (matrix) {
        var m = Matrixes.get({
          matrixId: matrix._id
        });
        m.$promise.then(function (pm) {
          pm.$remove();
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Matrix deleted successfully.' });

          vm.desktopMatrix = [];
          vm.mobileMatrix = [];

          vm.selectedCategory.isMatrixAvailable = false;
          vm.selectedCategory.$update(function (response) {
            vm.categories.forEach(function (item) {
              if (item._id === vm.selectedCategory._id) {
                item.isMatrixAvailable = false;
              }
            });
            vm.selectedCategory = null;
          }, function (errorResponse) {
            vm.error = errorResponse.data.message;
          });
        });
      }
    };
    vm.publishMatrix = function () {
      var publishedMatrix = new PublishedMatrixResource({
        category: {},
        matrix: []
      });

      if (vm.categoryMatrixToPublish.category._id) {
        publishedMatrix.category = vm.categoryMatrixToPublish.category._id;
      } else {
        publishedMatrix.category = vm.categoryMatrixToPublish.category;
      }

      publishedMatrix.desktopMatrix = [];
      publishedMatrix.mobileMatrix = [];
      setDeviceMatrix(this, vm.categoryMatrixToPublish.desktopMatrix, publishedMatrix.desktopMatrix);
      setDeviceMatrix(this, vm.categoryMatrixToPublish.mobileMatrix, publishedMatrix.mobileMatrix);

      publishedMatrix.$save(function (response) {
        //vm.categoryMatrix = response;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Matrix published successfully.' });
        var selectedCategory = angular.copy(vm.selectedCategory);
        delete selectedCategory.matrix;
        vm.selectedCategory.publishedMatrix = { '_id': response._id, 'created': response.created };
        selectedCategory.publishedMatrix = response._id;
        selectedCategory.$update(function (response) {

        }, function (errorResponse) {
          vm.error = errorResponse.data.message;
        });

      }, function (errorResponse) {
        vm.error = errorResponse.data.message;
      });
    };
    var setDeviceMatrix = function (scope, deviceMatrix, publishedDeviceMatrix) {
      var os = {}, browser = {},
        oss = scope.oss,
        browsers = scope.browsers,
        tempOs, tempBrowser;
      deviceMatrix.forEach(function (item) {
        os = {};
        tempOs = {};
        tempOs = window._.find(oss, { '_id': item.os });
        os._id = tempOs._id;
        os.name = tempOs.name;
        os.version = tempOs.version;
        os.browsers = [];
        item.browsers.forEach(function (b) {
          browser = {};
          tempBrowser = {};

          tempBrowser = window._.find(browsers, { '_id': b.browser });
          browser._id = tempBrowser._id;
          browser.name = tempBrowser.name;
          browser.version = tempBrowser.version;
          browser.isBaseVersion = tempBrowser.isBaseVersion;
          browser.isSupported = b.isSupported;
          os.browsers.push(browser);
        });
        publishedDeviceMatrix.push(os);
      });
    };


    /**Open Delete matrix modal popup */
    vm.openDeleteMatrixModal = function () {
      vm.confirmMessage = 'Are you sure you want to delete this matrix?';
      vm.heading = 'Delete Matrix';

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        templateUrl: 'modules/matrixes/views/confirmation-matrix.client.view.html',
        controller: 'MatrixConfirmationModalController',
        resolve: {
          ParentScope: function () {
            return $scope;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        vm.remove(selectedItem);
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    /**Open publish matrix modal popup */
    vm.openPublishMatrixModal = function () {
      vm.confirmMessage = 'Are you sure you want to publish this matrix?';
      vm.heading = 'Publish Matrix';

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        templateUrl: '/modules/matrixes/client/views/confirmation-matrix.client.view.html',
        controller: 'PublishMatrixConfirmationModalController',
        resolve: {
          ParentScope: function () {
            return $scope;
          }
        }
      });
      modalInstance.result.then(function () {
        vm.publishMatrix();
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
    };
    /**Open preview JSON modal popup */
    vm.openViewJsonModal = function () {
      //window.open('http://e2e-comms-dev.pearson.com/osbrowserchecker/dev/data/'+vm.selectedCategory.name+'.json','_blank');			
      vm.heading = 'View JSON';

      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        templateUrl: '/modules/matrixes/client/views/view-JSON.client.view.html',
        controller: 'ViewJsonModalController',
        size: 'lg',
        resolve: {
          ParentScope: function () {
            return $scope;
          }
        }
      });
      modalInstance.result.then(function () {
        vm.publishMatrix();
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }

  angular.module('matrixes')
    .controller('PublishMatrixConfirmationModalController', PublishMatrixConfirmationModalController);
  PublishMatrixConfirmationModalController.$inject = ['$scope', 'Authentication', '$uibModalInstance', 'ParentScope'];

  function PublishMatrixConfirmationModalController($scope, Authentication, $uibModalInstance, ParentScope) {
    var vm = this;

    $scope.message = ParentScope.vm.confirmMessage;
    $scope.heading = ParentScope.vm.heading;
    $scope.create = function () {
      $uibModalInstance.close(ParentScope.vm.categoryMatrix);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('matrixes')
    .controller('ViewJsonModalController', ViewJsonModalController);
  ViewJsonModalController.$inject = ['$scope', '$http','Authentication', '$uibModalInstance', 'ParentScope'];

  function ViewJsonModalController($scope, $http, Authentication, $uibModalInstance, ParentScope) {
    var vm = this;
			$http({
			method: 'GET',
			url: 'http://e2e-comms-dev.pearson.com/osbrowserchecker/dev/data/'+ParentScope.vm.selectedCategory.name+'.json'
			}).then(function successCallback(response) {
				 
				$scope.jsonData=response.data;
				
				$scope.isUpdatedJson=true;
				if(ParentScope.vm.selectedCategory.publishedMatrix.created !== response.data.publishedOn){
					$scope.isUpdatedJson=false;
					$scope.message='Matrix has been published recently for this category, please wait for a while to get an updated JSON.';
				}
				// this callback will be called asynchronously
				// when the response is available
			}, function errorCallback(response) {
				$scope.isUpdatedJson=false;
				$scope.message='Matrix has been published recently for this category, please wait for a while to get an updated JSON.';
			});

			$scope.heading = ParentScope.vm.heading;
			$scope.create = function () {
				$uibModalInstance.close(ParentScope.vm.categoryMatrix);
			};
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
  }

} ());
