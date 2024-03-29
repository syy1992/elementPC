import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenKey = 'X-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('token=' + token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
