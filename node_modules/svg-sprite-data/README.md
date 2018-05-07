svg-sprite-data
===============

An attempt to make the [svg-sprite](https://github.com/jkphl/svg-sprite) lib work on strings only which 
will allow everyone to create their own awesome libs on top of it.

The idea is to remove ALL file-system access and leave all that to the authors who create tools on top of this. So, this
module only has a couple of methods, only accepts strings & only returns data - it never touches anything on the file-system.

##Usage

```js
var SpriteData = require("svg-sprite-data");
var fs  = require("fs");

var config = {
    common: "icon",
    dims: true,
    layout: "diagonal",
    render: {
        css: true
    }
};

// Create instance
var spriter = new SpriteData(config);

// Read a file however you like
var path = "./test/fixtures/fb.svg";
var svg  = fs.readFileSync(path, "utf-8");

// Add the files CONTENTS only.
spriter.add(path, svg).compile(function (err, svg) {

    // Do crazy-ass shit with templates etc
    console.log(svg);

});
```

