import Pica, { PicaResizeOptions } from 'pica'

const resizeOptions: PicaResizeOptions = {
  filter: `lanczos3`,
}

const pica = Pica({
  features: [`js`, `wasm`, `cib`, `ww`],
})

export { resizeOptions, pica }
