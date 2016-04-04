var gulp = require('gulp');
var jade = require('gulp-jade');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var vars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');

var cssLibs = [
	'bower_components/normalize-css/normalize.css'
];

var jsLibs = [
	'bower_components/jquery/dist/jquery.min.js',
	'bower_components/virtual-dom/dist/virtual-dom.js'
];

var dest = '../app/public';

gulp.task('jade', function ()
{
	return gulp.src('jade/*.jade')
		.pipe(jade())
		.pipe(gulp.dest(dest));
});


gulp.task('css', function ()
{
	return gulp.src('css/main.css')
		.pipe(postcss([postcssImport, autoprefixer, vars]))
		.pipe(gulp.dest(dest+'/css'));
});

gulp.task('css-watch', ['css'], function ()
{
	return gulp.watch('css/*.css', ['css']);
});

gulp.task('css-pick-libs', function ()
{
	return gulp.src(cssLibs)
		.pipe(gulp.dest(dest+'/css/lib'));
});


gulp.task('js', function ()
{
	return gulp.src('js/*.js')
		.pipe(gulp.dest(dest+'/js'));
});

gulp.task('js-watch', ['js'], function ()
{
	return gulp.watch('js/*.js', ['js']);
});

gulp.task('js-pick-libs', function ()
{
	return gulp.src(jsLibs)
		.pipe(gulp.dest(dest+'/js/lib'));
});


gulp.task('default', ['jade', 'css', 'js', 'css-pick-libs', 'js-pick-libs']);