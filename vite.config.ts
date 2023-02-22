import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'index',
    },
  },
  plugins: [
    dts({
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace(/src/, ''),
        content,
      }),
    }),
  ],
})
