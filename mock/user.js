import { param2Obj } from './utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
  // syy: {
  //   token: 'syy-token'
  // }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: '//profile.csdnimg.cn/8/C/F/3_weixin_40716786',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'http://wx.qlogo.cn/mmopen/CJ35Z2cnZA23C2wPPPegBFOLkWp9QDrOkaN23LxKewH9IA8pjPghiaH1IJJAgbWAZ3aSfAJXwG6qRpbianTKEQuqTJTaArGfWo/64',
    name: 'Editor 羊羊羊'
  }
  // 'syy-token': {
  //   roles: ['syy'],
  //   introduction: '我是羊羊羊',
  //   avatar: 'http://wx.qlogo.cn/mmopen/CJ35Z2cnZA23C2wPPPegBFOLkWp9QDrOkaN23LxKewH9IA8pjPghiaH1IJJAgbWAZ3aSfAJXwG6qRpbianTKEQuqTJTaArGfWo/64',
  //   name: '羊羊羊'
  // }
}

export default {
  login: res => {
    const { username } = JSON.parse(res.body)
    const data = tokens[username]

    if (data) {
      return {
        code: 20000,
        data
      }
    }
    return {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  },
  getInfo: res => {
    const { token } = param2Obj(res.url)
    const info = users[token]

    if (info) {
      return {
        code: 20000,
        data: info
      }
    }
    return {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  },
  logout: () => {
    return {
      code: 20000,
      data: 'success'
    }
  }
}
