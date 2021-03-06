const WeixinPayment = require('../weixin_pay/payment')
const Contract = require('../models/contract')
const config = require('../config/config')
const moment = require('moment')
const {json2xml} = require('../weixin_pay/helper')

const wxpay = new WeixinPayment({
  appid: config.serviceAppID,
  mch_id: config.mchId,
  mch_key: config.mchKey
})

// 创建合同
exports.new = (req, res, next) => {
  const contract = new Contract()
  let body = ''
  if (req.body.courseId) {
    const {courseId, name} = req.body
    contract.courseId = req.body.courseId
    body = name
  } else {
    // 会员服务
  }
  contract.total = req.body.total
  contract.status = '未支付'
  contract.userId = req.userId
  contract.outTradeNo = Date.now() + Math.random().toString().substr(2, 12)

  contract.save()
    .then(contract => {
      // 网页微信扫码支付
      const payInfo = {
        body,
        out_trade_no: contract.outTradeNo,
        total_fee: Math.floor(req.body.total * 100),
        spbill_create_ip: config.spbillCreateIP,
        notify_url: config.wxNotifyUrl,
        trade_type: 'NATIVE'
      }

      wxpay.getCodeUrl(payInfo)
        .then(codeUrl => {
          console.log('codeUrl', codeUrl)
          return res.status(200).json({codeUrl, contractId: contract._id})
        })
        .catch(error => {
          console.log('payment error...', error)
        })
    })
    .catch(error => {
      return res.status(500).json({
        errorMsg: '不能创建订单',
        success: false
      })
    })
}

exports.notifyUrl = (req, res, next) => {
  const result = req.body.xml
  const flag = result.return_code === 'SUCCESS' &&
               result.result_code === 'SUCCESS' &&
               result.sign === wxpay.sign(result)
  if (flag) {
    Contract.findOne({outTradeNo: result.out_trade_no})
      .exec()
      .then(contract => {
        if (contract && Math.floor(contract.total * 100) === Number(result.total_fee)) {
          if (contract.status === '未支付') {
            contract.status = '已支付'
            constract.save()
          }
          return res.send(json2xml({return_code: 'SUCCESS'}))
        } else {
          return res.send(json2xml({return_code: 'FAIL'}))
        }
      })
      .catch(error => {
        return res.send(json2xml({return_code: 'FAIL'}))
      })
  } else {
    return res.send(json2xml({return_code: 'FAIL'}))
  }
}

exports.status = (req, res, next) => {
  Contract.findById({_id: req.params.contractId})
    .exec()
    .then(c => {
      if (!c) return
      return res.status(200).json({success: true, status: c.status})
    })
    .catch(error => {
      console.log(error)
    })
}
