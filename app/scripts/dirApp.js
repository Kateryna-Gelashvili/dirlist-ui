'use strict';

var dirApp = angular.module('dirApp', ['ngResource', 'ngRoute', 'base64'], function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}).config(function($httpProvider, $base64) {
    var auth = $base64.encode("utku:katya");
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
});

dirApp.constant('dirlistConfig', {backendUrl: "http://localhost:8080/utku/"});

dirApp.filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
});