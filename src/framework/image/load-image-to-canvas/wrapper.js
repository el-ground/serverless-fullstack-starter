// https://www.npmjs.com/package/blueimp-load-image

const loadImageToCanvas = async (fileOrBlobOrUrl, minWidth, minHeight) => {
  const blueImpLoadImage = await import('blueimp-load-image/js/index.js')
  const res = await blueImpLoadImage.default(fileOrBlobOrUrl, {
    meta: true,
    canvas: true,
    orientation: true,
    minWidth,
    minHeight,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: `high`,
  })
  return res.image
}

export default loadImageToCanvas
