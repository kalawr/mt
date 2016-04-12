'use strict';

var upCode   = 38;
var downCode = 40;
var escCode  = 27;

angular.module('mt')

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
				$scope.autocompleteList = [];
				$scope.autocompleteSelection = 0;

				$scope.url = function ()
				{
					return '/autocomplete' +
						'/' +
						String($scope.topscope.query) +
						'/' +
						String($scope.topscope.languages);
				};

				function fetchList(url)
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
									$scope.autocompleteList = response.data;
									$scope.autocompleteSelection = 0;
									if (response.data.length)
									{
										$scope.autocompleteActive = true;
									}
								},
								function (error)
								{
									$scope.autocompleteList = [];
									$scope.autocompleteSelection = 0;
								}
							);
				}

				$scope.fetchList = _.debounce(fetchList, 350);

				$scope.interceptKeys = function (event)
				{
					if (event.keyCode == upCode)
					{
						event.preventDefault();
						$scope.autocompleteSelection = ($scope.autocompleteList.length+$scope.autocompleteSelection-1) % $scope.autocompleteList.length;
					}
					else
					if (event.keyCode == downCode)
					{
						event.preventDefault();
						$scope.autocompleteSelection = ($scope.autocompleteSelection+1) % $scope.autocompleteList.length;
					}
					else
					if (event.keyCode == escCode)
					{
						event.preventDefault();
						$scope.autocompleteList = [];
					}
				};

				$scope.submit = function ()
				{
					if ($scope.autocompleteActive && $scope.autocompleteList.length)
					{
						$location.url('/'+$scope.autocompleteList[$scope.autocompleteSelection]);
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

	.controller('EntryController', ['$scope', '$http', '$routeParams', '$anchorScroll', '$window',
			function ($scope, $http, $routeParams, $anchorScroll, $window)
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

				$scope.goTo = function (id)
				{
					$anchorScroll(id);
				};

				$scope.isOnScreen = function (index)
				{
					var pt = $scope.dict[index].topCoordinate;
					var pb = $scope.dict[index].bottomCoordinate;

					if (!(pt && pb))
						return false;
					
					return pb > $scope.scroll && pt < ($scope.scroll + $window.innerHeight);
				};
			}
		]
	)