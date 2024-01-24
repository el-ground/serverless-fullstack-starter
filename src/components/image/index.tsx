import NextImage, { StaticImageData } from 'next/image'

export const loader = ({
  src,
  width,
}: {
  src?: string
  width: number
  // quality
}) => {
  if (!src) {
    return src
  }

  // what about private images? ->
  // need a way to provide signedUrl;
  if (src.indexOf(`storage://`) === 0) {
    let path = src.replace(`storage://`, ``)
    if (path.includes(`?`)) {
      path += `&width=${width}`
    } else {
      path += `?width=${width}`
    }
    // our storage image!
    // public path!
    return `/m/p/${path}`
  } else if (src.indexOf(`http://`) === 0 || src.indexOf(`https://`) === 0) {
    // external image!
    return src
  }

  return src
}

const srcsetSizes = [80, 140, 240, 320, 640, 1080, 1440]
const srcsetLoaderSizes = (src: string) => {
  if (!src) {
    return ``
  }

  return srcsetSizes
    .map((size) => `${loader({ src, width: size })} ${size}w`)
    .join(`, `)
}

const srcsetLoaderWidth = (src: string, width: number) => {
  if (!src) {
    return ``
  }

  return `${loader({ src, width })} 1x, ${loader({
    src,
    width: width * 2,
  })} 2x, ${loader({ src, width: width * 3 })} 3x`
}

// how to you know its mobile then?
// fallback : image or staticData;
// if !src & fallbackComponent || f
export const Image = ({
  className,
  src,
  sizes: _sizes,
  fallbackComponent,
  fallbackStaticImageData,
  fallbackSrc,
  alt,
}: {
  src?: string | null
  sizes: number | string
  className?: string
  alt: string
  fallbackComponent?: React.ReactNode
  fallbackStaticImageData?: StaticImageData
  fallbackSrc?: string
}) => {
  const width = typeof _sizes === `string` ? undefined : _sizes
  const sizes = typeof _sizes === `string` ? _sizes : undefined

  if (!src) {
    // try fallbacks!

    if (fallbackComponent) {
      return fallbackComponent
    }

    if (fallbackStaticImageData) {
      return (
        <NextImage
          width={width}
          sizes={sizes}
          src={fallbackStaticImageData}
          alt={alt}
          className={className || ``}
        />
      )
    }

    if (!fallbackSrc) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt={alt} className={className || ``} />
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      sizes={sizes}
      srcSet={
        sizes
          ? srcsetLoaderSizes(src || fallbackSrc || ``)
          : width
            ? srcsetLoaderWidth(src || fallbackSrc || ``, width)
            : ``
      }
      className={className || ``}
    />
  )
}
