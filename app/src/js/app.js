'use strict';

var myApp = angular.module('mt', ['ngRoute', 'mtControllers', 'mtServices', 'mtDirectives'])
	
	myApp.config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider)
		{
			$locationProvider.html5Mode(
				{
					enabled: true,
					requireBase: false
				}
			);

			$routeProvider
				.when('/:query', {
					templateUrl: '/partials/entry.html',
					controller: 'EntryController'
				})
				.when('/', {
					templateUrl: '/partials/root.html'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);
