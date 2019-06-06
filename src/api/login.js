import request from '@/utils/request'

// export function login(username, password) {
//   return request({
//     // url: '/user/login',
//     url: '/user/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }
export function login(username, password) {
  return request({
    url: process.env.BASE_URL + process.env.commonPort + '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    // url: '/user/logout',
    // method: 'post'
    url: process.env.BASE_URL + process.env.commonPort + '/dingPC/manage/logout',
    method: 'get'
  })
}
