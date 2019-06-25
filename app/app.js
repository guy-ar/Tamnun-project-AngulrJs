var scheduleApp = angular.module('scheduleApp', ['ui.calendar', 'ui.bootstrap', 'ngRoute']);

scheduleApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "app/components/home/home.html"
    }).when("/login", {
        templateUrl: "app/components/login/login.html"//,
        //controller: "loginCtrl"
    }).when("/signup", {
        
    }).when("/events", {
        templateUrl: "app/components/events/events.html",
        //controller: "eventsCtrl"        
    }).when("/events/new", {
        
    }).when("/events/:id", {
        
    })
})