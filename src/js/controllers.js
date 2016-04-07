'use strict';

angular.module('mtControllers', [])

	.controller('ApplicationController', ['$scope', 
			function ($scope) 
			{
				$scope.topscope = {};
				$scope.topscope.languages = 'en-ru';
				$scope.topscope.query = '';
			}
		]
	)

	.controller('SearchController', ['$scope', '$http', '$location',
			function ($scope, $http, $location)
			{
				$scope.autocompleteItems = [];

				$scope.url = function ()
				{
					return '/autocomplete' +
						'/' +
						String($scope.topscope.query) +
						'/' +
						String($scope.topscope.languages);
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
					$location.url('/'+$scope.topscope.query);
				};
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams',
			function ($scope, $http, $routeParams)
			{
				function url()
				{
					return '/translate' +
						'/' +
						String($scope.topscope.query) +
						'/' +
						String($scope.topscope.languages);
				};

				$http.get(url())
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