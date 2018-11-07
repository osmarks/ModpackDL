# ModpackDL
A simple minecraft modpack downloader.

## Modpack
The Modpack object should be an object with this structure:
~~~~json
{
	forgeVersion: "16.45.23282"
	mods: [
		{
			name: "ModName"
			version: "1.7.10"
			url: "http://example.org"
		},
		{
			name: "OtherModName"
			version: "1.12.2"
			url: "http://example.org"
		}
	]
}
~~~~
`forge` is available as an alias for `forgeVersion` and both are optional.

## Usage
~~~~javascript
var dl = require('modpackdl')
dl.executeDL(modpackObject, path)
~~~~

or

~~~~javascript
var dl = require('modpackdl');
dl.executeDL(modpackObject, path).then(() => {
	// Your stuff
}).catch(() => {
	// Error handling
})
~~~~

executeDL() is async, not for lack of trying to download things in a synchronous manner.
