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

// how to you know its mobile then?
// fallback : image or staticData;
// if !src & fallbackComponent || f
export const Image = ({
  width,
  className,
  src,
  fallbackComponent,
  fallbackStaticImageData,
  fallbackSrc,
  alt,
}: {
  src?: string | null
  width: number
  className?: string
  alt: string
  fallbackComponent?: React.ReactNode
  fallbackStaticImageData?: StaticImageData
  fallbackSrc?: string
}) => {
  if (!src) {
    // try fallbacks!

    if (fallbackComponent) {
      return fallbackComponent
    }

    if (fallbackStaticImageData) {
      return (
        <NextImage
          width={width}
          src={fallbackStaticImageData}
          alt={alt}
          className={className || ``}
        />
      )
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      src={loader({ src: src || fallbackSrc || undefined, width })}
      className={className || ``}
    />
  )
}
