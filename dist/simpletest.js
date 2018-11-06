"use strict";
exports.__esModule = true;
var dl = require("./index");
dl.executeDL(require("../testmodlist.json"), "./mods")
    .then(function () {
    console.log("Success!");
})["catch"](function (e) {
    console.error("ERROR!");
    console.error(e);
});
