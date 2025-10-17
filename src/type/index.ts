/**
 * 歌曲信息接口
 */
export interface Song {
  id: number
  name: string
  artist: string
  album: string
  cover: string
  duration: number
  url: string
  lyric?: string
}

/**
 * 歌单信息接口
 */
export interface Playlist {
  id: number
  name: string
  cover: string
  description: string
  trackCount: number
  playCount: number
  createTime: number
  songs?: number[] // 歌曲ID列表
}

/**
 * 歌单详情接口（包含完整歌曲列表）
 */
export interface PlaylistDetail extends Playlist {
  songList: Song[]
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  userId: number
  username: string
  avatar: string
  email?: string
  phone?: string
  signature?: string
  createdAt: number
}

/**
 * 登录表单接口
 */
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

/**
 * 注册表单接口
 */
export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  email?: string
}

/**
 * 表单验证规则接口
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message: string
  validator?: (_value: string) => boolean
}

/**
 * 消息类型
 */
export type MessageType = 'success' | 'error' | 'warning' | 'info'

/**
 * 消息配置接口
 */
export interface MessageConfig {
  type: MessageType
  message: string
  duration?: number
}

/**
 * 歌手信息接口
 */
export interface Singer {
  id: number
  name: string
  avatar: string
  description?: string
  songCount?: number
  albumCount?: number
}

/**
 * 专辑信息接口
 */
export interface Album {
  id: number
  name: string
  cover: string
  artist: string
  releaseDate: number
  trackCount: number
  description?: string
}

/**
 * 搜索结果接口
 */
export interface SearchResults {
  songs: Song[]
  playlists: Playlist[]
  singers: Singer[]
  albums: Album[]
}

/**
 * API响应接口
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}
