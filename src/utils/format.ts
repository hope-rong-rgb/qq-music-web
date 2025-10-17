/**
 * 格式化时间（秒转换为 mm:ss 格式）
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00'
  }

  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * 格式化播放次数
 * @param count 播放次数
 * @returns 格式化后的字符串
 */
export function formatPlayCount(count: number): string {
  if (count < 10000) {
    return String(count)
  } else if (count < 100000000) {
    return `${(count / 10000).toFixed(1)}万`
  } else {
    return `${(count / 100000000).toFixed(1)}亿`
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
  }
}

/**
 * 格式化日期
 * @param timestamp 时间戳（毫秒）
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number, format = 'YYYY-MM-DD'): string {
  const date = new Date(timestamp)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

type AnyFunction = (..._args: unknown[]) => unknown

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number,
): (..._args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends AnyFunction>(
  fn: T,
  delay: number,
): (..._args: Parameters<T>) => void {
  let lastTime = 0

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
