var request = require('request');

var langs = new Map()
	.set('en', 1)
	.set('ru', 2)
	.set('de', 3)
	.set('fr', 4)
	.set('es', 5)
	.set('it', 23)
	;

var buildUrl = function (type)
{
	return function (query, langs, langsMap)
	{
		var lang1 = langsMap.get(langs.split('-')[0]);
		var lang2 = langsMap.get(langs.split('-')[1]);

		return `http://www.multitran.ru/c/${type}.exe?s=${query}&l1=${lang1}&l2=${lang2}`;
	};
};

var buildResultUrl = buildUrl('m');
var buildHintUrl   = buildUrl('ms');