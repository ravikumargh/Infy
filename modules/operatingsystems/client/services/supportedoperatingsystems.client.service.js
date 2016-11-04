(function () {
    'use strict';

    angular
        .module('supportedoperatingsystems.services')
        .factory('SupportedOperatingSystemsService', SupportedOperatingSystemsService);

    SupportedOperatingSystemsService.$inject = ['$resource', '$log'];

    function SupportedOperatingSystemsService($resource, $log) {
        var SupportedOperatingSystem = $resource('/api/supportedoperatingsystems/:supportedoperatingsystemId', {
            supportedoperatingsystemId: '@_id'
        }, {
                update: {
                    method: 'PUT'
                }
            });

        return SupportedOperatingSystem;
    }
} ());
