var http = require('http');
var iconv = require('iconv-lite');
var express = require('express');
var cheerio = require('cheerio');
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

		return `/c/${type}.exe?l1=${lang1}&l2=${lang2}&s=${query}`;
	};
};

var buildResultUrl = buildUrl('m');
var buildAutocompleteUrl = buildUrl('ms');



var parseResult = function (html)
{
	var $ = cheerio.load(html);

	var result = [];

	$('*').each(function (i, el) 
	{
		var $el = $(el);

		// Variant?
		if ($el.is('script + table > tr > td:only-child a[href*="m.exe"]'))
		{
			result.push({variant: $el.text()});
		}
		else
		// Part of Speech?
		if ($el.is('script + table > tr > td:only-child em'))
		{
			result[result.length-1].partOfSpeech = $el.text();
		}
		else
		// Domain Name?
		if ($el.is('script + table > tr > td:not(:only-child):first-child > a'))
		{
			if (!result[result.length-1].domains)
			{
				result[result.length-1].domains = [];
			}

			result[result.length-1].domains.push({ domain: $el.attr('title') });
		}
		else
		// Translation?
		if ($el.is('script + table > tr > td:not(:only-child):nth-child(2) a:not([href*=UserName])'))
		{
			var lastResult = result[result.length-1];
			var lastDomain = lastResult.domains[lastResult.domains.length-1];

			if (!lastDomain.translations)
			{
				lastDomain.translations = [];
			}

			lastDomain.translations.push($el.text());
		}
	})

	return {result:result};
};

var parseAutocomplete = function (string)
{
	return {
		options: string.split('\r\n').filter(Boolean)
	};
};

app.get('/translate/:query/:langs', function (req, res)
{
	http.get(
		{
			hostname: 'www.multitran.ru',
			path: buildResultUrl(req.params.query, req.params.langs, langs),
			headers: {
				'User-Agent': 'Have to Have It'
			}
		},
		function (response)
		{
			var chunks = [];

			response.on('data', function (chunk)
			{
				chunks.push(chunk);
			});

			response.on('end', function ()
			{
				var decoded = iconv.decode(Buffer.concat(chunks), 'win1251');
				res.json(parseResult(decoded));
			});
		}
	);
});

app.get('/autocomplete/:query/:langs', function (req, res)
{
	http.get(
		{
			hostname: 'www.multitran.ru',
			path: buildAutocompleteUrl(req.params.query, req.params.langs, langs),
			headers: {
				'User-Agent': 'Have to Have It'
			}
		},
		function (response)
		{
			var chunks = [];

			response.on('data', function (chunk)
			{
				chunks.push(chunk);
			});

			response.on('end', function ()
			{
				var decoded = iconv.decode(Buffer.concat(chunks), 'win1251');
				res.json(parseAutocomplete(decoded));
			});
		}
	);
});

app.listen(3000, function ()
{
	console.log('Example app listening on port 3000');
});
