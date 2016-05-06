'use strict';

angular.module('mt')

	.controller('LanguagesController', ['$scope', 'languageMap', '$rootScope',
			function ($scope, languageMap, $rootScope)
			{
				$scope.isLocked = function (lang)
				{
					return lang === 'ru';
				};

				$scope.selectableLanguages = Object.keys(languageMap).filter(function (l)
				{
					return !$scope.isLocked(l);
				});
				
				$scope.chooseLanguage = function (indexInCurrent, indexInAvailable)
				{
					$scope.global.languages[indexInCurrent] = $scope.selectableLanguages[indexInAvailable];
					
					$rootScope.$broadcast('languageChange');
				};

				$scope.swapLanguages = function ()
				{
					var temp = $scope.global.languages[0];
					$scope.global.languages[0] = $scope.global.languages[1];
					$scope.global.languages[1] = temp;

					$rootScope.$broadcast('languageChange');
				};
			}
		]
	);