const path = require('path');
const cp = require('child_process');

const sass = require('../../../');
const css = require('css');

const expect = require('chai').expect;

describe('aliases', () => {
  it('are correctly followed', (done) => {
    const aliases = {
      '$alias': './foo.scss'
    };
    sass(path.resolve(__dirname, './index.scss'), { aliases }, (err, output) => {
      const parsed = css.parse(output.css.toString());
      expect(parsed.stylesheet.rules[0].declarations[0].property).to.equal('color');
      expect(parsed.stylesheet.rules[0].declarations[0].value).to.equal('magenta');
      expect(parsed.stylesheet.rules[0].selectors[0]).to.equal('div a');
      done(err);
    });
  });
});
