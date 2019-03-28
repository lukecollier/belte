# It does too much
## Svelte
While working on the react loader I found that the tool could be simplified to just do injection and let other tools then import all the needed imports or requires.
This would certainly keep things simple.

## Note on Resilience
Chunking is initialized usually from the javascript I will need to investigate if we any build tool currently offers output dependent scripts that we can link too in the head. This tool makes use of browsers tendencies to run each script independent of previous scripts failures which allows components to succeed after other bundles have fails. This lack of a single point of failure is a huge inspiration for this work and could result in this tool doing /some/ building which is none ideal.

## And theres more...
This also becomes more of a problem with then handling non component based logic, though this is strictly fine to bundle in with components for now it loses the dependency resolution super powers on each page. Though this maybe achievable currently with rollup and a clever encoding strategy rendering this project somewhat useless.

## For now 
The plan moving forward is to carry on with the PoC and investigate the limits of rollup. If rollup proves not effective we can carry on using tools such as recast and acorn to parse and modify. However if rollup can produce nicer iffe wrappers (which I believe it can) it'll be incredibly easy to create a thin wrapper around that for effectively creating chunks for each page. 

## More on rollup
If rollup can work the way I think it can loaders become even lighter leaving all compiling to rollup, we can utilize this to handle ALL javascript logic passing in our uniquely generated id's for filenames and less uniquely generated id's for the iife names. 

### Shape of Loaders with rollup
Loaders would become a simple return of encoded names, rendered components, dependencies and a list of plugins to correctly build those dependencies.

```javascript
function loader(src, { encodeForFilename, encodeForVariableName }) {
  // logic here
  return {
    render: (src) => doARender(src, encode),
    plugins: () => [
      require('rollup-plugin-svelte'), 
      require('rollup-plugin-commonjs'), 
      ...plugins
    ],
    dependencies: () => [
      'path/to/depOne.js', 
      'path/to/depTwo.js'
    ]
  }
}
```

We can then iteratively build each dependency with the plugin list provided by the loader. Rendering is more interesting and may need it's own doless adoption.
