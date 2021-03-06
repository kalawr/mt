angular.module('mt')

	.directive('markPosition', ['$window', function ($window)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						setTimeout(
							function () 
							{	
								$scope.$apply(function ()
								{
									$scope.dict[$scope.$index].topCoordinate = $element.offset().top;
									$scope.dict[$scope.$index].bottomCoordinate = $scope.dict[$scope.$index].topCoordinate + $element.height();
								})
							}, 
							500
						);
					}
				};
			}
		]
	)

	.directive('keepAfloat', ['$window', '$timeout', function ($window, $timeout)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						var offset = $element.offset().top;	

						$scope.$watch('scroll', function (value)
						{
							if (value > offset && $element.height() < $window.innerHeight)
							{
								$element.addClass('fixed');
							}
							else
							{
								$element.removeClass('fixed');
							}
						});
					}
				};
			}
		]
	)

	.directive('fullFocus', function ()
		{
			return {

				restrict: 'A',
				link: function ($scope, $element, $attrs)
				{
					$element.focus(
						function ()
						{
							$element.select();
						}
					);
				}
			};
		}
	)

	.directive('startupFocus', function ()
		{
			return {

				restrict: 'A',
				link: function ($scope, $element, $attrs)
				{
					$element.focus();
				}
			};
		}
	)

	.directive('hashLink', ['$anchorScroll', function ($anchorScroll)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						$element.bind('click', 
							function ()
							{
								$anchorScroll($attrs.hashLink);
							}
						);
					}
				};
			}
		]
	)

	.directive('language', function ()
		{
			return {

				restrict: 'E',
				templateUrl: '/partials/language.html',
				link: function ($scope, $element, $attrs)
				{
					$scope.languageIndex = $scope.$index;
				}
			};
		}
	)

	.directive('icon', function ()
		{
			return {

				restrict: 'E',
				templateUrl: '/partials/icon.html',
				scope: {
					id: '@ref'
				}
			};
		}
	)

	.directive('modal', function ()
		{
			return {

				restrict: 'E',
				link: function ($scope)
				{
					$scope.modalOpen = false;
				}
			};
		}
	)

	.directive('scrollIntoView', function ()
		{
			return {

				restrict: 'A',
				scope: {
					"scrollIntoViewIf": "=",
					"scrollIntoViewEquals": "="
				},
				link: function ($scope, $element, $attributes)
				{
					$scope.$watch('scrollIntoViewIf', function (value)
					{
						if (value === $scope.scrollIntoViewEquals)
						{
							// console.log($element[0])
							$element[0].scrollIntoView(false);
						}
					})
				}
			}
		}
	)