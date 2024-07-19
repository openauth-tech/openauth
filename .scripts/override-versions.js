const fs = require('fs')
const path = require('path')

const versionTag = process.argv[2]
const newVersion = versionTag.startsWith('v') ? versionTag.substring(1) : versionTag

const packagesDir = path.join(__dirname, '..', 'packages')

fs.readdirSync(packagesDir).forEach((pkg) => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkgJson = require(pkgPath)
    pkgJson.version = newVersion
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n')
  }
})
