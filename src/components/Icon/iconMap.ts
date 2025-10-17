/**
 * Unicode 图标映射表
 * 使用标准 Unicode 字符作为图标
 */
export const iconMap: Record<string, string> = {
  // 播放控制
  play: '▶', // 播放
  pause: '⏸', // 暂停
  stop: '⏹', // 停止
  next: '⏭', // 下一曲
  prev: '⏮', // 上一曲
  forward: '⏩', // 快进
  backward: '⏪', // 快退

  // 音量
  'volume-high': '🔊', // 高音量
  'volume-medium': '🔉', // 中音量
  'volume-low': '🔈', // 低音量
  'volume-mute': '🔇', // 静音

  // 播放模式
  repeat: '🔁', // 列表循环
  'repeat-one': '🔂', // 单曲循环
  shuffle: '🔀', // 随机播放

  // 功能图标
  heart: '♥', // 收藏/喜欢
  'heart-outline': '♡', // 未收藏
  star: '★', // 星标
  'star-outline': '☆', // 未星标
  plus: '＋', // 添加
  minus: '－', // 删除
  close: '✕', // 关闭
  check: '✓', // 勾选
  menu: '☰', // 菜单
  more: '⋮', // 更多（竖向）
  'more-horizontal': '⋯', // 更多（横向）

  // 导航
  home: '⌂', // 首页
  search: '🔍', // 搜索
  user: '👤', // 用户
  music: '♪', // 音乐
  list: '☰', // 列表
  grid: '⊞', // 网格
  folder: '📁', // 文件夹
  download: '⬇', // 下载
  upload: '⬆', // 上传
  share: '⤴', // 分享
  link: '🔗', // 链接

  // 方向
  up: '▲', // 向上
  down: '▼', // 向下
  left: '◀', // 向左
  right: '▶', // 向右
  'arrow-up': '↑', // 箭头向上
  'arrow-down': '↓', // 箭头向下
  'arrow-left': '←', // 箭头向左
  'arrow-right': '→', // 箭头向右

  // 状态
  info: 'ⓘ', // 信息
  warning: '⚠', // 警告
  error: '✖', // 错误
  success: '✔', // 成功
  loading: '◌', // 加载中

  // 媒体
  image: '🖼', // 图片
  video: '🎬', // 视频
  microphone: '🎤', // 麦克风
  headphone: '🎧', // 耳机
  disc: '💿', // 光盘
  album: '📀', // 专辑

  // 其他
  clock: '🕐', // 时钟
  calendar: '📅', // 日历
  comment: '💬', // 评论
  fire: '🔥', // 热门
  trending: '📈', // 趋势
  refresh: '↻', // 刷新
  settings: '⚙', // 设置
  filter: '⊙', // 筛选
  sort: '⇅', // 排序
  expand: '⊕', // 展开
  collapse: '⊖', // 折叠
  fullscreen: '⛶', // 全屏
  'exit-fullscreen': '⛶', // 退出全屏
}

// 导出类型
export type IconName = keyof typeof iconMap
