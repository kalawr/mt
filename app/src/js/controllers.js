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

	.controller('SearchController', ['$scope', '$http', '$location', 'focus',
			function ($scope, $http, $location, focus)
			{
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

				function fetch(url)
				{
					$scope.autocompleteActive = false;

					if (!$scope.topscope.query) 
					{
						url = '/empty';
					}

						$http.get(url)
							.then(
								function (response) 
								{
									$scope.autocompleteItems = response.data;
									$scope.autocompleteSelection = 0;
									if (response.data.length)
									{
										$scope.autocompleteActive = true;
									}
								},
								function (error)
								{
									$scope.autocompleteItems = [];
									$scope.autocompleteSelection = 0;
								}
							);
				}

				$scope.load = _.debounce(fetch, 350);

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
						$scope.autocompleteItems = [];
					}
				};

				$scope.submit = function ()
				{
					if ($scope.autocompleteActive && $scope.autocompleteItems.length)
					{
						$location.url('/'+$scope.autocompleteItems[$scope.autocompleteSelection]);
					}
					else
					{
						if ($scope.topscope.query) 
						{
							$location.url('/'+$scope.topscope.query);
						}
						else
						{
							focus('#query');
						}
					}
				};

				$scope.setSelection = function (index)
				{
					$scope.autocompleteSelection = index;
				};
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams', '$anchorScroll',
			function ($scope, $http, $routeParams, $anchorScroll)
			{
				$scope.topscope.query = $routeParams.query;
				
				$scope.positionIndex = 0;

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

				$scope.goTo = function (id)
				{
					$anchorScroll(id);
				};
			}
		]
	)