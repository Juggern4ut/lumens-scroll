/* Base Module */
const gulp = require("gulp");

/* Babel - Used for converting ES6 to ES5 */
const babel = require("gulp-babel");

/* SASS - Used for converting SASS to CSS */
const sass = require("gulp-sass");

/* CSSO - Used to minify CSS */
const minifyCSS = require("gulp-csso");

/* Concat - Used to merge multiple files together */
const concat = require("gulp-concat");

/* Sourcemaps - Used to generate sourcemaps*/
const sourcemaps = require("gulp-sourcemaps");

/* PostCSS - Used to use certain modules on the CSS after converting from SASS to CSS */
const postcss = require("gulp-postcss");

/* Autoprefixer - Used with PostCSS to apply vendor-prefixes to CSS */
const autoprefixer = require("autoprefixer");

/* Uglify - Used to minify JavaScript */
const minifyJS = require("gulp-uglify");

function css() {
  var plugins = [autoprefixer()];
  return gulp
    .src(["./sass/main.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write("../maps"))
    .pipe(gulp.dest("./dist/css"));
}

function js() {
  return gulp
    .src(["./js/**/*.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: [["@babel/env", { modules: false }]]
      })
    )
    .pipe(concat("app.min.js"))
    .pipe(minifyJS())
    .pipe(sourcemaps.write("../maps"))
    .pipe(gulp.dest("./dist/js"));
}

exports.default = function() {
  gulp.watch("./sass/**/*.scss", css);
  gulp.watch("./js/**/*.js", js);
};
