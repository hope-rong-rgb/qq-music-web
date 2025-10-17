# 🎵 QQ Music Web

一个使用 Vue 3 + TypeScript + Vite 构建的现代化音乐播放器 Web 应用。

## ✨ 功能特性

### 核心功能

- 🎼 **完整的播放器** - 支持播放、暂停、上一曲、下一曲
- 📜 **歌词同步** - 实时滚动显示，支持点击跳转
- 🖼️ **全屏播放** - 沉浸式播放体验
- 📋 **播放列表** - 播放队列管理，支持拖拽排序
- 🔍 **搜索功能** - 快速搜索歌曲、歌手、专辑
- 👤 **用户系统** - 登录注册、个人中心、收藏管理

### 界面特性

- 🎨 **现代化设计** - 简洁美观的用户界面
- 📱 **响应式布局** - 完美适配各种设备
- 🎭 **轮播图** - 支持自动播放、手势滑动
- ⌨️ **键盘快捷键** - 空格播放/暂停、方向键控制
- 🌈 **流畅动画** - 精心打磨的过渡效果

## 🚀 技术栈

- **框架**: Vue 3（Composition API）
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **样式**: Tailwind CSS
- **图标**: Unicode Icons（自定义实现）

## 📦 项目结构

```
qq-music-web/
├── public/              # 静态资源
│   ├── music/          # 音频文件
│   └── img/            # 图片文件
├── src/
│   ├── components/     # 组件
│   │   ├── Auth/      # 认证相关
│   │   ├── Carousel/  # 轮播图
│   │   ├── Common/    # 通用组件
│   │   ├── Icon/      # 图标组件
│   │   ├── Lyric/     # 歌词组件
│   │   ├── Player/    # 播放器组件
│   │   └── Search/    # 搜索组件
│   ├── data/          # 模拟数据
│   ├── layouts/       # 布局组件
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   │   └── modules/   # Store 模块
│   ├── styles/        # 全局样式
│   ├── types/         # 类型定义
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── .nvmrc             # Node 版本
├── netlify.toml       # Netlify 配置
├── package.json       # 依赖配置
├── tsconfig.json      # TS 配置
└── vite.config.ts     # Vite 配置
```

## 🛠️ 本地开发

### 环境要求

- Node.js >= 20.18.0
- npm >= 10.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🌐 部署

项目已配置 Netlify 自动部署：

1. 推送代码到 GitHub
2. 连接 Netlify
3. 自动构建和部署

详见 `netlify.toml` 配置文件。

## 📝 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 最佳实践
- 组件使用 `<script setup>` 语法
- 保持代码简洁和可维护性

### 注释规范

- 关键函数添加 JSDoc 注释
- 复杂逻辑添加行内注释
- 组件添加功能说明注释

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
chore: 构建/工具链相关
```

## 🐛 已知问题

- 音频文件需要支持 CORS
- Safari 浏览器可能需要用户交互才能播放音频

## 🔮 未来计划

- [ ] 添加播放历史统计
- [ ] 支持自定义主题
- [ ] 添加音乐可视化效果
- [ ] 支持在线音乐 API
- [ ] 添加社交分享功能

## 📄 许可证

MIT License

## 👨‍💻 作者

hope-rong-rgb

## 🙏 致谢

感谢所有开源项目的贡献者

---

如果觉得这个项目不错，请给个 ⭐️ 吧！
