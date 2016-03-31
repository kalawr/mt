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

// Takes an array of strings.
Hint.makeMany = function (list)
{
	var ul = document.createElement('ul');

	list.forEach(
		function (element)
		{	ul.appendChild(this.makeOne(element));
		}, 
		this
	);

	return ul;
};

// Takes a string.
Hint.makeOne = function (element)
{
	var li = document.createElement('li');
	li.textContent = element;
	return li;
};

Hint.paste = function (container, content)
{
	// Remove container's only child if necessary.
	if (container.children.length > 0)
		container.removeChild(container.children[0]);

	container.appendChild(content);
};
// ---

// result.js
var h = virtualDom.h;

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
}

// ---

var form = jQuery('#search')
 ,	query = jQuery('#query')
 ,	langs = jQuery('#langs')
 ,	hint = jQuery('#hint')[0];
 
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