/** @type {import('next').NextConfig} */

import path from 'path'
import loaderUtils from 'loader-utils'

const hashOnlyIdent = (context, _, exportName) =>
  loaderUtils
    .getHashDigest(
      Buffer.from(
        `filePath:${path
          .relative(context.rootContext, context.resourcePath)
          .replace(/\\+/g, '/')}#className:${exportName}`,
      ),
      'md4',
      'base64',
      6,
    )
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/^(-?\d|--)/, '_$1')

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    // 1. svgr
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })

    // 2. css minifier
    // https://stackoverflow.com/questions/66744765/how-to-hash-css-class-names-in-nextjs
    // based on https://github.com/vercel/next.js/blob/992c46e63bef20d7ab7e40131667ed3debaf67de/packages/next/build/webpack/config/blocks/css/loaders/getCssModuleLocalIdent.ts

    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use))

    if (process.env.NODE_ENV === `production`)
      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader?.includes('css-loader') &&
            !moduleLoader.loader?.includes('postcss-loader')
          ) {
            const modules = moduleLoader?.options?.modules
            if (modules) {
              modules.getLocalIdent = hashOnlyIdent
            }
          }
        })
      })

    return config
  },
}

export default nextConfig
