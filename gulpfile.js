'use strict';

const gulp = require('gulp'),
    scss = require('gulp-sass'),
    server = require('browser-sync').create(),
    autoprefixer = require('autoprefixer'),
    minify = require("gulp-csso"),
    imagemin = require("gulp-imagemin"),
    postcss = require("gulp-postcss"),
    posthtml = require("gulp-posthtml"),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    webp = require("gulp-webp"),
    //run = require("run-sequence"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    include = require("posthtml-include");


gulp.task('html', function() {
   return gulp.src('source/*.html')
   .pipe(posthtml([
       include()
   ]))
   .pipe(gulp.dest('build/'));

});

gulp.task('style', function() {
    return gulp.src('source/scss/style.scss')
    .pipe(plumber())
    .pipe(scss())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(gulp.dest('build/css/'))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
})

gulp.task("images", function () {
    return gulp.src("build/img/**/*.{png,jpg,svg}")
      .pipe(imagemin([
        imagemin.optipng({
          optimizationLevel: 3
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.svgo()
      ]))
      .pipe(gulp.dest("build/img"));
  });
  
  gulp.task("webp", function () {
    return gulp.src("source/img/**/*.{png,jpg}")
      .pipe(webp({
        quality: 90
      }))
      .pipe(gulp.dest("build/img"));
  
  });

  gulp.task("copy", function () {
    return gulp.src([
        "source/img/**",
        "source/js/**",
        "source/*.html",
        "source/font/**/*.{woff,woff2}"
      ], {
        base: "source"
      })
      .pipe(gulp.dest("build"));
  });
  
  gulp.task("clean", function () {
    return del("build");
  });
  
  gulp.task("js", function () {
    return gulp.src(["source/js/*.js", "!js/*.min.js"])
      .pipe(uglify())
      .pipe(rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest("build/js"))
  });


 gulp.task("serve",  function() {
    server.init({
        server: "build/"
    });
      
    gulp.watch("source/scss/**/*.scss", gulp.series("style"));
    gulp.watch("source/*.html", gulp.series("html", "refresh"));
    });

gulp.task("refresh", function (done) {
  server.reload();
    done();
  });
      
gulp.task("build", gulp.series(
  "clean",
  "copy",
  "style",
  "images",
  "webp",
  "js",
  "html",
));
      
gulp.task("start", gulp.series("build", "serve"));