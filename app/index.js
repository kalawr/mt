var http = require('http');
var iconv = require('iconv-lite');
var express = require('express');
var cheerio = require('cheerio');
var entities = require('entities');
var app = express();

var root = 'dist/';

if (process.argv[2] === '--dev')
{
	root = 'src/';
}



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

	$('script + table > tr *').each(function (i, el) 
	{
		var $el = $(el);

		// Variant?
		if ($el.is('script + table tr > td[bgcolor="#DBDBDB"] > a[href*="m.exe"]'))
		{
			result.push({variant: $el.text()});
		}
		else
		// Part of Speech?
		if ($el.is('script + table tr > td[bgcolor="#DBDBDB"] > em'))
		{
			result[result.length-1].partOfSpeech = $el.text();
		}
		else
		// Domain Name?
		if ($el.is('script + table tr > td:not([bgcolor="#DBDBDB"]) > a[title]'))
		{
			if (!result[result.length-1].domains)
			{
				result[result.length-1].domains = [];
			}

			result[result.length-1].domains.push({ domain: $el.attr('title') });
		}
		else
		// Translation?
		if ($el.is('script + table tr > td:not([bgcolor="#DBDBDB"]) a[href*="m.exe"]:not([href*="UserName"])'))
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

	return result;
};

var parseAutocomplete = function (string)
{
	return string.split('\r\n').filter(Boolean);
};


app.use(express.static(root));

app.get('/empty', function (req, res)
{
	res.json([]);
});

app.get('/translate/:query/:langs', function (req, res)
{

	http.get(
		{
			hostname: 'www.multitran.ru',
			path: buildResultUrl(encodeURIComponent(req.params.query), req.params.langs, langs),
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
			path: buildAutocompleteUrl(encodeURIComponent(req.params.query), req.params.langs, langs),
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
				res.json(parseAutocomplete(entities.decodeHTML(chunks.join(''))));
			});
		}
	);
});

app.get('*', function (req, res)
{
	res.sendFile(__dirname + '/'+root+'index.html');
});

app.listen(3000, function ()
{
	if (process.argv[2] === '--dev')
	{
		console.log('Development app listening on port 3000');
	}
	else
	{
		console.log('Production app listening on port 3000');
	}
});
