const argv = require('minimist')(process.argv.slice(2));
const gulp = require('gulp');

const PROJECT_ROOT = __dirname;
const PROJECT_PATH = {
    css: PROJECT_ROOT + '',
    sass: PROJECT_ROOT + '/src/sass',
    webpack: PROJECT_ROOT + '/src/js',
};
const PROJECT_PATTERNS = {
    js: [
        '*.js',
        './src/tasks/**/*.js',
        PROJECT_PATH.webpack + '*.config.js',
        PROJECT_PATH.webpack + '/**/*.js',
    ],
    sass: [
        PROJECT_PATH.sass + '/**/*.{scss,sass}',
    ],
};

/**
 * Generic utility to import gulp tasks and pass options to them
 *
 * @param {String} id - task name
 * @param {Object} [extra] - optional options to pass
 * @returns {Function} - task definition
 */
function task(id, extra) {
    return require('./src/tasks/' + id)(
        gulp,
        Object.assign(
            {
                PROJECT_ROOT: PROJECT_ROOT,
                PROJECT_PATH: PROJECT_PATH,
                PROJECT_PATTERNS: PROJECT_PATTERNS,
                argv: argv,
            },
            extra
        )
    );
}

gulp.task('sass', task('sass'));
gulp.task('webpack', task('webpack'));
gulp.task('webpack:watch', task('webpack', { watch: true }));
gulp.task('lint', task('lint'));

gulp.task('default', ['sass', 'webpack', 'watch']);

gulp.task('watch', function () {
    gulp.start('webpack:watch');
    gulp.watch(PROJECT_PATTERNS.sass, ['sass']);
    gulp.watch(PROJECT_PATTERNS.js, ['lint']);
});
