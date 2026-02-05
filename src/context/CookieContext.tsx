import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'

export interface CookiePreferences {
  essentials: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieContextType {
  consent: CookiePreferences | null
  saveConsent: (preferences: CookiePreferences) => void
  acceptAll: () => void
  acceptEssentials: () => void
  showBanner: boolean
  resetConsent: () => void
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

const COOKIE_CONSENT_KEY = 'cybesphere_cookie_consent'

export const CookieProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [consent, setConsent] = useState<CookiePreferences | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent))
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }
  }, [])

  const saveConsent = (preferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences))
    setConsent(preferences)
    setShowBanner(false)
  }

  const acceptAll = () => {
    saveConsent({
      essentials: true,
      analytics: true,
      marketing: true
    })
  }

  const acceptEssentials = () => {
    saveConsent({
      essentials: true,
      analytics: false,
      marketing: false
    })
  }

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY)
    setConsent(null)
    setShowBanner(true)
  }

  return (
    <CookieContext.Provider
      value={{
        consent,
        saveConsent,
        acceptAll,
        acceptEssentials,
        showBanner,
        resetConsent
      }}
    >
      {children}
    </CookieContext.Provider>
  )
}

export const useCookieConsent = (): CookieContextType => {
  const context = useContext(CookieContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieProvider')
  }
  return context
}
