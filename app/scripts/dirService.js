'use strict';

dirApp.factory('dirService', ['$q', '$resource', '$location', 'dirlistConfig', function ($q, $resource, $location, dirlistConfig) {
    return $resource(dirlistConfig.backendUrl + 'list', {}, {
        query: {
            method: 'GET',
            responseType: 'json',
            isArray: true,
            transformResponse: function (response) {
                response.forEach(function (obj) {
                    var normalizedPath = obj.path.charAt(obj.path.length - 1) === '/' ?
                        obj.path.substring(0, obj.path.length - 1) : obj.path;

                    obj.name = normalizedPath.replace(/^.*[\\\/]/, '');
                    obj.dlUrl = dirlistConfig.backendUrl + 'dl/' + normalizedPath;
                });

                return response;
            }
        }
    });
}]);