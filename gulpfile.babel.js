// ================================================================
// IMPORTS
// ================================================================
import gulp from 'gulp';
import changed from 'gulp-changed';
import livereload from 'gulp-livereload';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import scss from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import minifyCSS from 'gulp-cssnano';
import plumber from 'gulp-plumber';
import sequence from 'run-sequence';
// import spritesmith from 'gulp.spritesmith';

// ================================================================
// CONSTS
// ================================================================
const ENV = {
  development: true,
  production: false,
};

const PATH = {
  src: {
    styles: [
      'scss/main.scss',
    ],

    js: {
      vendors: [
        'js/vendors/jquery-2.2.4.min.js',
        // 'front/js/vendors/cookie.js',
      ],

      pages: [
        'js/components/catalog.es6',
        'js/components/category.es6',
        'js/components/product.es6',
        'js/components/series.es6',
      ],

      common: [
        'js/shared/*.es6',
        'js/components/main.es6',
      ],
    },

    images: [
      'images/**/*',
      '!images/spriteSrc{,/**}',
    ],
    fonts: 'fonts/**/*',
  },

  build: {
    styles: 'build/css/',
    js: 'front/build/js/',
    images: 'front/build/images/',
    fonts: 'front/build/fonts/',
  },

  watch: {
    styles: 'scss/**/*.scss',
    js: 'front/js/**/*',
    images: 'front/src/images/**/*',
    fonts: 'front/src/fonts/**/*',
    html: 'templates/**/*',
  },
};

// ================================================================
// BUILD
// ================================================================
gulp.task('build', callback => {
  ENV.development = false;
  ENV.production = true;

  sequence(
    'styles',
    // 'js-vendors',
    // 'js-common',
    // 'js-pages',
    // 'images',
    // 'fonts',
    callback
  );
});

// ================================================================
// STYLES : Build all stylesheets
// ================================================================
gulp.task('styles', () => {
  gulp.src(PATH.src.styles)
    .pipe(changed(PATH.build.styles, { extension: '.css' }))
    .pipe(gulpIf(ENV.development, sourcemaps.init()))
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(scss())
    .pipe(gulpIf(ENV.production, autoprefixer({
      browsers: ['last 3 versions'],
    })))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulpIf(ENV.production, minifyCSS()))
    .pipe(gulpIf(ENV.development, sourcemaps.write('.')))
    .pipe(gulp.dest(PATH.build.styles))
    .pipe(livereload());
});

// ================================================================
// JS : Build common vendors js only
// ================================================================
gulp.task('js-vendors', () => {
  gulp.src(PATH.src.js.vendors)
    .pipe(changed(PATH.build.js, {extension: '.js'}))
    .pipe(concat('vendors.js'))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.build.js));
});

// ================================================================
// JS : Build common scripts
// ================================================================
gulp.task('js-common', () => {
  gulp.src(PATH.src.js.common)
    .pipe(changed(PATH.build.js, {extension: '.js'}))
    .pipe(gulpIf(ENV.development, sourcemaps.init()))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('main.js'))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulpIf(ENV.production, uglify()))
    .pipe(gulpIf(ENV.development, sourcemaps.write('.')))
    .pipe(gulp.dest(PATH.build.js))
    .pipe(livereload());
});

// ================================================================
// JS : Build all pages scripts
// ================================================================
gulp.task('js-pages', () => {
  gulp.src(PATH.src.js.pages)
    .pipe(changed(PATH.build.js, {extension: '.js'}))
    .pipe(gulpIf(ENV.development, sourcemaps.init()))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('pages.js'))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulpIf(ENV.production, uglify()))
    .pipe(gulpIf(ENV.development, sourcemaps.write('.')))
    .pipe(gulp.dest(PATH.build.js))
    .pipe(livereload());
});

// ================================================================
// Images : Copy images
// ================================================================
gulp.task('images', () => {
  return gulp.src(PATH.src.images)
    .pipe(changed(PATH.build.images))
    .pipe(gulp.dest(PATH.build.images));
});

// ================================================================
// Fonts : Copy fonts
// ================================================================
gulp.task('fonts', () => {
  return gulp.src(PATH.src.fonts)
    .pipe(changed(PATH.build.fonts))
    .pipe(gulp.dest(PATH.build.fonts));
});

// ================================================================
// WATCH
// ================================================================
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(PATH.watch.styles, ['styles']);
  // gulp.watch(PATH.watch.js, ['js-common', 'js-pages']);
  // gulp.watch(PATH.watch.images, ['images']);
  // gulp.watch(PATH.watch.html, livereload.changed);
});

// ================================================================
// DEFAULT
// ================================================================
gulp.task('default', ['watch']);
