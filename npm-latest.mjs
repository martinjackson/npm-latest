
// see https://stackoverflow.com/questions/52478069/node-fetch-disable-ssl-verification

import { Agent, setGlobalDispatcher } from 'undici'

// ----------------------------------------------------------------------------
function ignoreZscalerBogusCert() {

   const agent = new Agent({
     connect: {
       rejectUnauthorized: false
     }
   })

   setGlobalDispatcher(agent)
}

// ----------------------------------------------------------------------------
async function latestVersion(packageName) {

  const url = 'https://registry.npmjs.org/' + packageName + '/latest'

  return fetch(url)
      .then((response) => response.json())
      .then((data) => data.version)
      .catch((error) => {
        console.log('url:', url);
        console.log('error:', error);
      });

}


// ----------------------------------------------------------------------------
async function doit(args) {

  ignoreZscalerBogusCert() 

  console.log('  "resolutions": {');

  await Promise.all(

    args.map(async (name) => {
      const vers = await latestVersion(name)
      console.log(`    "${name}": "${vers}",`)
    })

  )

  console.log('  },');
}

// ===================================================================================
const args = process.argv.slice(2)

doit(args)
