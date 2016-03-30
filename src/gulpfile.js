var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('jade', function ()
{
	return gulp.src('jade/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('../dist'));
});

gulp.task('css', function ()
{
	return gulp.src('css/*.css')
		.pipe(gulp.dest('../dist/css'));
});

gulp.task('js', function ()
{
	return gulp.src('js/*.js')
		.pipe(gulp.dest('../dist/js'));
});