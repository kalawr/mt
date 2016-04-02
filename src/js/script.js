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
	var tree = Autocomplete.makeMany([]);
	var node = virtualDom.create(tree);
	document.querySelector('.container').appendChild(node);
	this.node = node;
	this.previousTree = tree;
	return node;
};

// ---










// result.js

var Result = {};

Result.make = function (list)
{
	var _this = this;

	return h(
		'dl#result.result',
		list.result.map(
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
					h(
						'span.part-of-speech',
						', ' + group.partOfSpeech
					)
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
	var tree = Result.make({ result: [] });
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
	if (false)
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

	log('input');
});

form.on('submit', function (event)
{
	event.preventDefault();

	if (false)
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