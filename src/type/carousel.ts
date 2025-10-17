export interface CarouselItem {
  image: string
  title?: string
  description?: string
  link?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface CarouselConfig {
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showIndicators?: boolean
  showCaption?: boolean
  indicatorType?: 'dot' | 'number'
  transition?: 'slide' | 'fade'
  height?: string
  pauseOnHover?: boolean
}
