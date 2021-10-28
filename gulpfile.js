var syntax        = 'sass'; 

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: '_site'
		},
		notify: false
		// open: false
		// online: false, // Work Offline Without Internet Connection
	})
});

gulp.task('styles', function() {
	return gulp.src(syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expend' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('css'))
	.pipe(gulp.dest('_site/css'))
	.pipe(browserSync.reload( {stream: true} ))
});

gulp.task('scripts', function() {
	return gulp.src([
		'libs/jquery/dist/jquery.min.js',
		'libs/animate/animate-css.js',
		'libs/waypoints/waypoints.min.js',
		'libs/modernizr/modernizr.js',
		'libs/equalHeights/equalHeights.min.js',
		'libs/Magnific-Popup/jquery.magnific-popup.min.js',
		'libs/prognroll/prognroll.js',
		'js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('js'))
	.pipe(gulp.dest('_site/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('_site/**')
	.pipe(rsync({
		root: '_site/',
		hostname: 'kasseta136@alexa-group.ru',
		destination: 'Alexa-Group_ru/public_html/',
		include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', function() {
	gulp.watch(+syntax+'/**/*.'+syntax+'', { usePolling: true }, gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'js/common.js'], { usePolling: true }, gulp.parallel('scripts'));
	gulp.watch('*.html', { usePolling: true }, browserSync.reload);
});
gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));
