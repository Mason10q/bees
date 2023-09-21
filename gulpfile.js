const fileinclude = require('gulp-file-include');
const gulp = require('gulp');

const path = 'public/html/'

function include() {
    gulp.src([
        `${path}beesinfo.html`, 
        `${path}createapirie.html`, 
        `${path}main.html`, 
        `${path}noapirieyet.html`, 
        `${path}apiary.html`, 
        `${path}signin.html`, 
        `${path}signup.html`,
        `${path}profile.html`,
        `${path}work.html`,
        `${path}notes.html`
    ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./html/'));
    console.log("All pages included...");
}


gulp.task('fileinclude', async function() {
    include();
    console.log("File including complete!");
});