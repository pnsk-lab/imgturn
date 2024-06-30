console.log('Cleaning up dist...')

await Bun.$`rm -rf dist; mkdir dist`

console.log('Building server script...')
const serverBuilt = await Bun.build({
  entrypoints: ['main.ts'],
  outdir: 'dist',
  target: 'bun',
  external: ['electron'],
  naming: 'server.js'
})
if (!serverBuilt.success) {
  console.error(serverBuilt.logs)
  throw new Error('Build failed')
}

console.log('Building client script...')
const clientBuilt = await Bun.build({
  entrypoints: ['./client/main.tsx'],
  outdir: 'dist/public',
  naming: 'main.js'
})
if (!clientBuilt.success) {
  console.error(clientBuilt.logs)
  throw new Error('Build failed')
}
await Bun.$`cp public/index.html dist/public/index.html`

export {}