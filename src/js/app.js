'use strict';

angular.module('mt', ['ngRoute', 'ngStorage'])
	
	.config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider)
		{
			var resolve = {
				dict: ['Dictionary', '$route',
					function (Dictionary, $route)
					{
						return Dictionary.fetch(
							$route.current.params.query,
							$route.current.params.languages
						);
					}
				]
			};

			var resolveEmpty = {
				dict: function ()
				{
					return Promise.resolve([]);
				}
			};

			$locationProvider.html5Mode(true);

			$routeProvider
				.when(
					'/entry/:query/:languages', 
					{
						templateUrl: '/partials/entry.html',
						controller: 'SubController',
						resolve: resolve
					}
				)
				.when(
					'/cl',
					{
						templateUrl: '/partials/change-language.html'
					}
				)
				.when(
					'/', 
					{
						template: ' ',
						controller: 'SubController',
						resolve: resolveEmpty
					}
				)
				.otherwise(
					{
						redirectTo: '/'
					}
				);
		}
	]);
