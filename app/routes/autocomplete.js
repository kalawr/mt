var express     = require('express')
 ,	request     = require('request')
 ,	entities    = require('entities')
 ,	langs       = require('./langs')
 ,	mapPathname = require('./map-pathname')
 ,	parser      = require('./parsers/autocomplete');

var router = express.Router();


router.get('/:query/:langs',
	function (res, req, next)
	{
		// process langs no what mt expects
		next();
	},
	function (res, req, next)
	{
		request(
			{
				baseUrl: 'www.multitran.ru',
				url: mapPathname.autocomplete(/*query, lang1, lang2*/),
				headers: {
					'User-Agent': 'Have to Have It'
				}
			},
			function (error, response, body)
			{
				res.json(
					parseAutocomplete(
						entities.decodeHTML(body)
					)
				);
			}
		);
	}
);

module.exports = router;