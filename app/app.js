var scheduleApp = angular.module('scheduleApp', ['ui.calendar', 'ui.bootstrap', 'ngRoute', 'chart.js']);

scheduleApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "app/components/home/home.html"
    }).when("/login", {
        templateUrl: "app/components/login/login.html",
        controller: "loginCtrl"
    }).when("/signup", {
        templateUrl: "app/components/signup/signup.html",
        controller: "signupCtrl"
    }).when("/resetPass", {
        templateUrl: "app/components/resetPass/resetPass.html",
        controller: "resetPassCtrl"
    }).when("/dashboard", {
        templateUrl: "app/components/dashboard/dashboard.html",
        controller: "dashCtrl"
    }).when("/trainers", {
        templateUrl: "app/components/trainer/trainers.html",
        controller: "trainersCtrl"
    }).when("/trainer/:id", {
        templateUrl: "app/components/trainer/trainerDtls.html",
        controller: "trainerDtlsCtrl"
    }).when("/events", {
        templateUrl: "app/components/event/events.html",
        controller: "eventsCtrl"        
    }).when("/events/new", {
        templateUrl: "app/components/event/newEvent.html",
        controller: "newEventCtrl" 
    }).when("/events/new/map", {
        templateUrl: "app/shared/calendar/calendar.html",
        controller: "calendarCtrl" 
    }).when("/events/:id", {
        templateUrl: "app/components/event/eventDtls.html",
        controller: "eventDtlsCtrl" 
    }).when("/activity/:id", {
        templateUrl: "app/components/activity/activityEdit.html",
        controller: "activityEditCtrl" 
    }).when("/user", {
        templateUrl: "app/components/user/userDtls.html"
    }).when("/error", {
        templateUrl: "app/shared/navbar/error.html"
    }).otherwise({
        redirectTo: "/error" 
    });
})