export const saveLocalToken = (token: string) => localStorage.setItem('token', token)
export const getLocalToken = () => localStorage.getItem('token')
export const removeLocalToken = () => localStorage.removeItem('token')
