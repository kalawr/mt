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
				.when(
					'/entry/:query/:languages', 
					{
						templateUrl: '/partials/entry.html',
						controller: 'EntryController',
						resolve: {
							dict: ['$http', '$route', 'url',
								function ($http, $route, url)
								{
									return $http.get(url.translate($route.current.params.query, $route.current.params.languages))
										.then(
											function (response) 
											{
												return response.data;
											},
											function (error)
											{
												console.log(error)
												return error;
											}
										);
								}
							]
						}
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
						controller: 'EmptyController'
					}
				)
				.otherwise(
					{
						redirectTo: '/'
					}
				);
		}
	]);
