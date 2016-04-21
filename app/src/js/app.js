'use strict';

angular.module('mt', ['ngRoute', 'ngStorage'])
	
	.config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider)
		{
			$locationProvider.html5Mode(
				{
					enabled: true,
					requireBase: false
				}
			);

			$routeProvider
				.when('/entry/:query/:languages', {
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
