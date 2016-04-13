angular.module('mt')

	.directive('trackScroll', ['$window', function ($window)
			{
				return function (scope, element, attrs)
				{
					function listener()
					{
						scope.scroll = $window.document.body.scrollTop;
						scope.$apply();
					}

					angular.element($window).bind('scroll', _.throttle(listener, 100));
				};
			}
		]
	)

	.directive('markPosition', ['$window', function ($window)
			{
				return function (scope, element, attrs)
				{
					setTimeout(
						function () 
						{
							scope.dict[scope.$index].topCoordinate = angular.element(element).offset().top;
							scope.dict[scope.$index].bottomCoordinate = scope.dict[scope.$index].topCoordinate + angular.element(element).height();
						}, 
						500
					);
				};
			}
		]
	)

	.directive('watchIfVisible', ['$window', function ($window)
			{
				return function (scope, element, attrs)
				{
					scope.$watch('scroll', function (value)
					{
						scope.header.visible = value > angular.element(element).height();
					});
				};
			}
		]
	)

	.directive('fullFocus', function ()
		{
			return function (scope, element, attrs)
			{
				angular.element(element).bind('focus', function ()
				{
					console.log('full focus applied')
					angular.element(element).select();
				});
			};
		}
	)

	.directive('startupFocus', function ()
		{
			return function (scope, element, attrs)
			{
				console.log('startup focus applied')
				angular.element(element).focus();
			};
		}
	)
