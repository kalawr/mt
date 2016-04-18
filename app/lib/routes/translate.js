var express     = require('express')
 ,	HTTP        = require('http')
 ,	iconv       = require('iconv-lite')
 ,	langs       = require('../middleware/langs')
 ,	mapPathname = require('../map-pathname')
 ,	parser      = require('../parsers/translate')
 ,	notFound    = require('../routes/404');

var router = express.Router();

router.get('/:query/:langs', langs);
router.get('/:query/:langs', 
	function (req, res, next)
	{
		HTTP.get(
			{
				hostname: 'www.multitran.ru',
				path: mapPathname.translate(encodeURIComponent(req.params.query), req.mt.langs[0], req.mt.langs[1]),
				headers: {
					'User-Agent': 'Have to Have It'
				}
			},
			function (response)
			{
				response
					.pipe(iconv.decodeStream('win1251'))
					.collect(
						function (err, body) 
						{
							var result = parser.parse(body);

							result.length ? res.json(result) : next();
						}
					);
			}
		);
	}
);
router.use(notFound);

module.exports = router;