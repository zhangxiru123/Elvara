import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Dashboard from './Dashboard.jsx'

const API = {
  login: '/api/user/login',
  register: '/api/user/register',
  captcha: '/api/captcha'
}

const TOKEN_KEY = 'elvara.auth.token'
const USER_KEY = 'elvara.auth.user'

class ApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest(path, options = {}) {
  const method = options.method || 'POST'
  const headers = { Accept: 'application/json' }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    })
  } catch {
    throw new ApiError('Unable to reach the Elvara service.')
  }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || !payload || payload.code !== 1) {
    throw new ApiError(payload?.msg || 'The request could not be completed.')
  }

  return payload.data
}

function saveSession(data, remember) {
  const storage = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  other.removeItem(TOKEN_KEY)
  other.removeItem(USER_KEY)
  storage.setItem(TOKEN_KEY, data.token)
  storage.setItem(USER_KEY, JSON.stringify(data.user))
}

function BrandPanel({ reduceMotion, signedIn }) {
  return (
    <motion.aside
      // 关键：登录成功时，直接用 fixed 铺满全屏，盖住所有东西
      className={`hidden h-full shrink-0 select-none bg-[#0A2540] md:block animate-gradient transition-all duration-500 ${
        signedIn 
          ? 'fixed inset-0 z-50 w-screen overflow-visible' 
          : 'relative w-[65%] overflow-hidden'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(at 10% 10%, rgba(255, 77, 141, 0.3) 0px, transparent 50%),
          radial-gradient(at 90% 80%, rgba(0, 136, 255, 0.4) 0px, transparent 50%),
          radial-gradient(at 50% 50%, rgba(0, 212, 255, 0.2) 0px, transparent 50%)
        `,
        backgroundSize: '200% 200%'
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(10,37,64,0.6) 100%)' }}
      />

      <div className="relative z-10 h-full pl-16 xl:pl-24">
        <div className="relative flex h-full w-fit flex-col justify-center">
          
          {/* 大字：放大、模糊、飞出去 */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={
              signedIn 
                ? { scale: 40, opacity: 0, filter: 'blur(15px)' } // 放大倍率调到了 40
                : { opacity: 1, y: 0 }
            }
            transition={
              signedIn 
                ? { duration: 1.2, ease: [0.7, 0, 0.84, 0] } 
                : { duration: 1, ease: [0.16, 1, 0.3, 1] }   
            }
            className="origin-left"
          >
            <h1
              className="text-white drop-shadow-sm"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '200',
                fontSize: '12rem',
                lineHeight: '1',
                letterSpacing: '-0.04em'
              }}
            >
              Elvara
            </h1>
          </motion.div>

          {/* Slogan：登录时淡出并轻微往下掉 */}
          <motion.p 
            animate={signedIn ? { opacity: 0, y: 30, filter: 'blur(8px)' } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-1 whitespace-nowrap pl-[15px] text-sm font-medium uppercase tracking-[0.3em] text-blue-200/80"
          >
            REAL-TIME CHAT &amp; AI ASSISTANT.
          </motion.p>

        </div>
      </div>

      {/* 底部版权：登录时直接淡出 */}
      <motion.footer 
        animate={signedIn ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-x-0 bottom-8 z-10 pl-16 xl:pl-24"
      >
        <nav
          aria-label="Legal"
          className="brand-legal ml-[15px] flex flex-wrap items-center gap-x-6 gap-y-1.5 pr-6 text-[11px] font-normal leading-4 text-white/35"
        >
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>© 2026 Elvara</span>
        </nav>
      </motion.footer>
    </motion.aside>
  )
}
export default function App() {
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [captchaKey, setCaptchaKey] = useState('')
  const [captchaImage, setCaptchaImage] = useState('')
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [whiteOut, setWhiteOut] = useState(false)
  const [dashboardVisible, setDashboardVisible] = useState(false)

  const isRegister = mode === 'register'

  function changeMode(nextMode) {
    if (loading) return
    setMode(nextMode)
    setError('')
    setPassword('')
    setConfirmPassword('')
    setCaptchaCode('')
    setShowPassword(false)
  }

  async function loadCaptcha() {
    if (captchaLoading) return
    setCaptchaLoading(true)
    try {
      const data = await apiRequest(API.captcha, { method: 'GET' })
      const image = data.image?.startsWith('data:')
        ? data.image
        : `data:image/png;base64,${data.image}`
      setCaptchaKey(data.captchaKey)
      setCaptchaImage(image)
      setCaptchaCode('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to load the verification code.')
    } finally {
      setCaptchaLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'register') {
      loadCaptcha()
    }
  }, [mode])

    useEffect(() => {
    if (!signedIn) return undefined

    setWhiteOut(false)
    setDashboardVisible(false)
    // 把 800 改成 1200，白屏在 1.2 秒后出现
    const whiteTimer = window.setTimeout(() => setWhiteOut(true), 1100)
    const dashboardTimer = window.setTimeout(() => setDashboardVisible(true), 1400)

    return () => {
      window.clearTimeout(whiteTimer)
      window.clearTimeout(dashboardTimer)
    }
  }, [signedIn])

 function beginSuccessTransition(user) {
    setCurrentUser(user)
    setSignedIn(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return

    setError('')
    if (isRegister) {
      if (!username.trim() || !email.trim() || !password || !confirmPassword || !captchaCode.trim()) {
        setError('Enter your username, email, password and verification code.')
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Enter a valid email address.')
        return
      }
      if (password !== confirmPassword) {
        setError('The two passwords do not match.')
        return
      }
    } else if (!account.trim() || !password) {
      setError('Enter your account and password.')
      return
    }

    setLoading(true)
    try {
      const payload = isRegister
        ? {
            username: username.trim(),
            email: email.trim(),
            nickName: username.trim(),
            password,
            confirmPassword,
            captchaKey,
            captchaCode: captchaCode.trim()
          }
        : {
            account: account.trim(),
            password
          }
      const data = await apiRequest(isRegister ? API.register : API.login, { body: payload })
      saveSession(data, remember)
      beginSuccessTransition(data.user)
    } catch (requestError) {
      setError(requestError.message || 'The request could not be completed.')
      if (isRegister) {
        await loadCaptcha()
        setError(requestError.message || 'The request could not be completed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const formMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
      }

     const inputClass =
    'h-12 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-500/80 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
    return (
    <>
      {/* 1. 外层 <main> 换成 <motion.main>，让整体背景颜色可以平滑过渡 */}
      <motion.main 
        className="flex h-screen w-full overflow-hidden"
        animate={{ backgroundColor: signedIn ? '#0A2540' : '#ffffff' }}
        transition={{ duration: 0.4 }}
      >
        <BrandPanel reduceMotion={reduceMotion} signedIn={signedIn} />

        {/* 2. 这里的 section 去掉了 bg-white，防止挡住左侧扩张的深色背景 */}
        <motion.section
          className="relative flex h-full w-full items-center justify-center border-l border-gray-100 px-6 py-5 md:w-[35%] md:min-w-0 md:px-8"
          animate={{ opacity: signedIn ? 0 : 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ pointerEvents: signedIn ? 'none' : undefined }}
        >
          {/* 3. 用绝对定位给表单垫一块专属的白底，这样表单淡出时它也跟着消失 */}
          <div className="absolute inset-0 bg-white -z-10" />
          
          <motion.div className="auth-panel-inner w-full max-w-[380px] mx-auto" {...formMotion}>
          <AnimatePresence mode="wait" initial={false}>
            {signedIn ? (
              <motion.div
                key="signed-in"
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                role="status"
              >
                <h1 className="text-2xl font-semibold text-slate-900">You&apos;re in.</h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Welcome back, {currentUser?.nickName || currentUser?.username || 'friend'}.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <header className="auth-heading mb-8">
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {isRegister ? 'Create your account' : 'Welcome back'}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {isRegister ? 'A few details and your workspace is ready.' : 'Enter your details to continue.'}
                  </p>
                </header>

                <form className={`auth-form flex flex-col gap-6 ${isRegister ? 'register-form' : ''}`} onSubmit={handleSubmit} noValidate aria-busy={loading}>
                  {isRegister ? (
                    <>
                      <div className="auth-field">
                        <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
                          Username
                        </label>
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          placeholder="Choose a username"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="auth-field">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@company.com"
                          className={inputClass}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="auth-field">
                      <label htmlFor="account" className="mb-2 block text-sm font-medium text-slate-700">
                        Email or username
                      </label>
                      <input
                        id="account"
                        name="account"
                        type="text"
                        autoComplete="username"
                        value={account}
                        onChange={(event) => setAccount(event.target.value)}
                        placeholder="you@company.com"
                        className={inputClass}
                        required
                      />
                    </div>
                  )}

                  <div className="auth-field">
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                        className={`${inputClass} pr-16`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {isRegister && (
                    <>
                      <div className="auth-field">
                        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                          Confirm password
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder="Repeat your password"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div className="auth-field">
                        <label htmlFor="captchaCode" className="mb-2 block text-sm font-medium text-slate-700">
                          Verification code
                        </label>
                        <div className="flex items-stretch gap-3">
                          <input
                            id="captchaCode"
                            name="captchaCode"
                            type="text"
                            inputMode="text"
                            autoComplete="off"
                            maxLength={4}
                            value={captchaCode}
                            onChange={(event) => setCaptchaCode(event.target.value)}
                            placeholder="Enter code"
                            className={`${inputClass} min-w-0 flex-1`}
                            required
                          />
                          <button
                            type="button"
                            onClick={loadCaptcha}
                            disabled={captchaLoading}
                            className="relative h-12 w-[112px] shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-wait"
                            aria-label="Refresh verification code"
                            title="Click to refresh verification code"
                          >
                            {captchaImage ? (
                              <img src={captchaImage} alt="Verification code" className="h-full w-full object-contain" />
                            ) : (
                              <span className="text-xs text-slate-400">Loading...</span>
                            )}
                            {captchaLoading && (
                              <span className="absolute inset-0 grid place-items-center bg-white/70">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      className="mt-0 h-4 w-4 shrink-0 rounded border-slate-300 text-[#0088FF] focus:ring-[#0088FF]/20 accent-[#0088FF]"
                    />
                    <span>Remember me</span>
                  </label>

                  {error && (
                    <p className="text-sm leading-5 text-red-600" role="alert" aria-live="polite">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0088FF] px-4 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-colors duration-200 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                    )}
                    {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : isRegister ? 'Create account' : 'Sign in'}
                  </button>
                </form>

                                <div className="auth-switch mt-8 text-center text-xs">
                  <span className="text-slate-500">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  </span>{' '}
                  <button
                    type="button"
                    onClick={() => changeMode(isRegister ? 'login' : 'register')}
                    disabled={loading}
                    className="font-semibold text-[#0088FF] transition-colors duration-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed"
                  >
                    {isRegister ? 'Sign in' : 'Create one'}
                  </button>
                </div>

                <p className="auth-terms mt-5 text-center text-[11px] leading-5 text-slate-400">
                  By continuing, you agree to Elvara&apos;s Terms and Privacy Policy.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.section>
      </motion.main>

      <AnimatePresence>
        {whiteOut && (
          <motion.div
            key="white-out"
            className="fixed inset-0 z-[10000] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}

        {dashboardVisible && (
          <motion.div
            key="dashboard"
            className="fixed inset-0 z-[10001] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Dashboard user={currentUser} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}