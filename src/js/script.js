"use strict";

// helpers.js
function log(x)
{
	console.log(x);
}
// ---







// url.js
var Url = {};

Url.range = function (query, languages)
{
	return '/tr?' +
		'type=' +
		'range' +
		'&langs=' +
		languages +
		'&query=' +
		query;
};

Url.single = function (query, languages)
{
	return '/tr?' +
		'type=' +
		'singe' +
		'&langs=' +
		languages +
		'&query=' +
		query;
};
// ----








// hint.js
var Hint = {};
var h = virtualDom.h;

Hint.makeMany = function (array)
{
	var _this = this;

	return h(
		'ul.hint',
		array.map(
			function (element) 
			{
				return _this.makeOne(element);
			}
		)
	);
};

Hint.makeOne = function (text)
{
	return h(
		'li',
		String(text)
	);
};

Hint.render = function (targetTree)
{
	var patches = virtualDom.diff(this.previousTree, targetTree);
	this.node = virtualDom.patch(this.node, patches);
	this.previousTree = targetTree;
};

Hint.init = function ()
{
	var tree = Hint.makeMany([]);
	var node = virtualDom.create(tree);
	document.body.appendChild(node);
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
		'dl#result',
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
	document.body.appendChild(node);
	this.node = node;
	this.previousTree = tree;
	return node;
};

// ---

var form = jQuery('#search')
 ,	query = jQuery('#query')
 ,	langs = jQuery('#langs');

Hint.init();
Result.init();


// form.on('input', function (event)
// {
// 	// in case of an input event
// 	jQuery
// 		.getJSON( Url.range(query.val(), langs.val()) )
// 		// .then(log)
// 		.always(function (list)
// 		{
// 			if (list.length > 0)
// 				Hint.paste(hint, Hint.makeMany(list));
// 		})
// 		;
// });

// form.on('submit', function (event)
// {
// 	event.preventDefault();
// 	// in case of a submit event
// 	jQuery
// 		.getJSON( Url.single(query.val(), langs.val()) )
// 		// .then(log)
// 		.always(function (list)
// 		{
// 			if (list.length > 0)
// 				Result.paste(result, Result.make(list));
// 		})
// 		;
// });

jQuery(document).ready(function ()
{
	jQuery
		.getJSON('/samples/result.json')
		.then(function (list)
		{
			if (list)
				Result.render(Result.make(list));
		})
		;
});