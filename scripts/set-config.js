/*
    Reads config directory

    for each subdirectory in config, config/<dirname>/
    read <env-name>.<ext> and copies to
    temp/config/<dirname>.<ext>

    copies only if the match exists.
*/
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const environment = process.env.ENVIRONMENT

if (!environment) {
  console.error(`@set-config : ENVIRONMENT not provided!`)
  process.exit(1)
}

if (![`dev`, `prod`].includes(environment)) {
  console.error(`@set-config : Unknown ENVIRONMENT : ${environment}`)
  process.exit(1)
}

try {
  console.log(`@set-config : Removing ./temp/config`)
  fs.rmSync(`./temp/config`, {
    recursive: true,
    force: true,
  })

  fs.mkdirSync(`./temp/config`, {
    recursive: true,
  })

  const fileOrDirs = fs.readdirSync(`./config`)
  for (const configName of fileOrDirs) {
    const configDir = path.join(`./config`, configName)
    const stat = fs.statSync(configDir)

    if (stat.isDirectory()) {
      const targetFileOrDirs = fs.readdirSync(configDir)
      for (const targetFileOrDirName of targetFileOrDirs) {
        if (
          targetFileOrDirName === environment ||
          targetFileOrDirName.indexOf(`${environment}.`) === 0
        ) {
          // copy to destination
          const sourceTargetPath = path.join(configDir, targetFileOrDirName)
          const destinationTargetName = targetFileOrDirName.replace(
            environment,
            configName,
          )
          const destinationPath = path.join(
            `./temp/config`,
            destinationTargetName,
          )
          console.log(
            `@set-config : Copying ${configName}/${targetFileOrDirName} -> ./temp/config/${destinationTargetName}`,
          )
          fs.cpSync(sourceTargetPath, destinationPath, {
            recursive: true,
            force: true, // override existing one
          })
        }
      }
    }
  }
  console.log(`@set-config : Success!`)
} catch (e) {
  console.error(e)
  console.error(`@set-config : Fail. Cleaning up.`)
  try {
    fs.rmSync(`./temp/config`, {
      recursive: true,
      force: true,
    })
  } catch (e2) {
    console.error(e2)
    console.error(`@set-config : Cleanup fail. manually remove ./temp/config`)
    process.exit(1)
  }
  process.exit(1)
}
