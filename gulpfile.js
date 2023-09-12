const fileinclude = require('gulp-file-include');
const gulp = require('gulp');

function includeMainHeader() {
    gulp.src(['public/html/beesinfo.html', 'public/html/main.html', 'public/html/signin.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./html/'));
    console.log("Main header page included...");
}