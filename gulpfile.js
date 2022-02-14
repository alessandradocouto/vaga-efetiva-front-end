'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const mode = require('gulp-mode')();
const browserSync = require('browser-sync').create();
const del = require('del');


function sassTocss() {
    return gulp.src('src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe( sass())
        .pipe( postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css/'))

}

function miniUniqueCss(){
    return gulp.src('build/css/*.css')
        .pipe(mode.production(concat('style.css')))
        .pipe(mode.production(postcss([ cssnano({
            autoprefixer:{
                browsers: ['> 1%', 'last 1 version'],
                add: true
            }
        }) ])))
        .pipe(gulp.dest('production/build/css/'))
};

function miniHtml(){
    return gulp.src(['index.html'])
        .pipe(mode.production(htmlmin({collapseWhitespace: true, removeComments: true })))
        .pipe(gulp.dest('production/'));
};

function miniJs(){
    return gulp.src('src/js/*.js')
        .pipe(mode.production(babel({
            presets: [
                ["env", {
                    "targets": {
                        "browsers":['> 1%', 'last 1 version']
                    }
                }]
            ]
        })))
        .pipe(mode.production(uglify()))
        .pipe(gulp.dest('production/src/js/'))
}

function copyImage() {
    return gulp.src('layout/assets/*.{png,jpg,jpeg,svg,gif}')
        .pipe(gulp.dest('production/layout/assets/'))
};
  

function cleanFolder(){
    return del('production', { force: true})
}


function browserSyncServe(done){
    browserSync.init({
    server: {
        baseDir: '.'
    }    
    });
    done();
}

function browserSyncReload(done){
    browserSync.reload();
    done();
}


function dev() {
    gulp.watch('src/scss/**/*.scss', sassTocss);
    gulp.watch('index.html', browserSyncReload);
}


exports.default = gulp.series(cleanFolder, sassTocss, dev, browserSyncServe);
exports.build = gulp.series(cleanFolder,copyImage, miniUniqueCss, miniHtml, miniJs);
