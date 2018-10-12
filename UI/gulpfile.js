var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var watchify = require('watchify');
var ngannotate = require('browserify-ngannotate');
var plugins = require('gulp-load-plugins')({
    lazy: false
});
var replace = require('gulp-replace');
var notify = require('gulp-notify');
var merge = require('utils-merge');
var vinylBuffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var gulpSass = require('gulp-sass');


// gulp.task('scripts', function() {
//     var source = './source/app.js';
//
//     var sources = browserify({
//         entries: source,
//         debug: false // Build source maps
//     }).transform(babelify.configure({
//         // You can configure babel here!
//         // https://babeljs.io/docs/usage/options/
//         presets: ["es2015"]
//     }));
//
//     return sources.bundle()
//         .pipe(vinylSourceStream('main.min.js'))
//         .uglify()
//         .pipe(gulp.dest('./output/scripts/'));
// })
//

// gulp.task('copyfonts', ['glyphicon'], function() {
//     return gulp.src(src.fonts)
//         .pipe(gulp.dest(build + 'css/'))
// });

// gulp.task('data', function() {
//     return gulp.src(src.data)
//         .pipe(gulp.dest(build + '/data'))
// });
//
// gulp.task('configJson', function() {
//     return gulp.src(src.configJson)
//         .pipe(gulp.dest(build))
//     //.pipe(plugins.connect.reload());
// });
//
//
gulp.task('css', function () {
    return gulp.src('./source/public/style.scss')
            .pipe(gulpSass().on('error', gulpSass.logError))
        // .pipe(stylus({
        //     use: nib(),
        //     import: ['nib']
        // }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('output/css/'));
});

gulp.task('lint', function() {
    return gulp.src('./source/public/**/*.js')
        .pipe(eslint({
            configFile: 'eslint.json'
        }))
        .pipe(eslint.format())
    //.pipe(eslint.failAfterError());
});

gulp.task('html-dev', function() {
    var timestamp = new Date().getTime();
    return gulp.src('source/public/**/*.html')
        .pipe(replace('<TIMESTAMP>', timestamp))
        .pipe(replace('<BASE_URL>', '/output/'))
        .pipe(gulp.dest('output/'));
    //.pipe(plugins.connect.reload());
});


/* Compile all script files into one put minified JS file. */
gulp.task('scripts-dev', ['lint'], function() {

    var args = merge(watchify.args, {
        debug: true
    });
    var sourceApp = './source/public/app.js';
    var sources = browserify(sourceApp, args)
        .plugin(watchify, {
            ignoreWatch: ['**/node_modules/**', '**/bower_components/**']
        })
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
            presets: ["es2015"]
        }))
        .transform(ngannotate)
        .on('update', function() {
            bundle(sources); // Re-run bundle on source updates
        });

    return bundle(sources);
});


// Completes the final file outputs
function bundle(bundler) {
    return bundler.bundle()
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(vinylSourceStream('main.min.js'))
        .pipe(vinylBuffer())
        .pipe(plugins.sourcemaps.init({
            loadMaps: true // Load the sourcemaps browserify already generated
        }))
        .pipe(plugins.sourcemaps.write('./', {
            includeContent: true
        }))
        .pipe(gulp.dest('./output/scripts/'))
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        }));
}

gulp.task('default', ['scripts-dev','html-dev', 'css']);
