import { fileURLToPath, URL } from 'node:url'
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { lazyImport, VxeResolver } from 'vite-plugin-lazy-import'
import path from 'node:path'
// https://vitejs.dev/config/
export default defineConfig((config: ConfigEnv): UserConfig => {
  const env = loadEnv(config.mode, process.cwd(), '')
  const envName = env.ENV || 'development'
  return {
    base: '/',
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ],
        eslintrc: {
          enabled: true
        }
      }),
      Components({
        resolvers: [NaiveUiResolver(), ElementPlusResolver()]
      }),
      lazyImport({
        resolvers: [
          VxeResolver({ libraryName: 'vxe-table' }),
          VxeResolver({ libraryName: 'vxe-pc-ui' })
        ]
      })
    ],
    server: {
      host: '0.0.0.0',
      port: 4900,
      open: false,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL, //目标域名
          changeOrigin: true, //需要代理跨域
          rewrite: (path) => path.replace(/^\/api/, '') // 后端接口无 /api 前缀，代理时去掉
        },
        // 知识库原文查看：Qdrant payload 里的 filePath 是 /docFiles/... 这样的服务端相对路径，
        // 问答正文的文档角标直接 window.open 该路径。不代理的话会命中 Vite 的 SPA fallback，
        // 打开的是前端首页而不是文件。这三条原样转发（不做 rewrite），与后端
        // lonwin-framework-file / ResourceViewController 的路径一致。
        // 生产环境由 nginx 配同名反代，规则：/docFiles、/imgFiles、/resourceShow -> 后端服务。
        '/docFiles': { target: env.VITE_BASE_URL, changeOrigin: true },
        '/imgFiles': { target: env.VITE_BASE_URL, changeOrigin: true },
        '/resourceShow': { target: env.VITE_BASE_URL, changeOrigin: true }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    json: {
      stringify: false
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    build: {
      outDir: path.resolve(__dirname, `dist/${envName}`),
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          dead_code: true,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            //配置分块
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
          entryFileNames: 'js/[name]-[hash].js', //配置JS入口打包文件路径
          chunkFileNames: 'js/[name]-[hash].js', //配置其余JS打包文件路径
          assetFileNames(chunkInfo) {
            //配置静态文件打包文件路径
            if (chunkInfo.name.endsWith('.css')) {
              return 'css/[name]-[hash].css'
            }
            const fontExtArray = ['eot', 'woff', 'woff2', 'ttf']
            if (fontExtArray.some((ext) => chunkInfo.name.endsWith(ext))) {
              return 'fonts/[name]-[hash].[ext]'
            }
            const imgExtArray = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp']
            if (imgExtArray.some((ext) => chunkInfo.name.endsWith(ext))) {
              return 'img/[name]-[hash].[ext]'
            }
            return 'assets/[name]-[hash].[ext]'
          }
        }
      }
    }
  }
})
