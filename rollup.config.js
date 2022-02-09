import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [json(), commonjs(), nodeResolve()]
};