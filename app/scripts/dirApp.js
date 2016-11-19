'use strict';

var dirApp = angular.module('dirApp', ['ngResource', 'ngAnimate', 'ngRoute', 'base64', 'ngToast'],
    function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })
    .constant('dirlistConfig', {
        backendUrl: "http://localhost:8080/utku/",
        authKey: "dirlist-auth"
    })
    .service('authInterceptor', function ($q, dirlistConfig) {
        var service = this;

        service.request = function (config) {
            var auth = window.localStorage.getItem(dirlistConfig.authKey);
            if (auth && config) {
                config.headers.Authorization = 'Basic ' + auth;
            }
            return config;
        };

        service.responseError = function (rejection) {
            if (rejection.status == 401 && !rejection.config.ignore401) {
                window.location = "login.html";
            }
            return $q.reject(rejection);
        };
    })
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    }])
    .config(['ngToastProvider', function (ngToast) {
        ngToast.configure({
            animation: 'slide'
        });
    }]);

dirApp.filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
});