# lw-idp-platform

> 龙网一体化开发平台前端脚手架，基于 Vue 3 + Vite 6 + NaiveUI + TypeScript

---

## 命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发服务 (development 模式, 端口 3000) |
| `pnpm pro` | 以 production 模式启动开发服务 |
| `pnpm build:pro` | 生产构建 (会先执行 `vue-tsc --noEmit`) |
| `pnpm build:dev` | 开发构建 (会先执行 `vue-tsc --noEmit`) |
| `pnpm build-noTsc:dev` | 跳过类型检查构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` | 代码检查 (eslint --fix, 作用于 src/) |
| `pnpm prettier` | 格式化 |
| `pnpm test` | 测试 (打开 vitest UI) |
| `pnpm coverage` | 覆盖率 (v8, 无头模式) |

## 前置条件

- **Node >= 20** (通过 `.npmrc` 中 `engine-strict` 强制)
- **pnpm** 为包管理器 (lockfile: `pnpm-lock.yaml`)

---

## 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| 构建工具 | Vite | 6.x |
| 框架 | Vue | 3.5.x |
| UI 组件库 | NaiveUI | 2.x |
| 语言 | TypeScript | 5.x |
| 状态管理 | Pinia + pinia-plugin-persistedstate | 3.x |
| 路由 | Vue Router | 4.x |
| 样式 | Sass (modern-compiler API) | — |
| 图表 | ECharts | 5.x |
| 表格 | VXE Table + VXE PC UI + @vxe-ui/plugin-export-xlsx | 4.x |
| HTTP 客户端 | Axios | 1.x |
| 工具库 | @vueuse/core、xe-utils、decimal.js、qs、js-cookie | — |
| 单元测试 | Vitest + @vitest/ui + @vitest/coverage-v8 | 3.x |
| 自动导入 | unplugin-auto-import + unplugin-vue-components + vite-plugin-lazy-import | — |

---

## 项目架构

```
src/
├── main.ts                          # 入口 → bootstrap() 挂载 AppProvider
├── App.vue                          # 根组件
├── global.d.ts                      # 全局类型声明
├── vite-env.d.ts                    # Vite 环境类型声明
│
├── api/                             # API 请求定义 (按业务模块组织)
│   └── table/
│       └── index.ts
│
├── assets/                          # 静态资源
│   ├── font/                        # 字体文件
│   └── style/                       # 全局样式
│       ├── main.scss                # 主样式入口
│       └── vxe_table.scss           # VXETable 样式覆盖
│
├── components/                      # 公共组件 (PascalCase)
│   ├── common/                      # 通用组件
│   │   ├── AppProvider/             # NaiveUI providers 包裹层 (message/dialog/notification/loadingBar)
│   │   └── ProModal/                # 通用弹窗封装
│   ├── business/                    # 业务组件 (按需添加)
│   ├── gis/                         # GIS 地图组件 (按需添加)
│   └── vis/                         # 可视化组件 (按需添加)
│
├── config/                          # 全局配置
│   ├── theme/                       # NaiveUI 主题配置
│   │   ├── checkTheme.ts            # 主题校验
│   │   ├── designSetting.ts         # 设计设置定义
│   │   ├── transLighten.ts          # 颜色变亮转换
│   │   ├── useConfig.ts             # 主题配置 composable
│   │   └── useDesignSetting.ts      # 设计设置 composable (暗黑模式通过 designSetting store 切换)
│   └── pagination.ts                # VXETable 默认分页配置 (读取 VITE_VXE_TABLE_PAGESIZE)
│
├── enums/                           # 枚举类型
│   └── breakpointEnum.ts            # 响应式断点枚举
│
├── hooks/                           # Vue composables (PascalCase)
│   ├── core/                        # 基础原子 composable
│   │   ├── useResetObjectReactive.ts # 重置响应式对象
│   │   └── useTimeout.ts            # 定时器
│   ├── event/                       # DOM 事件 composable
│   │   ├── useBreakpoint.ts         # 响应式断点监听
│   │   └── useEventListener.ts      # 事件监听器
│   └── web/                         # 业务 composable
│       ├── useFetch.ts              # 单次 API 请求
│       ├── useFetchTable.ts         # VXETable 分页请求
│       ├── useECharts.ts            # ECharts 生命周期绑定
│       └── useFileHandler.ts        # 文件处理
│
├── layout/                          # 布局组件
│   ├── LayoutMain.vue               # 布局主框架
│   ├── HeaderNavbar/                # 顶部导航栏
│   │   └── HeaderNavbar.vue
│   ├── Main/                        # 内容区域
│   │   └── MainArea.vue
│   └── VerticalSidebar/             # 垂直侧边栏
│       └── VerticalSidebar.vue
│
├── plugins/                         # 插件模块
│   ├── echarts.ts                   # ECharts 按需注册 (导出 echarts 实例供 useECharts hook 引用)
│   └── vxeTable.ts                  # VXETable + VXE PC UI 全局注册与配置 (通过 useTable(app) 调用)
│
├── router/                          # 路由
│   ├── index.ts                     # 路由入口 (createWebHistory, import.meta.glob eager 自动加载，按 meta.sort 排序)
│   └── modules/                     # 路由模块
│       └── home.ts
│
├── utils/                           # 纯函数工具 (无副作用、无框架依赖)
│   ├── is.ts                        # 类型判断
│   ├── storage.ts                   # 本地缓存封装
│   ├── common.ts                    # 通用工具函数
│   ├── auth.ts                      # 权限跳转
│   ├── toast.ts                     # 消息提示封装
│   └── request/                     # HTTP 客户端 (统一 Axios 实例)
│       ├── index.ts                 # Axios 实例 (baseURL 为空, 开发环境通过 Vite 代理 /api → VITE_BASE_URL, 内置重复请求取消)
│       ├── interceptor/             # 请求/响应拦截器
│       │   ├── request/             # 请求拦截器
│       │   └── response/            # 响应拦截器 (normalize → error → print-log)
│       └── tools/
│           └── DataConveter.ts      # FormData 转换工具
│
├── store/                           # Pinia 状态管理
│   ├── index.ts                     # Store 入口 (setupStore)
│   └── modules/
│       └── designSetting.ts         # 设计设置 (主题/暗黑模式)
│
├── test/                            # 单元测试
│   └── global.test.ts               # DataConveter 工具函数测试
│
├── types/                           # TypeScript 全局类型定义 (按需添加)
│
└── views/                           # 页面组件 (kebab-case)
    ├── echart-demo/                 # ECharts 图示例
    │   └── echart-demo.vue
    ├── modal-demo/                  # 弹窗示例
    │   └── modal-demo.vue
    └── table-demo/                  # 表格示例
        ├── IndexPage.vue
        └── table-demo.vue
```

---

## 自动导入

- **Vue API** (`ref`, `computed`, `onMounted` 等) 和 **NaiveUI composables** (`useMessage`, `useDialog`, `useNotification`, `useLoadingBar`) 由 `unplugin-auto-import` 自动导入，无需手动 import。
- **NaiveUI 组件** (`NButton`, `NModal` 等) 由 `unplugin-vue-components` 自动解析，无需手动 import 或注册。
- **VXETable / VXE PC UI 组件** 由 `vite-plugin-lazy-import` 按需懒加载，无需手动 import。
- 生成的类型文件: `auto-imports.d.ts`, `components.d.ts` (位于仓库根目录，已提交)。

---

## 代码风格

- 无分号、单引号、2 空格缩进、100 字符行宽、无尾逗号
- ESLint: `vue-eslint-parser` + `vue3-recommended` + `@typescript-eslint/recommended` + `prettier`
- `@typescript-eslint/no-explicit-any` **关闭** — 允许使用 `any`
- SCSS 使用 `modern-compiler` API (`vite.config.ts` css.preprocessorOptions.scss.api)
- 路径别名: `@` → `src/`

### 目录命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| PascalCase (大驼峰) | 工具/结构目录 | `components/`、`hooks/`、`store/`、`router/`、`config/`、`utils/`、`plugins/` |
| kebab-case (短横线) | 页面目录 | `views/`、`pages/`、`document-pages/` |

---

## 构建说明

- 生产构建通过 terser 移除 `console.log`、`console.debugger` 及 `dead_code`
- 输出按 `node_modules` 包名分块 (manual chunks)
- 构建产物按类型分包: `js/`、`css/`、`fonts/`、`img/`、`assets/`
- Vite base path: `/`
- 环境模式: `development` / `production` (由 `.env.development` / `.env.production` 控制)
- 开发服务器代理: `/api` → `VITE_BASE_URL` (changeOrigin: true)

---

## 测试

- Vitest + `@vitest/ui` + `@vitest/coverage-v8`
- 测试文件位于 `src/test/` — 目前仅有 `global.test.ts` (DataConveter 工具函数测试)
- 默认测试命令打开交互式 UI；CI/无头模式使用 `pnpm coverage`
