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

	.directive('watchIfVisible', ['$window', function ($window)
			{
				return {

					restrict: 'A',
					link: function ($scope, $element, $attrs)
					{
						$scope.$watch('scroll', function (value)
						{
							$scope.header.visible = value > $element.height();
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
