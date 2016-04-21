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
							$scope.entry.clickedUpon = $scope.id;
						};

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