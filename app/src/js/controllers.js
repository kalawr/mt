'use strict';

var upCode    = 38;
var downCode  = 40;
var escCode   = 27;
var enterCode = 13;

angular.module('mt')

	.controller('ApplicationController', ['$scope', '$location', '$window', '$localStorage',
			function ($scope, $location, $window, $localStorage) 
			{
				$scope.global = {};
				$scope.$storage = $localStorage;

				$scope.global.restoreFromStorage = function ()
				{
					return $scope.$storage.languages;
				};

				$scope.$storage.$default({

					languages: [
						{
							abbr: 'en',
							full: 'English'
						},
						{
							abbr: 'ru',
							full: 'Russian',
							disabled: true
						}
					]
				});

				$scope.global.query = '';


				$scope.global.languages = $scope.global.restoreFromStorage();

				$scope.allLanguages = [
					{
						abbr: 'en',
						full: 'English'
					},
					{
						abbr: 'de',
						full: 'German'
					},
					{
						abbr: 'fr',
						full: 'French'
					},
					{
						abbr: 'es',
						full: 'Spanish'
					},
					{
						abbr: 'it',
						full: 'Italian'
					},
					{
						abbr: 'ru',
						full: 'Russian',
						disabled: true
					}
				];

				$scope.selectableLanguages = $scope.allLanguages.filter(function (l)
				{
					return !l.disabled;
				});

				$scope.global.getLanguages = function ()
				{
					return $scope.global.languages[0].abbr + '-' + $scope.global.languages[1].abbr;
				};

				$scope.global.mapLanguages = function (query)
				{
					return query.split('-').map(function (abbr)
					{
						return $scope.allLanguages.find(function (element) 
						{
							return element.abbr === abbr;
						});
					});
				};

				$scope.global.submit = function (value)
				{
					$location.url('/entry/'+ encodeURIComponent(value || $scope.global.query) +'/'+$scope.global.getLanguages());
				};

				$scope.scroll = 0;

				$window.onscroll = _.throttle(
					function ()
					{
						$scope.$apply(function () { $scope.scroll = $window.document.body.scrollTop; })
					},
					50
				);

				$scope.$watchCollection('global.languages', function (value) 
				{
						$scope.$storage.languages = value;
				});
			}
		]
	)

	.controller('AutocompleteController', ['$scope', '$http', '$window', 'focus', 'url',
			function ($scope, $http, $window, focus, url)
			{
				$scope.autocomplete = {};
				$scope.autocomplete.list = [];
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
									$scope.autocomplete.reset();
								},
								function (error)
								{
									$scope.autocomplete.list = [];
									$scope.autocomplete.reset();
								}
							)
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

				$scope.autocomplete.reset = function ()
				{
					$scope.autocomplete.selection = -1;
				};

				$scope.autocomplete.reset();

				angular.element($window).bind('keydown', $scope.autocomplete.interceptKeys)
			}
		]
	)

	.controller('LanguagesController', ['$scope',
			function ($scope)
			{
				
				$scope.chooseLanguage = function (indexInCurrent, indexInAvailable)
				{
					$scope.global.languages[indexInCurrent] = $scope.selectableLanguages[indexInAvailable];
				};

				$scope.swapLanguages = function ()
				{
					var temp = $scope.global.languages[0];
					$scope.global.languages[0] = $scope.global.languages[1];
					$scope.global.languages[1] = temp;

					$scope.$broadcast('langSwap');
				};
			}
		]
	)

	.controller('LanguageMenuController', ['$scope', function ($scope)
			{
				$scope.menu = {};
				$scope.menu.hidden = true;
				$scope.menu.toggle = function ()
				{
					$scope.menu.hidden = $scope.menu.hidden ? false: true; 
				};

				$scope.$on('langSwap', function ()
				{
					$scope.menu.hidden = true;
				});
			}
		]
	)

	.controller('EntryController', ['$scope', '$http', '$routeParams', '$window', 'url',
			function ($scope, $http, $routeParams, $window, url)
			{
				$scope.global.query = $routeParams.query;
				$scope.global.languages = $scope.global.mapLanguages($routeParams.languages);
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
							$scope.responseStatus = error.status;
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