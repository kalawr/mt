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
						var height = $element.height();
						$scope.$watch('scroll', function (value)
						{
							if (value > offset && height > $window.innerHeight)
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

	.directive('submittable', ['$window', function ($window)
			{
				return {

					restrict: 'AE',
					templateUrl: '/partials/submittable.html',
					transclude: true,
					link: function ($scope, $element, $attrs)
					{
						function clickAction()
						{
							$scope.$apply(function ()
								{
									$scope.global.query = $scope.translation;
									$scope.global.submit();
								}
							);
							
						}

						$scope.prod = function ()
						{
							$scope.showButton = ($scope.showButton ? false : true);
						};

						$scope.showButton = false;
						angular.element('button', $element).click(clickAction);
					}
				};
			}
		]
	)

	.directive('hashLink', ['$anchorScroll', function ($anchorScroll)
			{
				return function ($scope, $element, $attrs)
				{
					$element.bind('click', function ()
						{
							$anchorScroll($attrs.hashLink);
						});
				};
			}
		]
	)