"use strict";

// helpers.js
function log(x)
{
	console.log(x);
}
// ---







// url.js
var Url = {};

Url.autocomplete = function (query, languages)
{
	return '/autocomplete' +
		'/' +
		String(query) +
		'/' +
		String(languages);
};

Url.translate = function (query, languages)
{
	return '/translate' +
		'/' +
		String(query) +
		'/' +
		String(languages);
};
// ----








// autocomplete.js
var Autocomplete = {};
var h = virtualDom.h;

Autocomplete.initial = [];

Autocomplete.makeMany = function (array)
{
	var _this = this;

	return h(
		'ul.autocomplete',
		array.map(
			function (element) 
			{
				return _this.makeOne(element);
			}
		)
	);
};

Autocomplete.makeOne = function (text)
{
	return h(
		'li',
		String(text)
	);
};

Autocomplete.render = function (targetTree)
{
	var patches = virtualDom.diff(this.previousTree, targetTree);
	this.node = virtualDom.patch(this.node, patches);
	this.previousTree = targetTree;
};

Autocomplete.init = function ()
{
	var tree = Autocomplete.makeMany(Autocomplete.initial);
	var node = virtualDom.create(tree);
	document.querySelector('.container').appendChild(node);
	this.node = node;
	this.previousTree = tree;
	return node;
};

// ---










// result.js

var Result = {};

Result.initial = [];

Result.make = function (list)
{
	var _this = this;

	return h(
		'dl#result.result',
		list.map(
			function (entry)
			{
				return _this.makeDefinitionGroup(entry);
			}
		)
	);
};

Result.makeDefinitionGroup = function (group)
{
	var _this = this;

	return h(
		'.definition',
		[
			h(
				'dt',
				[
					group.variant,
					_this.partOfSpeech(group)
				]
			),
			group.domains.map(
				function (domain)
				{
					return _this.makeDomainGroup(domain);
				}
			)
		]
	);
};

Result.partOfSpeech = function (group)
{
	if (group.partOfSpeech)
	{
		return h(
			'span.part-of-speech',
			', ' + group.partOfSpeech
		);
	}
	else
	{
		return null;
	}
};

Result.makeDomainGroup = function (group)
{
	var _this = this;

	return h(
		'.domain',
		[
			h(
				'.domain-name',
				String(group.domain)
			),

			group.translations.map(
				function (translation)
				{
					return _this.makeTranslation(translation);
				}
			)
		]
	);
};

Result.makeTranslation = function (value)
{
	return h(
		'dd',
		String(value)
	);
};

Result.render = function (targetTree)
{
	var patches = virtualDom.diff(this.previousTree, targetTree);
	this.node = virtualDom.patch(this.node, patches);
	this.previousTree = targetTree;
};

Result.init = function ()
{
	var tree = Result.make(Result.initial);
	var node = virtualDom.create(tree);
	document.querySelector('.container').appendChild(node);
	this.node = node;
	this.previousTree = tree;
	return node;
};

// ---

var form = jQuery('#search')
 ,	query = document.getElementById('query')
 ,	langs = document.getElementById('langs');

Autocomplete.init();
Result.init();


form.on('input', function (event)
{
	if (event.target.value)
	{
		jQuery
			.getJSON( Url.autocomplete(query.value, langs.value))
			.then(function (list)
			{
				if (list)
					Autocomplete.render(Autocomplete.makeMany(list));
			})
			;
	}
	else
	{
		Autocomplete.render(Autocomplete.makeMany(Autocomplete.initial));
	}

	log('input');
});

form.on('submit', function (event)
{
	event.preventDefault();

	if (true)
	{
		jQuery
			.getJSON( Url.translate(query.value, langs.value))
			.then(function (list)
			{
				if (list)
					Result.render(Result.make(list));
			})
			;
	}

	log('submit');
});


// showing/hiding button

var ok = jQuery('#ok');

var OkButton = {};

OkButton.show = function ($el)
{
	$el.removeClass('out');
};

OkButton.hide = function ($el)
{
	$el.addClass('out');
};

form.on('input', function (event)
{
	if (event.target.value)
	{
		OkButton.show(ok);
	}
	else
	{
		OkButton.hide(ok);
	}
});

// ---

// arrows.js
var upCode   = 38;
var downCode = 40;
var escCode  = 27;


form.keydown(interceptUp);
form.keydown(interceptDown);
form.keydown(interceptEsc);

function interceptEsc(event)
{
	if (event.keyCode == escCode)
	{
		event.preventDefault();
		jQuery('.autocomplete li.active').removeClass();
	}
}

function interceptUp(event)
{
	if (event.keyCode == upCode)
	{
		event.preventDefault();

		if (jQuery('.autocomplete li.active').length > 0)
		{
			if (jQuery('.autocomplete li.active').is(':first-child'))
			{
				jQuery('.autocomplete li.active').removeClass();
				jQuery('.autocomplete li').last().addClass('active');
			}
			else
			{
				jQuery('.autocomplete li.active').removeClass().prev().addClass('active');
			}
		}
		else
		{
			jQuery('.autocomplete li').last().addClass('active');
		}
	}
}

function interceptDown(event)
{
	if (event.keyCode == downCode)
	{
		event.preventDefault();

		if (jQuery('.autocomplete li.active').length > 0)
		{
			if (jQuery('.autocomplete li.active').is(':last-child'))
			{
				jQuery('.autocomplete li.active').removeClass('active');
				jQuery('.autocomplete li').first().addClass('active');
			}
			else
			{
				jQuery('.autocomplete li.active').removeClass('active').next().addClass('active');
			}
		}
		else
		{
			jQuery('.autocomplete li').first().addClass('active');
		}
	}
}

// ---