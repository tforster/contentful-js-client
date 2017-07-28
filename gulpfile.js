const gulp = require('gulp'),
  rename = require('gulp-rename'),
  watch = require('gulp-watch'),
  babili = require('gulp-babili');

  
/**
 * MINJS
 * - Minfies all JavaScript files in src/js to the root
 */
let minJs = async () => {
  return new Promise((resolve, reject) => {
    gulp.src('src/*.js')
      .on('error', reject)
      .pipe(babili({
        mangle: { keepClassNames: true }
      }))
      .pipe(rename(path => {
        path.basename += '.min'
      }))
      .pipe(gulp.dest('.'))
      .on('end', resolve);
  });
}


/**
 * COPYRESOURCES
 * - Copies resources provided in resources hash
 */
let copyResources = (resources) => {
  return Promise.all(resources.map(resource => {
    return new Promise((resolve, reject) => {
      gulp.src(resource.glob)
        .on('error', reject)
        .pipe(gulp.dest(resource.dest))
        .on('end', resolve)
    });
  }));
}


/**
 * BUILD
 * - The actual build pipeline that clears a target, compiles views, copies images and fonts, minifies and cleans up
 */
let build = async () => {
  await copyResources([
    {
      glob: ['./src/*.js'],
      dest: '.'
    }
  ]);

  await minJs();
}


/**
 * WATCH
 * - Watches src/ and automatically builds into build/dev
 */
gulp.task('watch', () => {
  // Some hacky sh!t for build and deploy needs to be cleaned up a bit
  return watch('src/**/*', () => {
    build()
      .then(() => {
        // Nothing for now
      })
      .catch(reason => {
        console.error('gulp watch failed:', reason);
      })
  });
});


/**
 * Wraps the call to the minification handler
 */
gulp.task('minJs', () => {
  return minJs()
    .then(() => {
      // Nothing for now
    })
});


/**
 * Wraps the call to the build handler
 */
gulp.task('build', () => {
  return build()
    .then(() => {
      console.log('buld succeeded')
      // Nothing for now
    })
    .catch(reason => {
      console.error('build failed:', reason)
    })
})


/** 
 * HELP
 * - Display some basic help info
 */
gulp.task('help', () => {
  console.log(`
  
  Usage: gulp <command> [options]
    
    where <command> is one of:
      minJs:   Minifies src/js/*.js to the root
      build:   Minifies src/js/*.js to the root and also copies unminified to root
      watch:   Starts a watcher on src/js and calls build() on changes

  `)
});


/**
 * DEFAULT
 * - Show the help message
 */
gulp.task('default', ['help']);

