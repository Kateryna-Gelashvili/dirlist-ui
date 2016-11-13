dirApp.controller('LoginController', ['$scope', '$http', '$base64', 'ngToast', 'dirlistConfig',
    function ($scope, $http, $base64, ngToast, dirlistConfig) {
        $scope.login = function () {
            var auth = $base64.encode($scope.username + ":" + $scope.password);
            $http({
                method: 'GET',
                url: dirlistConfig.backendUrl + 'list',
                headers: {
                    'Authorization': 'Basic ' + auth
                },
                ignore401: true
            }).success(function (response) {
                window.localStorage.setItem('auth', auth);
                window.location = 'index.html';
            }).error(function () {
                ngToast.create({
                    className: 'danger',
                    content: 'Wrong username or password!',
                    timeout: 3000
                });
            });
        };
    }]);