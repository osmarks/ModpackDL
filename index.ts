const fs = require("fs")
const rmrf = require("rimraf")
const request = require("request")
const path = require("path")
const progress = require("cli-progress")
const requestProgress = require("request-progress")
const prefix = require("prefix-si").prefix
const promisify = require("es6-promisify").promisify

const generateFilename = ({name, version}) => `${name} [${version}].jar`

const download = (url, filename) => {
  if (url === null || url === "IGNORE") {
    console.log(`Not downloading ${filename}.`)
    return
  }
}

const formatBytes = b => prefix(b, "B")

const rename = promisify(fs.rename)
const readdir = promisify(fs.readdir)

export const executeDL = async (modData, root) => {
  const mods = modData.mods;
  // Keep files matching a mod we want
  const keep = mods.map(generateFilename)

  const alreadyDownloaded = []
  const contents = await readdir(root)
  for (const file of contents) {
    // If modlist contains this file, then keep it & add it to already downloaded list
    if (keep.includes(file)) {
      console.log(`File ${file} already downloaded.`)
      alreadyDownloaded.push(file)
    } else {
      // Delete it otherwise
      console.log(`File ${file} not recognized; deleting.`)
      await promisify(rmrf)(path.join(root, file))
    }
  }

  for (const mod of mods) {
    const filename = generateFilename(mod)
    // If mod not already downloaded, download it
    if (!alreadyDownloaded.includes(filename)) {
      const finalPath = path.join(root, filename)
      const tempPath = finalPath + ".temp" // download to temp file
      const file = fs.createWriteStream(tempPath)

      // Generate progress bar
      const bar = new progress.Bar({
        format: `{bar} | ${mod.name} | {percentage}% | {eta}s | {pos}/{size} | {speed}/s`,
        etaBuffer: 20
      }, progress.Presets.shades_classic)

      let len // we need to use this value in multiple handlers

      requestProgress(request(mod.url))
        .on("response", response => {
          len = parseInt(response.headers['content-length'], 10)
          bar.start(len, 0, {
            speed: "N/A",
            size: formatBytes(len),
            pos: formatBytes(0)
          })
        })
        .on("progress", prog => {
          // Update bar with new values
          bar.update(prog.size.transferred, {
            speed: formatBytes(prog.speed),
            pos: formatBytes(prog.size.transferred)
          })
        })
        .pipe(file)

      // Wait until download complete
      await new Promise(resolve => file.on("finish", resolve))
      bar.update(len, {
        pos: formatBytes(len)
      }) // set bar to end
      bar.stop()

      await rename(tempPath, finalPath)
    }
  }

  console.log(`Mod download complete.`)
  const forge = modData.forgeVersion || modData.forge
  if (forge) {
    console.log(`The modpack recommends Forge version ${forge}.`)
  }
}