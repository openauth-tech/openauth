const fs = require('fs')
const path = require('path')

const newVersion = process.argv[2]
const packagesDir = path.join(__dirname, '..', 'packages')

fs.readdirSync(packagesDir).forEach((pkg) => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkgJson = require(pkgPath)
    pkgJson.version = newVersion
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n')
  }
})
