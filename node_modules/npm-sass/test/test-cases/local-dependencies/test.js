const path = require('path');
const cp = require('child_process');

const css = require('css');

const expect = require('chai').expect;

describe('css rules', () => {
  it('are correctly created', (done) => {
    cp.exec(path.resolve(__dirname, '../../../bin/npm-sass') + ' index.scss', {
        cwd: __dirname
      }, (err, stdout) => {
        const parsed = css.parse(stdout);
        expect(parsed.stylesheet.rules.length).to.equal(2);
        expect(parsed.stylesheet.rules[0].declarations[0].property).to.equal('color');
        expect(parsed.stylesheet.rules[0].declarations[0].value).to.equal('blue');
        expect(parsed.stylesheet.rules[0].selectors[0]).to.equal('div a');
        expect(parsed.stylesheet.rules[1].selectors[0]).to.equal('div p');
        expect(parsed.stylesheet.rules[1].declarations[0].property).to.equal('color');
        expect(parsed.stylesheet.rules[1].declarations[0].value).to.equal('red');
        done(err);
      });
  });
});
