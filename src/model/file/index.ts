// file, blob, or other abstractions.

export type FileSource = File
export type FileSourceType = `file`

const getSourceType = (source: FileSource): FileSourceType => {
  if (source instanceof File) {
    return `file`
  }

  throw new Error(`File source type unknown`)
}

const getStaticKey = (source: FileSource) => {
  if (source instanceof File) {
    const key = `${source.size}-${source.type}-${source.lastModified}`.replace(
      /\//g,
      `_`,
    )

    return key
  } else {
    throw new Error(`File source unknown`)
  }
}

const getSize = (source: FileSource) => {
  if (source instanceof File) {
    return source.size
  } else {
    throw new Error(`File source unknown`)
  }
}

const getMimeType = (source: FileSource) => {
  if (source instanceof File) {
    return source.type
  } else {
    throw new Error(`File source unknown`)
  }
}

/*
    LocalFile represents static file (content not changing)
    It lives with the file.

    The releases will be handled by GC, since we're not using objectURI

    Q : Why are we abstracting it? why not use file?
    A : Hybrid environments might use native api and web api and they might not be abstracted;
*/
export class FileLike {
  source: FileSource
  sourceType: FileSourceType
  key: string
  size: number
  mimetype: string
  type: string
  subtype: string

  constructor(source: FileSource) {
    this.source = source
    this.sourceType = getSourceType(source)
    this.key = getStaticKey(source)
    this.size = getSize(source)
    this.mimetype = getMimeType(source)
    const [type, subtype] = this.mimetype.split(`/`)
    this.type = type
    this.subtype = subtype
  }
}
