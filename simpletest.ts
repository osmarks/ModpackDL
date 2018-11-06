import * as dl from "./index";

dl.executeDL(require("../testmodlist.json"), "./mods")
  .then(() => {
    console.log("Success!")
  })
  .catch(e => {
    console.error("ERROR!")
    console.error(e);
  });
