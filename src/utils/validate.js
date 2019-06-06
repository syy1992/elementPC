/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const reg = /^[0-9a-zA-Z]{3,20}$/
  return reg.test(str)
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export function isvalidPhone(str) {
  const reg = /^1[3-9][0-9]{9}$/
  return reg.test(str)
}
export function isvalidCode(str) {
  const reg = /^[0-9a-zA-Z]{6}$/
  return reg.test(str)
}
export function isvalidNumCode(str) {
  const reg = /^\d{6}$/
  return reg.test(str)
}
