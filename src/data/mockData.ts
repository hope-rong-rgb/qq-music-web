import type { Song, Playlist, PlaylistDetail, Singer, Album } from '@/type'
import { realSongs } from './realMusicData'

/**
 * 使用真实音乐数据
 */
export const mockSongs: Song[] = realSongs

/**
 * 模拟歌单数据（使用真实歌曲）
 */
export const mockPlaylists: Playlist[] = [
  {
    id: 2001,
    name: '华语经典',
    cover: '/img/太聪明.png',
    description: '精选华语经典歌曲',
    trackCount: 4,
    playCount: 1280000,
    createTime: Date.now() - 86400000 * 30,
    songs: [1, 3, 4, 5], // 太聪明、做个小孩、呓语、湘江中路
  },
  {
    id: 2002,
    name: '日系治愈',
    cover: '/img/栞.png',
    description: '温柔治愈的日系音乐',
    trackCount: 3,
    playCount: 980000,
    createTime: Date.now() - 86400000 * 7,
    songs: [2, 6, 7], // 栞、我也曾想过一了百了、空之箱
  },
  {
    id: 2003,
    name: '全部歌曲',
    cover: '/img/呓语.png',
    description: '完整歌曲合集',
    trackCount: 7,
    playCount: 750000,
    createTime: Date.now() - 86400000 * 15,
    songs: [1, 2, 3, 4, 5, 6, 7],
  },
]

/**
 * 模拟歌手数据
 */
export const mockSingers: Singer[] = [
  {
    id: 3001,
    name: '陈绮贞',
    avatar: '/img/太聪明.png',
    description: '台湾创作歌手',
    songCount: 1,
    albumCount: 1,
  },
  {
    id: 3002,
    name: 'MyGO!!!!!',
    avatar: '/img/栞.png',
    description: '日本摇滚乐队',
    songCount: 1,
    albumCount: 1,
  },
  {
    id: 3003,
    name: '孟慧圆',
    avatar: '/img/做个小孩.png',
    description: '中国内地创作歌手',
    songCount: 1,
    albumCount: 1,
  },
  {
    id: 3004,
    name: '毛不易',
    avatar: '/img/呓语.png',
    description: '中国内地创作歌手',
    songCount: 1,
    albumCount: 1,
  },
  {
    id: 3005,
    name: '庄达菲',
    avatar: '/img/湘江中路.png',
    description: '中国内地歌手',
    songCount: 1,
    albumCount: 1,
  },
  {
    id: 3006,
    name: 'amazarashi',
    avatar: '/img/我也曾想过一了百了.png',
    description: '日本摇滚乐队',
    songCount: 1,
    albumCount: 1,
  },
  {
    id: 3007,
    name: 'トゲナシトゲアリ',
    avatar: '/img/空之箱.png',
    description: '日本音乐组合',
    songCount: 1,
    albumCount: 1,
  },
]

/**
 * 模拟专辑数据
 */
export const mockAlbums: Album[] = [
  {
    id: 4001,
    name: '华丽的冒险',
    cover: '/img/太聪明.png',
    artist: '陈绮贞',
    releaseDate: new Date('2005-09-09').getTime(),
    trackCount: 11,
    description: '陈绮贞经典专辑',
  },
  {
    id: 4002,
    name: '栞',
    cover: '/img/栞.png',
    artist: 'MyGO!!!!!',
    releaseDate: new Date('2023-06-28').getTime(),
    trackCount: 1,
    description: 'MyGO!!!!! 单曲',
  },
  {
    id: 4003,
    name: 'Everything is good but not right',
    cover: '/img/做个小孩.png',
    artist: '孟慧圆',
    releaseDate: new Date('2019-11-13').getTime(),
    trackCount: 10,
    description: '孟慧圆首张专辑',
  },
  {
    id: 4004,
    name: '小王',
    cover: '/img/呓语.png',
    artist: '毛不易',
    releaseDate: new Date('2018-05-31').getTime(),
    trackCount: 10,
    description: '毛不易首张专辑',
  },
]

/**
 * 获取推荐歌曲列表
 */
export function getRecommendSongs(count: number = 6): Song[] {
  return mockSongs.slice(0, Math.min(count, mockSongs.length))
}

/**
 * 获取所有歌曲
 */
export function getAllSongs(): Song[] {
  return mockSongs
}

/**
 * 根据 ID 获取歌曲
 */
export function getSongById(id: number): Song | undefined {
  return mockSongs.find((song) => song.id === id)
}

/**
 * 获取歌单详情（包含歌曲列表）
 */
export function getPlaylistDetail(playlistId: number): PlaylistDetail | null {
  const playlist = mockPlaylists.find((p) => p.id === playlistId)
  if (!playlist) return null

  const songs = (playlist.songs || [])
    .map((songId) => getSongById(songId))
    .filter((song): song is Song => song !== undefined)

  return {
    ...playlist,
    songList: songs,
  }
}

/**
 * 搜索歌曲
 */
export function searchSongs(query: string): Song[] {
  const lowerQuery = query.toLowerCase()
  return mockSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(lowerQuery) ||
      song.artist.toLowerCase().includes(lowerQuery) ||
      song.album.toLowerCase().includes(lowerQuery),
  )
}

/**
 * 搜索歌单
 */
export function searchPlaylists(query: string): Playlist[] {
  const lowerQuery = query.toLowerCase()
  return mockPlaylists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes(lowerQuery) ||
      playlist.description.toLowerCase().includes(lowerQuery),
  )
}

/**
 * 搜索歌手
 */
export function searchSingers(query: string): Singer[] {
  const lowerQuery = query.toLowerCase()
  return mockSingers.filter((singer) => singer.name.toLowerCase().includes(lowerQuery))
}

/**
 * 搜索专辑
 */
export function searchAlbums(query: string): Album[] {
  const lowerQuery = query.toLowerCase()
  return mockAlbums.filter(
    (album) =>
      album.name.toLowerCase().includes(lowerQuery) ||
      album.artist.toLowerCase().includes(lowerQuery),
  )
}
