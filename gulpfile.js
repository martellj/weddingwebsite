var gulp = require('gulp');

gulp.task("app", function () {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('./public/'));
    gulp.src('./app/*/*.*')
        .pipe(gulp.dest('./public/'));

});

gulp.task('default', ['app']);