angular.module('mt')

	.directive('trackScroll', ['$window', function ($window)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						function listener()
						{
							$scope.scroll = $window.document.body.scrollTop;
							$scope.$apply();
						}

						angular.element($window).scroll(_.throttle(listener, 50));
					}
				};
			}
		]
	)

	.directive('markPosition', ['$window', function ($window)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						setTimeout(
							function () 
							{
								$scope.dict[$scope.$index].topCoordinate = $element.offset().top;
								$scope.dict[$scope.$index].bottomCoordinate = $scope.dict[$scope.$index].topCoordinate + $element.height();
							}, 
							500
						);
					}
				};
			}
		]
	)

	.directive('keepAfloat', ['$window', function ($window)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						var offset = $element.offset().top;

						$scope.$watch('scroll', function (value)
						{
							if (value > offset)
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
