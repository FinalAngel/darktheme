'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const sass = require('../');
const css = require('css');

const root = path.resolve(__dirname, './test-cases');
const cases = fs.readdirSync(root);

cases.forEach((test) => {
  let hasPackageJson;
  let settings = {}

  try {
    hasPackageJson = require(path.resolve(root, test, './package.json'));
  } catch (e) {}

  try {
    settings = require(path.resolve(root, test, './test-settings.json'));
  } catch (e) {}

  describe(test, () => {
    before((done) => {
      if (hasPackageJson) {
        cp.exec('npm install', { cwd: path.resolve(root, test) }, (err) => {
          done(err);
        });
      } else {
        done();
      }
    });

    it('can compile from code without error', (done) => {
      if (settings && settings.programmatic === false) {
        return done();
      }
      sass(path.resolve(root, test, './index.scss'), (err, output) => {
        css.parse(output.css.toString());
        done(err);
      });
    });

    it('can compile from cli without error', (done) => {
      if (settings && settings.cli === false) {
        return done();
      }
      cp.exec(path.resolve(__dirname, '../bin/npm-sass') + ' index.scss', {
        cwd: path.resolve(root, test)
      }, (err, stdout) => {
        css.parse(stdout);
        done(err);
      });
    });

    try {// to load test cases from within test case
      assertions = require(path.resolve(root, test, './test'));
    } catch (e) {}
  });
});
