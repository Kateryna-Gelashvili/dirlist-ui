'use strict';

var dirApp = angular.module('dirApp', ['ngResource', 'ngAnimate', 'ngRoute', 'base64', 'ngToast'],
    function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    })
    .service('authInterceptor', function ($q) {
        var service = this;

        service.request = function (config) {
            var auth = window.localStorage.getItem('auth');
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

dirApp.constant('dirlistConfig', {backendUrl: "https://dirlist.zbfl.tk/"});

dirApp.filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
});