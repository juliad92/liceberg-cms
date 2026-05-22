import { mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config.mts'

export default mergeConfig(baseConfig, {
  test: {
    include: [
      'tests/unit/**/*.unit.spec.ts',
      'tests/int/**/*.int.spec.ts',
    ],
    fileParallelism: false,
  },
})
