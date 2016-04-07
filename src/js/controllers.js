'use strict';

angular.module('mtControllers', [])

	.controller('ApplicationController', ['$scope', 
			function ($scope) 
			{

			}
		]
	)

	.controller('SearchController', ['$scope', '$http', '$location',
			function ($scope, $http, $location)
			{
				$scope.search = {};
				$scope.search.languages = 'en-ru';
				$scope.search.query = '';


				$scope.autocompleteItems = [];

				$scope.url = function (type)
				{
					return '/autocomplete' +
						'/' +
						String($scope.search.query) +
						'/' +
						String($scope.search.languages);
				};

				$scope.load = function (url)
				{
					$http.get(url)
						.then(
							function (response) 
							{
								$scope.autocompleteItems = response.data;
							},
							function (error)
							{
								$scope.autocompleteItems = [];
							}
						);
				};

				$scope.submit = function ()
				{
					$location.url('/'+this.search.query);
				};
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams',
			function ($scope, $http, $routeParams)
			{
				function url(query, languages)
				{
					return '/translate' +
						'/' +
						String(query) +
						'/' +
						String(languages);
				};

				$http.get(url($routeParams.query, 'en-ru'))
					.then(
						function (response) 
						{
							$scope.dict = response.data;
						},
						function (error)
						{
							$scope.dict = [];
						}
					);
			}
		]
	)