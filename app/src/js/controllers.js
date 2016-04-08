'use strict';

angular.module('mtControllers', [])

	.controller('ApplicationController', ['$scope', '$location',
			function ($scope, $location) 
			{
				$scope.topscope = {};
				$scope.topscope.languages = 'en-ru';
				$scope.topscope.query = '';

				$scope.submit = function ()
				{
					$location.url('/'+$scope.topscope.query);
				};
			}
		]
	)

	.controller('SearchController', ['$scope', '$http',
			function ($scope, $http)
			{
				$scope.topscope.query = '';
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
					if ($scope.topscope.query)
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
						else
							$scope.autocompleteItems = [];
				};

				
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams',
			function ($scope, $http, $routeParams)
			{
				$scope.topscope.query = $routeParams.query;

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