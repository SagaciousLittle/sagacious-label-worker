const { eslint } = require('rollup-plugin-eslint')
const json = require('@rollup/plugin-json')
const ts = require('rollup-plugin-ts')
const del = require('rollup-plugin-delete')
const fs = require('@sagacious/fs-wrapper')
const reslove = require('@rollup/plugin-node-resolve')
const cjs = require('@rollup/plugin-commonjs')
const path = require('path')

const input = fs.readDirProSync(path.resolve(__dirname, './src'), {
  deep: true,
  withFileTypes: true,
})
  .reduce((res, { absolutePath, name }) => {
    if (/\.ts$/.test(name)) res[name.replace(/\.ts$/, '')] = absolutePath
    return res
  }, {})

const plugins = [
  json(),
  reslove(),
  cjs(),
  eslint({
    fix: true,
  }),
  ts(),
]

module.exports = [
  {
    input,
    output: [
      {
        dir: 'cjs',
        format: 'cjs',
        exports: 'named',
      },
      {
        dir: 'esm',
        format: 'esm',
      },
    ],
    plugins: [
      del({
        targets: ['cjs/*', 'esm/*', 'types/*'],
      }),
    ].concat(plugins),
  },
  {
    input: './src/index.ts',
    output: {
      dir: 'umd',
      name: 'LabelWorker',
      format: 'umd',
      exports: 'named',
    },
    plugins: [
      del({
        targets: ['umd/*'],
      }),
    ].concat(plugins),
  },
]
