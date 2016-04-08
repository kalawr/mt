'use strict';

var upCode   = 38;
var downCode = 40;
var escCode  = 27;

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
				$scope.topscope.query = '';
				$scope.autocompleteItems = [];
				$scope.autocompleteSelection = 0;

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
					{
						$http.get(url)
							.then(
								function (response) 
								{
									$scope.autocompleteItems = response.data;
									$scope.autocompleteSelection = 0;
								},
								function (error)
								{
									$scope.autocompleteItems = [];
									$scope.autocompleteSelection = 0;
								}
							);
					}
					else
					{
						$scope.autocompleteItems = [];
						$scope.autocompleteSelection = 0;
					}
							
				};

				$scope.interceptKeys = function (event)
				{
					if (event.keyCode == upCode)
					{
						event.preventDefault();
						$scope.autocompleteSelection = ($scope.autocompleteItems.length+$scope.autocompleteSelection-1) % $scope.autocompleteItems.length;
					}
					else
					if (event.keyCode == downCode)
					{
						event.preventDefault();
						$scope.autocompleteSelection = ($scope.autocompleteSelection+1) % $scope.autocompleteItems.length;
					}
					else
					if (event.keyCode == escCode)
					{
						event.preventDefault();
						$scope.autocompleteSelection = 0;
					}
				};

				$scope.submit = function ()
				{
					$location.url('/'+$scope.autocompleteItems[$scope.autocompleteSelection]);
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