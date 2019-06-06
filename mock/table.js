import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock({
      'items|30': [{
        id: '@id',
        title: '@cparagraph()',
        // 'status|1': ['published', 'draft', 'deleted'],
        'status|1': ['1', '2'],
        // city:'@city',
        author: '@cname', // 'name
        display_time: '@datetime',
        pageviews: '@integer(300, 5000)',
        phone: /^1[385][1-9]\d{8}/,
        genOrder: '@integer(1, 5000)',
        salesNum: '@integer(0, 200)'
      }]
    })
    return {
      code: 20000,
      data: items
    }
  },
  policylist: () => {
    const policyItems = Mock.mock({
      'policyItems|10': [{
        id: '@id',
        policyNo: /[A-Z]{4}[0-9]{5}/,
        planNo: /platNo[0-9]{5}/,
        applicantName: '@cname',
        insureName: '@cname',
        'platNo|+1': 'platNo',
        channelNo: '@name',
        salesNo: '@cname',
        createTime: '@datetime',
        startTime: '@datetime',
        endTime: '@datetime',
        premium: '@integer(300, 5000)'
      }]
    })
    return {
      code: 20000,
      data: policyItems
    }
  }
}
