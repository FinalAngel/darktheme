var SpriteData = require("./index");
var XMLObject = require("./lib/xmlobject");
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
// var path = "./test/fixtures/xml.xml";
// var path = "./test/fixtures/hamburger.svg";
var svg  = fs.readFileSync(path, "utf-8");
// var obj = new XMLObject(svg);

// console.log(obj.toString());

// var res;

// obj.root().attr()
// obj.root().attr('width')
// obj.root().attr('width', 299)
// obj.root().attr({'width': 299})

// res = obj.find('@width').forEach(function(node){
//   console.log(node.value());

//   node.value('984723984723897489237489237489px');
// });

// res.value('500000000000000000px');


// obj.log();
// console.log(res);

// Add the files CONTENTS only.
spriter.add(path, svg).compile(function (err, svg) {

    //Do crazy-ass shit with templates etc
    console.log(svg);

});
