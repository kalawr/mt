angular.module('mt')
	.filter('fullLanguage', ['languageMap',
			function (languageMap)
			{
				return function (abbr, condition)
				{
					if (condition)
					{
						return languageMap[abbr] || 'Full language not found for abbreviation: ' + abbr;
					}
					else
					{
						return abbr;
					}
				}
			}
		]
	)