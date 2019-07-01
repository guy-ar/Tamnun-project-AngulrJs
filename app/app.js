var scheduleApp = angular.module('scheduleApp', ['ui.calendar', 'ui.bootstrap', 'ngRoute']);

scheduleApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "app/components/home/home.html"
    }).when("/login", {
        templateUrl: "app/components/login/login.html",
        controller: "loginCtrl"
    }).when("/signup", {
        
    }).when("/dashboard/", {
        templateUrl: "app/components/dashboard/dashboard.html"
    }).when("/trainers", {
        templateUrl: "app/components/trainer/trainers.html",
        controller: "trainersCtrl"
    }).when("/events", {
        templateUrl: "app/components/event/events.html",
        controller: "eventsCtrl"        
    }).when("/events/new", {
        
    }).when("/events/:id", {
        
    }).when("/error", {
        templateUrl: "app/shared/navbar/error.html"
    }).otherwise({
        redirectTo: "/error" 
    });
})