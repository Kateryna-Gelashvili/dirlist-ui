'use strict';

dirApp.controller('dirController',
    ['$q', '$http', '$scope', '$location', '$window', 'dirService', 'dirlistConfig',
        function ($q, $http, $scope, $location, $window, dirService, dirlistConfig) {
            var self = this;
            $scope.fetchAllFiles = function () {
                self.files = dirService.query();
            };

            $scope.fetchAllFiles();

            $scope.extract = function (path) {
                $http.post(dirlistConfig.backendUrl + 'extract', {path : path}).success(function () {
                    $scope.fetchAllFiles();
                });
            };
        }
    ]
);