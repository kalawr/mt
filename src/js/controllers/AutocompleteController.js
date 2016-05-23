'use strict';

var upCode    = 38;
var downCode  = 40;
var escCode   = 27;
var enterCode = 13;

angular.module('mt')

	.controller('AutocompleteController', ['$scope', '$http', '$window', 'focus', 'url',
			function ($scope, $http, $window, focus, url)
			{
				$scope.autocomplete = {};
				$scope.autocomplete.list = [];
				$scope.autocomplete.enabled = false;
				$scope.loading = false;

				$scope.autocomplete.fetch = _.debounce(

					function ()
					{
						var URL = url.autocomplete(
							$scope.global.query, 
							$scope.global.getLanguages()
						);

						$http.get(URL)
							.then(
								function (response) 
								{
									$scope.autocomplete.list = response.data;
								},
								function (error)
								{
									$scope.autocomplete.list = [];
								}
							)
							.then($scope.autocomplete.reset)
							.then($scope.autocomplete.enable)
							;
					},
					350
				);


				$scope.autocomplete.interceptKeys = function (event)
				{
					$scope.$apply(
						function ()
						{
							if (event.keyCode == upCode)
							{
								event.preventDefault();

								if ($scope.autocomplete.selection >= 0)
								{
									$scope.autocomplete.selection = ($scope.autocomplete.list.length+$scope.autocomplete.selection-1) % $scope.autocomplete.list.length;
								}
								else
								{
									$scope.autocomplete.selection = $scope.autocomplete.list.length - 1;
								}
							}
							else
							if (event.keyCode == downCode)
							{
								event.preventDefault();

								if ($scope.autocomplete.selection >= 0)
								{
									$scope.autocomplete.selection = ($scope.autocomplete.selection+1) % $scope.autocomplete.list.length;
								}
								else
								{
									$scope.autocomplete.selection = 0;
								}
							}
							else
							if (event.keyCode == escCode)
							{
								event.preventDefault();
								$scope.autocomplete.reset();
							}
							else
							if (event.keyCode == enterCode)
							{
								event.preventDefault();
								$scope.autocomplete.submit();
							}
						}
					);
				};

				$scope.autocomplete.submit = function ()
				{
					if ($scope.autocomplete.enabled && $scope.autocomplete.list.length && $scope.autocomplete.selection >= 0)
					{
						$scope.loading = true;
						$scope.global.submit($scope.autocomplete.list[$scope.autocomplete.selection]);
					}
					else
					{
						if ($scope.global.query) 
						{
							$scope.loading = true;
							$scope.global.submit();
						}
						// else
						// {
						// 	focus('#query');
						// }
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

				$scope.autocomplete.reset = function ()
				{
					$scope.autocomplete.selection = -1;
				};

				$scope.autocomplete.empty = function ()
				{
					$scope.autocomplete.list = [];
				};

				$scope.autocomplete.reset();

				angular.element($window).bind('keydown', $scope.autocomplete.interceptKeys)

				$scope.$on('languageChange', function ()
					{
						$scope.autocomplete.disable();
						$scope.autocomplete.fetch();
					}
				);

				$scope.$on('$viewContentLoaded', function ()
				{
					$scope.autocomplete.empty();
				});
			}
		]
	);