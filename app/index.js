var request = require('request');
var express = require('express');
var app = express();

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

		return `http://www.multitran.ru/c/${type}.exe?l1=${lang1}&l2=${lang2}&s=${query}`;
	};
};

var buildResultUrl = buildUrl('m');
var buildAutocompleteUrl = buildUrl('ms');

var parseResult = function (html)
{
	return { test: 'value' };
};

var parseAutocomplete = function (string)
{
	return {
		options: string.split('\r\n').filter(Boolean);
	};
};

app.get('/translate/:query/:langs', function (req, res)
{
	request(
		{
			url: buildResultUrl(req.params.query, req.params.langs, langs),
			headers: {
				'User-Agent': 'Have to Have It'
			}
		},
		function (err, response, body)
		{
			res.json(parseResult(body));
		}
	);
});

app.get('/autocomplete/:query/:langs', function (req, res)
{
	request(
		{
			url: buildAutocompleteUrl(req.params.query, req.params.langs, langs),
			headers: {
				'User-Agent': 'Have to Have It'
			}
		},
		function (err, response, body)
		{
			res.json(parseAutocomplete(body));
		}
	);
});

app.listen(3000, function ()
{
	console.log('Example app listening on port 3000');
});
