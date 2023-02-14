const env = import.meta.env.VUE_APP_ENV

let appApiUrl = ''

if (env === 'production') {
  appApiUrl = `https://${import.meta.env.VUE_APP_DOMAIN_PROD}`
} else if (env === 'staging') {
  appApiUrl = `https://${import.meta.env.VUE_APP_DOMAIN_STAG}`
} else {
  appApiUrl = `https://${import.meta.env.VUE_APP_DOMAIN_DEV}`
}

export const apiUrl = appApiUrl
export const appName = import.meta.env.VITE_APP_TITLE
