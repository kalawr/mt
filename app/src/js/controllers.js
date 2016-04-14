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

	.controller('AutocompleteController', ['$scope', '$http', 'focus', 'url',
			function ($scope, $http, focus, url)
			{
				$scope.autocomplete = {};
				$scope.autocomplete.list = [];
				$scope.autocomplete.selection = 0;
				$scope.autocomplete.enabled = false;

				$scope.buildUrl = url('autocomplete');
				$scope.autocomplete.fetch = _.debounce(

					function ()
					{
						var url;

						if (!$scope.global.query) 
						{
							url = '/empty';
						}
						else
						{
							url = $scope.buildUrl($scope.global.query, $scope.global.languages);
						}

						$http.get(url)
							.then(
								function (response) 
								{
									$scope.autocomplete.list = response.data;
									$scope.autocomplete.selection = 0;
								},
								function (error)
								{
									$scope.autocomplete.list = [];
									$scope.autocomplete.selection = 0;
								}
							)
							.then($scope.autocomplete.enable)
							;
					},
					350
				);


				$scope.autocomplete.interceptKeys = function (event)
				{
					if (event.keyCode == upCode)
					{
						event.preventDefault();
						$scope.autocomplete.selection = ($scope.autocomplete.list.length+$scope.autocomplete.selection-1) % $scope.autocomplete.list.length;
					}
					else
					if (event.keyCode == downCode)
					{
						event.preventDefault();
						$scope.autocomplete.selection = ($scope.autocomplete.selection+1) % $scope.autocomplete.list.length;
					}
					else
					if (event.keyCode == escCode)
					{
						event.preventDefault();
						$scope.autocomplete.list = [];
					}
				};

				$scope.autocomplete.submit = function ()
				{
					if ($scope.autocomplete.enabled && $scope.autocomplete.list.length)
					{
						$scope.global.submit($scope.autocomplete.list[$scope.autocomplete.selection])
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

				$scope.autocomplete.setSelection = function (index)
				{
					$scope.autocomplete.selection = index;
				};

				$scope.autocomplete.enable = function ()
				{
					$scope.autocomplete.enabled = true;
				};

				$scope.autocomplete.disable = function ()
				{
					$scope.autocomplete.enabled = false;
				};
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams', '$anchorScroll', '$window', 'url',
			function ($scope, $http, $routeParams, $anchorScroll, $window, url)
			{
				$scope.global.query = $routeParams.query;
				$scope.buildUrl = url('translate');

				$http.get($scope.buildUrl($scope.global.query, $scope.global.languages))
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