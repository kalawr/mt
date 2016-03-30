var gulp = require('gulp');
var jade = require('gulp-jade');


var cssLibs = [
	'bower_components/normalize-css/normalize.css'
];

var jsLibs = [
	'bower_components/jquery/dist/jquery.min.js'
];


gulp.task('jade', function ()
{
	return gulp.src('jade/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('../public'));
});


gulp.task('css', function ()
{
	return gulp.src('css/*.css')
		.pipe(gulp.dest('../public/css'));
});

gulp.task('css-watch', function ()
{
	return gulp.watch('css/*.css', ['css']);
});

gulp.task('css-pick-libs', function ()
{
	return gulp.src(cssLibs)
		.pipe(gulp.dest('../public/css/lib'));
});


gulp.task('js', function ()
{
	return gulp.src('js/*.js')
		.pipe(gulp.dest('../public/js'));
});

gulp.task('js-watch', function ()
{
	return gulp.watch('js/*.js', ['js']);
});

gulp.task('js-pick-libs', function ()
{
	return gulp.src(jsLibs)
		.pipe(gulp.dest('../public/js/lib'));
});


gulp.task('default', ['jade', 'css', 'js']);