(function () {
    'use strict';

    angular
        .module('supportedbrowsers.services')
        .factory('SupportedBrowsersService', SupportedBrowsersService);

    SupportedBrowsersService.$inject = ['$resource', '$log'];

    function SupportedBrowsersService($resource, $log) {
        var SupportedBrowser = $resource('/api/supportedbrowsers/:supportedbrowserId', {
            supportedbrowserId: '@_id'
        }, {
                update: {
                    method: 'PUT'
                }
            });

        return SupportedBrowser;
    }
} ());
