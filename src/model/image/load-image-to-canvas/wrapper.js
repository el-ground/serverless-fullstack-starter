import blueImpLoadImage from 'blueimp-load-image/js/index'

// https://www.npmjs.com/package/blueimp-load-image

const loadImageToCanvas = async (fileOrBlobOrUrl, minWidth, minHeight) => {
  const res = await blueImpLoadImage(fileOrBlobOrUrl, {
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
