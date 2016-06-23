'use strict';

var upCode    = 38;
var downCode  = 40;
var escCode   = 27;
var enterCode = 13;

angular.module('mt')

	.controller('AutocompleteController', ['$scope', '$window', '$location', 'Autocomplete',
			function ($scope, $window, $location, Autocomplete)
			{
				$scope.autocomplete = {};
				$scope.autocomplete.list = [];
				$scope.autocomplete.enabled = false;
				$scope.autocomplete.selection = -1;
				
				$scope.autocomplete.fetch = _.debounce(

					function ()
					{
						return Autocomplete
							.fetch(
								$scope.master.query, 
								$scope.master.persistence.languages
							)
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
								$scope.autocomplete.selection = -1;
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
						$location.url('/entry/'+ encodeURIComponent($scope.autocomplete.list[$scope.autocomplete.selection]) +'/'+$scope.master.persistence.languages);
					}
					else
					{
						if ($scope.master.query) 
						{
							$scope.loading = true;
							$location.url('/entry/'+ encodeURIComponent($scope.master.query) +'/'+$scope.master.persistence.languages);
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

				$scope.autocomplete.reset = function ()
				{
					$scope.autocomplete.selection = -1;
				};

				$scope.autocomplete.empty = function ()
				{
					$scope.autocomplete.list = [];
				};

				angular.element($window).bind('keydown', $scope.autocomplete.interceptKeys)

				$scope.$on(
					'viewChange', 
					$scope.autocomplete.empty
				);
			}
		]
	);