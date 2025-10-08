// obavijesti plugin
class SimpleToast {
  constructor() {
    this.toasts = []
    this.container = null
    this.init()
  }

  init() {
    this.container = document.createElement('div')
    this.container.id = 'simple-toast-container'
    this.container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      pointer-events: none;
    `
    document.body.appendChild(this.container)
  }

  show(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div')
    const id = Date.now() + Math.random()

    const colors = {
      success: { bg: '#4CAF50', border: '#45a049' },
      error: { bg: '#f44336', border: '#da190b' },
      warning: { bg: '#ff9800', border: '#f57c00' },
      info: { bg: '#2196F3', border: '#0b7dda' }
    }

    const color = colors[type] || colors.info

    toast.style.cssText = `
      background: ${color.bg};
      color: white;
      padding: 12px 20px;
      margin-bottom: 12px;
      border-radius: 4px;
      border-left: 4px solid ${color.border};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 14px;
      line-height: 1.4;
      pointer-events: all;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    `

    toast.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="flex: 1; margin-right: 10px;">${message}</span>
        <span style="cursor: pointer; font-weight: bold; opacity: 0.8;">&times;</span>
      </div>
    `

    toast.addEventListener('click', () => this.remove(toast))

    this.container.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'translateX(0)'
    }, 10)

    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration)
    }

    return id
  }

  remove(toast) {
    if (toast && toast.parentNode) {
      toast.style.opacity = '0'
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }
  }

  success(message, duration = 4000) {
    return this.show(message, 'success', duration)
  }

  error(message, duration = 6000) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration = 5000) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration = 4000) {
    return this.show(message, 'info', duration)
  }

  clear() {
    if (this.container) {
      this.container.innerHTML = ''
    }
  }
}

const toast = new SimpleToast()

export default {
  install(app) {
    app.config.globalProperties.$toast = toast
    app.provide('toast', toast)
  }
}

export { toast }
