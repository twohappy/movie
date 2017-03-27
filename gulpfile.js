const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const pug = require('gulp-pug');
const eslint = require('eslint');

gulp.task('develop',function () {
    let stream = nodemon({
        script: 'index.js',
        ext: 'js json pug',
        env: {
            'NODE_ENV': 'development',
            'PORT':'3000'
        },
        verbose:true,
        ignore:[
            ".git",
            "node_modules/"
        ]
    });
    // stream
    //     .on('start',function () {
    //         browserSync.init({
    //             proxy:'localhost:6666'
    //         })
    //     })
});

gulp.task('default', ['develop']);