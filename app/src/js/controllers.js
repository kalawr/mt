'use strict';

var upCode   = 38;
var downCode = 40;
var escCode  = 27;

angular.module('mt')

	.controller('ApplicationController', ['$scope', '$location',
			function ($scope, $location) 
			{
				$scope.global = {};
				$scope.global.query = '';
				$scope.global.languages = 'en-ru';

				$scope.global.submit = function (value)
				{
					$location.url('/'+ (value || $scope.global.query));
				};
			}
		]
	)

	.controller('SearchController', ['$scope', '$http', 'focus',
			function ($scope, $http, focus)
			{
				$scope.autocompleteList = [];
				$scope.autocompleteSelection = 0;

				$scope.url = function ()
				{
					return '/autocomplete' +
						'/' +
						String($scope.global.query) +
						'/' +
						String($scope.global.languages);
				};

				function fetchList(url)
				{
					if (!$scope.global.query) 
					{
						url = '/empty';
					}

						$http.get(url)
							.then(
								function (response) 
								{
									$scope.autocompleteList = response.data;
									$scope.autocompleteSelection = 0;
								},
								function (error)
								{
									$scope.autocompleteList = [];
									$scope.autocompleteSelection = 0;
								}
							)
							.then($scope.enableAutocomplete)
							;
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
						$scope.global.submit($scope.autocompleteList[$scope.autocompleteSelection])
					}
					else
					{
						if ($scope.global.query) 
						{
							$scope.global.submit();
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

				$scope.disableAutocomplete = function ()
				{
					$scope.autocompleteActive = false;
				};

				$scope.enableAutocomplete = function ()
				{
					$scope.autocompleteActive = true;
				};
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams', '$anchorScroll', '$window',
			function ($scope, $http, $routeParams, $anchorScroll, $window)
			{
				$scope.global.query = $routeParams.query;
				$scope.header = {};

				function url()
				{
					return '/translate' +
						'/' +
						String($scope.global.query) +
						'/' +
						String($scope.global.languages);
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