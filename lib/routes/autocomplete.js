var express     = require('express')
 ,	request     = require('request')
 ,	entities    = require('entities')
 ,	langs       = require('../middleware/langs')
 ,	mapPathname = require('../map-pathname')
 ,	parser      = require('../parsers/autocomplete');

var router = express.Router();


router.get('/:query/:langs', langs);
router.get('/:query/:langs',
	function (req, res, next)
	{
		request(
			{
				baseUrl: 'http://www.multitran.ru',
				url: mapPathname.autocomplete(encodeURIComponent(req.params.query), req.mt.langs[0], req.mt.langs[1]),
				headers: {
					'User-Agent': 'Have to Have It'
				}
			},
			function (error, response, body)
			{
				res.json(
					parser.parse(
						entities.decodeHTML(body)
					)
				);
			}
		);
	}
);

module.exports = router;