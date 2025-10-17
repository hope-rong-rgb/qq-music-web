<!-- src/components/Auth/LoginDialog.vue -->
<template>
  <transition name="dialog-fade">
    <div v-if="visible" class="dialog-overlay" @click="handleClose">
      <div class="dialog-container" @click.stop>
        <button class="close-btn" @click="handleClose">
          <Icon name="close" size="lg" color="#666" />
        </button>

        <!-- 登录表单 -->
        <div v-if="mode === 'login'" class="form-container">
          <h2 class="form-title">登录</h2>
          <p class="form-subtitle">欢迎回来！请登录您的账号</p>

          <form class="auth-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">用户名</label>
              <input
                v-model="loginForm.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名"
                :class="{ error: loginErrors.username }"
              />
              <span v-if="loginErrors.username" class="error-message">
                {{ loginErrors.username }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <input
                v-model="loginForm.password"
                type="password"
                class="form-input"
                placeholder="请输入密码"
                :class="{ error: loginErrors.password }"
              />
              <span v-if="loginErrors.password" class="error-message">
                {{ loginErrors.password }}
              </span>
            </div>

            <div class="form-row">
              <label class="checkbox-label">
                <input v-model="loginForm.remember" type="checkbox" />
                <span>记住我</span>
              </label>
              <a href="#" class="link-text">忘记密码？</a>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? '登录中...' : '登录' }}
            </button>

            <div class="form-footer">
              <span class="footer-text">还没有账号？</span>
              <a href="#" class="link-text" @click.prevent="switchMode('register')"> 立即注册 </a>
            </div>
          </form>
        </div>

        <!-- 注册表单 -->
        <div v-else class="form-container">
          <h2 class="form-title">注册</h2>
          <p class="form-subtitle">创建您的账号，开始音乐之旅</p>

          <form class="auth-form" @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label">用户名</label>
              <input
                v-model="registerForm.username"
                type="text"
                class="form-input"
                placeholder="请输入用户名（3-20个字符）"
                :class="{ error: registerErrors.username }"
              />
              <span v-if="registerErrors.username" class="error-message">
                {{ registerErrors.username }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">邮箱</label>
              <input
                v-model="registerForm.email"
                type="email"
                class="form-input"
                placeholder="请输入邮箱（可选）"
                :class="{ error: registerErrors.email }"
              />
              <span v-if="registerErrors.email" class="error-message">
                {{ registerErrors.email }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">密码</label>
              <input
                v-model="registerForm.password"
                type="password"
                class="form-input"
                placeholder="请输入密码（至少6个字符）"
                :class="{ error: registerErrors.password }"
              />
              <span v-if="registerErrors.password" class="error-message">
                {{ registerErrors.password }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">确认密码</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                class="form-input"
                placeholder="请再次输入密码"
                :class="{ error: registerErrors.confirmPassword }"
              />
              <span v-if="registerErrors.confirmPassword" class="error-message">
                {{ registerErrors.confirmPassword }}
              </span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? '注册中...' : '注册' }}
            </button>

            <div class="form-footer">
              <span class="footer-text">已有账号？</span>
              <a href="#" class="link-text" @click.prevent="switchMode('login')"> 立即登录 </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import { message } from '@/utils/message'
import type { LoginForm, RegisterForm, UserInfo } from '@/type'

interface Props {
  visible: boolean
  defaultMode?: 'login' | 'register'
}

const props = withDefaults(defineProps<Props>(), {
  defaultMode: 'login',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const userStore = useUserStore()

const mode = ref<'login' | 'register'>(props.defaultMode)
const isLoading = ref(false)

// 登录表单
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false,
})

const loginErrors = reactive<Record<string, string>>({
  username: '',
  password: '',
})

// 注册表单
const registerForm = reactive<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
})

const registerErrors = reactive<Record<string, string>>({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
})

// 切换模式
const switchMode = (newMode: 'login' | 'register'): void => {
  mode.value = newMode
  resetForms()
}

// 重置表单
const resetForms = (): void => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.remember = false
  loginErrors.username = ''
  loginErrors.password = ''

  registerForm.username = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  registerForm.email = ''
  registerErrors.username = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
  registerErrors.email = ''
}

// 验证登录表单
const validateLoginForm = (): boolean => {
  let isValid = true

  // 验证用户名
  if (!loginForm.username.trim()) {
    loginErrors.username = '请输入用户名'
    isValid = false
  } else {
    loginErrors.username = ''
  }

  // 验证密码
  if (!loginForm.password) {
    loginErrors.password = '请输入密码'
    isValid = false
  } else {
    loginErrors.password = ''
  }

  return isValid
}

// 验证注册表单
const validateRegisterForm = (): boolean => {
  let isValid = true

  // 验证用户名
  if (!registerForm.username.trim()) {
    registerErrors.username = '请输入用户名'
    isValid = false
  } else if (registerForm.username.length < 3 || registerForm.username.length > 20) {
    registerErrors.username = '用户名长度应为3-20个字符'
    isValid = false
  } else {
    registerErrors.username = ''
  }

  // 验证邮箱
  if (registerForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = '请输入有效的邮箱地址'
    isValid = false
  } else {
    registerErrors.email = ''
  }

  // 验证密码
  if (!registerForm.password) {
    registerErrors.password = '请输入密码'
    isValid = false
  } else if (registerForm.password.length < 6) {
    registerErrors.password = '密码长度至少6个字符'
    isValid = false
  } else {
    registerErrors.password = ''
  }

  // 验证确认密码
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = '请再次输入密码'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  } else {
    registerErrors.confirmPassword = ''
  }

  return isValid
}

// 处理登录
const handleLogin = async (): Promise<void> => {
  if (!validateLoginForm()) return

  isLoading.value = true

  // 模拟API请求
  setTimeout(() => {
    // 模拟登录逻辑（实际应该调用API）
    const mockUser: UserInfo = {
      userId: Date.now(),
      username: loginForm.username,
      avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
      createdAt: Date.now(),
    }

    userStore.login(mockUser)
    message.success('登录成功！')
    isLoading.value = false
    handleClose()
  }, 1000)
}

// 处理注册
const handleRegister = async (): Promise<void> => {
  if (!validateRegisterForm()) return

  isLoading.value = true

  // 模拟API请求
  setTimeout(() => {
    // 模拟注册逻辑（实际应该调用API）
    const mockUser: UserInfo = {
      userId: Date.now(),
      username: registerForm.username,
      avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
      email: registerForm.email,
      createdAt: Date.now(),
    }

    userStore.login(mockUser)
    message.success('注册成功！')
    isLoading.value = false
    handleClose()
  }, 1000)
}

// 关闭对话框
const handleClose = (): void => {
  emit('update:visible', false)
  setTimeout(resetForms, 300) // 延迟重置，避免动画时看到表单变化
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.dialog-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: #f5f5f5;
}

.form-container {
  padding: 40px;
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
}

.form-subtitle {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-bottom: 32px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #31c27c;
  box-shadow: 0 0 0 3px rgba(49, 194, 124, 0.1);
}

.form-input.error {
  border-color: #ff4757;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
}

.error-message {
  font-size: 12px;
  color: #ff4757;
  margin-top: -4px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  cursor: pointer;
}

.link-text {
  font-size: 14px;
  color: #31c27c;
  text-decoration: none;
  transition: color 0.2s;
}

.link-text:hover {
  color: #2bb56f;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #31c27c;
  color: #fff;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #2bb56f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(49, 194, 124, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  padding-top: 8px;
}

.footer-text {
  font-size: 14px;
  color: #999;
  margin-right: 8px;
}

/* 过渡动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .dialog-container,
.dialog-fade-leave-active .dialog-container {
  transition: transform 0.3s ease;
}

.dialog-fade-enter-from .dialog-container {
  transform: scale(0.9);
}

.dialog-fade-leave-to .dialog-container {
  transform: scale(0.9);
}
</style>
