/**
 * 歌词行接口
 */
export interface LyricLine {
  time: number // 时间（秒，精确到百分秒）
  text: string // 歌词文本
}

/**
 * 解析 LRC 格式歌词（统一精度到百分秒）
 * @param lyricText LRC 格式的歌词文本
 * @returns 解析后的歌词数组
 */
export function parseLyric(lyricText: string): LyricLine[] {
  if (!lyricText) return []

  const lines = lyricText.split('\n')
  const result: LyricLine[] = []

  // 匹配时间标签的正则：[mm:ss.xx] 或 [mm:ss.xxx]
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{1,3})\]/g

  lines.forEach((line) => {
    const matches = [...line.matchAll(timeRegex)]

    if (matches.length > 0) {
      // 提取歌词文本（去除所有时间标签）
      const text = line.replace(timeRegex, '').trim()

      // 可能一行有多个时间标签
      matches.forEach((match) => {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        let milliseconds = parseInt(match[3])

        // 统一精度到百分秒（2位小数）
        const digitCount = match[3].length
        if (digitCount === 3) {
          milliseconds = Math.round(milliseconds / 10)
        } else if (digitCount === 1) {
          milliseconds = milliseconds * 10
        }

        // 计算总时间（精确到百分秒）
        const time = minutes * 60 + seconds + milliseconds / 100

        // 只添加有内容的歌词
        if (text && !text.match(/^(作词|作曲|编曲|制作人|混音|录音|发行)/)) {
          result.push({
            time: parseFloat(time.toFixed(2)),
            text,
          })
        }
      })
    }
  })

  // 按时间排序
  result.sort((a, b) => a.time - b.time)

  return result
}

/**
 * 查找当前应该高亮的歌词索引（二分查找优化）
 * @param lyrics 歌词数组
 * @param currentTime 当前播放时间（秒）
 * @returns 当前歌词的索引
 */
export function findCurrentLyricIndex(lyrics: LyricLine[], currentTime: number): number {
  if (!lyrics || lyrics.length === 0) return -1

  // 统一当前时间精度到百分秒
  const preciseTime = parseFloat(currentTime.toFixed(2))

  // 二分查找
  let left = 0
  let right = lyrics.length - 1
  let result = 0

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)

    if (lyrics[mid].time <= preciseTime) {
      result = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return result
}

/**
 * 格式化时间为显示格式 mm:ss
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatLyricTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * 格式化时间为 LRC 格式 [mm:ss.xx]
 * @param seconds 秒数
 * @returns LRC 格式时间字符串
 */
export function formatLrcTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const centiseconds = Math.floor((seconds % 1) * 100)

  return `[${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}]`
}
