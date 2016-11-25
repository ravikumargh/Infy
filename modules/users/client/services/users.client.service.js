(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      }
    });

    return Users;
  }







  // TODO this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);
  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    var Users = $resource('/api/users/:userId', {
      userId: '@_id',
      shopId: '@shop',
      outletId: '@outlet'
    }, {
        update: {
          method: 'PUT'
        },
        shopUsers: {
          method: 'GET',
          url: '/api/users/shop/:shopId', isArray: true
        },
        shopOutletUsers: {
          method: 'GET',
          url: '/api/users/outlet/:outletId', isArray: true
        }
      }
    );

    angular.extend(Users, {
      getShopUsers: function (shopId, shopUsers) {
        return this.shopUsers({
          shopId: shopId // api expects token as a parameter (i.e. /:token)
        }, shopUsers).$promise;
      },
      getShopOutletUsers: function (outletId, shopOutletUsers) {
        return this.shopOutletUsers({
          outletId: outletId // api expects token as a parameter (i.e. /:token)
        }, shopOutletUsers)
      }
    });

    return Users;
  }
} ());
