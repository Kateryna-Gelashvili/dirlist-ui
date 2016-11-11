'use strict';

function loadTree(parentData, childData) {
    // todo combine parent data and child data somehow
    var combinedData;
    if (parentData != null) {
        // $('#tree').treeview('remove');
        // todo do some combine logic
        combinedData = childData;
    } else {
        combinedData = childData;
    }

    $('#tree').treeview({
        data: combinedData,
        onNodeExpanded: function (event, data) {
            // todo make a request to backend, get the response, call loadTree
            // todo with parent as current data of tree and child as data returned from backend
            loadTree(childData, [{text: 'asdsgdh'}])
        },
        expandIcon: "glyphicon glyphicon-chevron-right",
        collapseIcon: "glyphicon glyphicon-chevron-down"
    });
}

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