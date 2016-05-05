var express = require('express');
var path    = require('path');
var config  = require('../../config');

var router = express.Router();

router.get('*', function (req, res, next)
{
	res.sendFile(path.join(config.root, 'index.html'));
});

module.exports  = router;
