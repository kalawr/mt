angular.module('mtDirectives', [])
	.directive('trackScroll', ['$window', function ($window)
			{
				return function (scope, element, attrs)
				{
					function listener()
					{
						scope.scroll = $window.document.body.scrollTop;
						scope.$apply();
						// console.log(scope.scroll)
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
							scope.dict[scope.$index].offset = angular.element(element).offset().top;
							scope.$apply();
						}, 
						500
					);
				};
			}
		]
	)