// src/utils/message.ts
import { createApp, h, type App as VueApp } from 'vue'
import type { MessageType, MessageConfig } from '@/type'

// 消息组件
const MessageComponent = {
  name: 'Message',
  props: {
    type: {
      type: String as () => MessageType,
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  setup(props: { type: MessageType; message: string; duration: number }) {
    return () =>
      h(
        'div',
        {
          class: `message-wrapper message-${props.type}`,
          style: {
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            animation: 'message-slide-in 0.3s ease',
            fontSize: '14px',
          },
        },
        [
          h(
            'span',
            {
              class: 'message-icon',
              style: {
                fontSize: '18px',
              },
            },
            getIcon(props.type),
          ),
          h(
            'span',
            {
              class: 'message-text',
              style: {
                flex: 1,
                color: '#333',
              },
            },
            props.message,
          ),
        ],
      )
  },
}

// 获取图标
function getIcon(type: MessageType): string {
  const icons: Record<MessageType, string> = {
    success: '✓',
    error: '✖',
    warning: '⚠',
    info: 'ⓘ',
  }
  return icons[type]
}

// 消息实例管理
let messageInstance: VueApp | null = null
let container: HTMLDivElement | null = null

// 显示消息
function showMessage(config: MessageConfig): void {
  // 移除已存在的消息
  if (messageInstance) {
    messageInstance.unmount()
    if (container) {
      document.body.removeChild(container)
    }
  }

  // 创建容器
  container = document.createElement('div')
  document.body.appendChild(container)

  // 创建消息实例
  messageInstance = createApp(MessageComponent, {
    ...config,
    duration: config.duration || 3000,
  })

  messageInstance.mount(container)

  // 添加样式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes message-slide-in {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    @keyframes message-slide-out {
      from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
    }
    
    .message-success .message-icon {
      color: #31c27c;
    }
    
    .message-error .message-icon {
      color: #ff4757;
    }
    
    .message-warning .message-icon {
      color: #ffa502;
    }
    
    .message-info .message-icon {
      color: #3742fa;
    }
  `
  document.head.appendChild(style)

  // 自动关闭
  setTimeout(() => {
    if (messageInstance && container) {
      container.style.animation = 'message-slide-out 0.3s ease'
      setTimeout(() => {
        if (messageInstance) {
          messageInstance.unmount()
        }
        if (container) {
          document.body.removeChild(container)
        }
        messageInstance = null
        container = null
      }, 300)
    }
  }, config.duration || 3000)
}

// 导出快捷方法
export const message = {
  success(msg: string, duration?: number): void {
    showMessage({ type: 'success', message: msg, duration })
  },
  error(msg: string, duration?: number): void {
    showMessage({ type: 'error', message: msg, duration })
  },
  warning(msg: string, duration?: number): void {
    showMessage({ type: 'warning', message: msg, duration })
  },
  info(msg: string, duration?: number): void {
    showMessage({ type: 'info', message: msg, duration })
  },
}
