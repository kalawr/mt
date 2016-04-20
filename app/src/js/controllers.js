'use strict';

var upCode   = 38;
var downCode = 40;
var escCode  = 27;

angular.module('mt')

	.controller('ApplicationController', ['$scope', '$location', '$window',
			function ($scope, $location, $window) 
			{
				$scope.global = {};
				$scope.global.query = '';
				$scope.global.languages = [
					{
						abbr: 'en',
						full: 'English'
					},
					{
						abbr: 'ru',
						full: 'Russian'
					}
				];

				$scope.global.getLanguages = function ()
				{
					return $scope.global.languages.map(function (l) { return l.abbr }).join('-');
				};

				$scope.global.submit = function (value)
				{
					$location.url('/entry/'+ encodeURIComponent(value || $scope.global.query));
				};

				$scope.scroll = 0;

				$window.onscroll = _.throttle(
					function ()
					{
						$scope.$apply(function () { $scope.scroll = $window.document.body.scrollTop; })
					},
					50
				);
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
						var url = $scope.buildUrl($scope.global.query, $scope.global.getLanguages());

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

	.controller('EntryController', ['$scope', '$http', '$routeParams', '$window', 'url',
			function ($scope, $http, $routeParams, $window, url)
			{
				$scope.global.query = $routeParams.query;
				$scope.buildUrl = url('translate');

				$http.get($scope.buildUrl($scope.global.query, $scope.global.getLanguages()))
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

				$scope.isOnScreen = function (index)
				{
					var pt = $scope.dict[index].topCoordinate;
					var pb = $scope.dict[index].bottomCoordinate;

					if (!(pt && pb))
						return false;
					
					return pb > $scope.scroll && pt < ($scope.scroll + $window.innerHeight);
				};

				$scope.entry = {};
				$scope.entry.clickedUpon = null;
			}
		]
	)