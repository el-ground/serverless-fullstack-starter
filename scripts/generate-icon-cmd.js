/*
  inkscape cli should be installed
  brew install --cask inkscape 
  sudo apt-get install inkscape

  imagemagick cli should be installed
  brew install imagemagick
  sudo apt-get install imagemagick

  run this script ands copy paste and run on the command line.
*/

const sizes = [
  16, 24, 32, 40, 48, 64, 72, 96, 128, 144, 192, 256, 384, 512, 1024,
]
sizes.forEach((size) =>
  console.log(
    `inkscape -w ${size} -h ${size} --export-filename ${size}.png icon.svg`,
  ),
)
console.log(`convert ${sizes.map((size) => size + '.png').join(' ')} icon.ico`)
