import Pica, { PicaResizeOptions } from 'pica'

const resizeOptions: PicaResizeOptions = {
  filter: `lanczos3`,
}

let pica: Pica.Pica | null

const getPica = (): Pica.Pica => {
  if (!pica) {
    pica = Pica({
      features: [`js`, `wasm`, `cib`, `ww`],
    })

    return pica
  }
  return pica
}

export { resizeOptions, getPica }
