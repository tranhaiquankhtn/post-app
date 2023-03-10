// const env = import.meta.env.MODE

// let appApiUrl = ''

// if (env === 'production') {
//   appApiUrl = `https://${import.meta.env.VITE_APP_DOMAIN_PROD}`
// } else if (env === 'staging') {
//   appApiUrl = `https://${import.meta.env.VITE_APP_DOMAIN_STAG}`
// } else {
//   appApiUrl = `http://${import.meta.env.VITE_APP_DOMAIN_DEV}`
// }

export const apiUrl = import.meta.env.VITE_APP_DOMAIN
export const appName = import.meta.env.VITE_APP_TITLE
