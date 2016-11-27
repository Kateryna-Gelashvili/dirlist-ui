'use strict';

function postProcessPath(backendUrl, parentPath, childPath) {
    var normalizedPath = childPath.path.charAt(childPath.path.length - 1) === '/' ?
        childPath.path.substring(0, childPath.path.length - 1) : childPath.path;

    childPath.name = normalizedPath.replace(/^.*[\\\/]/, '');
    childPath.dlUrl = backendUrl + 'dl/' + normalizedPath;

    childPath.parent = parentPath;

    if (!parentPath) {
        childPath.depth = 0;
    } else {
        childPath.depth = parentPath.depth + 1;
    }

    if (childPath.type === 'DIRECTORY') {
        childPath.expanded = false;
    }

    childPath.visible = true;

    childPath.id = md5(childPath.path);

    return childPath;
}

function isDirectory(path) {
    return path && path.type === 'DIRECTORY';
}

function findChildren(data, parent) {
    if (!isDirectory(parent)) {
        return [];
    }

    var result = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].parent && data[i].parent.path == parent.path) {
            result.push(data[i]);
        }
    }

    return result;
}

function findChildrenRecursively(data, parent, result) {
    var children = findChildren(data, parent);

    children.forEach(function (child) {
        result.push(child);
    });

    for (var i = 0; i < children.length; i++) {
        findChildrenRecursively(data, children[i], result);
    }

    return result;
}

function findAllChildren(data, parent) {
    return findChildrenRecursively(data, parent, []);
}

function updateProgressForExtraction(backendUrl, $scope, $http, pathId, extractionId) {
    $http.get(backendUrl + 'extractionProgress/' + extractionId)
        .success(function (response) {
            var extractedSize = response.extractedSize;
            var totalSize = response.totalSize;
            $scope['extractionProgress_' + pathId] = (extractedSize / totalSize) * 100;
            if (extractedSize < totalSize) {
                setTimeout(function () {
                    updateProgressForExtraction(backendUrl, $scope, $http, pathId, extractionId);
                }, 1000);
            } else {
                $scope['extractionStatus_' + pathId] = 'extracted';
                $scope.$apply();
            }
        })
        .error(function (error) {
            setTimeout(function () {
                updateProgressForExtraction(backendUrl, $scope, $http, pathId, extractionId);
            }, 1000);
        });
}


dirApp.controller('dirController',
    ['$q', '$http', '$scope', '$location', '$window', 'dirlistConfig',
        function ($q, $http, $scope, $location, $window, dirlistConfig) {
            var self = this;

            $scope.extract = function (path) {
                $scope['extractionStatus_' + path.id] = 'in-progress';
                $http.post(dirlistConfig.backendUrl + 'extract', {path: path.path}).success(function (response) {
                    updateProgressForExtraction(dirlistConfig.backendUrl, $scope, $http, path.id, response.id);
                });
            };

            $scope.list = function (path) {
                if (path && !isDirectory(path)) {
                    return;
                }

                if (path && path.expanded) {
                    path.expanded = false;

                    findAllChildren($scope.initialData, path).forEach(function (child) {
                        if (isDirectory(child)) {
                            child.expanded = false;
                        }

                        child.visible = false;
                    });
                    self.data = $scope.initialData;
                } else {
                    if (path) {
                        path.expanded = true;
                    }

                    if (path && path.childrenLoaded) {
                        findChildren($scope.initialData, path).forEach(function (child) {
                            child.visible = true;
                        });
                        self.data = $scope.initialData;
                    } else {
                        var subPath = path ? '/' + path.path : '';
                        $http.get(dirlistConfig.backendUrl + 'list' + subPath)
                            .then(function (response) {
                                var transformedData = response.data.map(function (obj) {
                                    return postProcessPath(dirlistConfig.backendUrl, path, obj);
                                });

                                transformedData.forEach(function (transformedPath) {
                                    $scope['extractionStatus_' + transformedPath.id] = 'ready-to-extract';
                                });

                                if (!path) {
                                    $scope.initialData = transformedData;
                                } else {
                                    var parentIndex = -1;
                                    for (var i = 0; i < $scope.initialData.length; i++) {
                                        if ($scope.initialData[i].path == path.path) {
                                            parentIndex = i;
                                            break;
                                        }
                                    }

                                    if (parentIndex != -1) {
                                        $scope.initialData.splice
                                            .apply($scope.initialData,
                                                [parentIndex + 1, 0].concat(transformedData));
                                    }
                                }
                                self.data = $scope.initialData;
                            });

                        if (path) {
                            path.childrenLoaded = true;
                        }
                    }
                }
            };

            $scope.list();
        }
    ]
);