let express = require('express');
let router = express.Router();
let commonService = require('../service/commonService');

router.get('/', function(req, res, next) {
  res.render('login', { title: '银行网点媒体宣传展示系统', layout: null });
});

router.get('/backImageSetting', function(req, res, next) {
  let service = new commonService.commonInvoke('branchInfo');
  let bankCode = req.cookies.bwmBankCode;
  let branchCode = req.cookies.bwmBranchCode;
  if(bankCode === undefined || branchCode === undefined){
    res.json({
      err: false,
      msg: 'use default setting.',
      branchInfo: null
    });
    return false;
  }

  let parameter = '/' + bankCode + '/' + branchCode;
  service.get(parameter, function (result) {
    if (result.err) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        branchInfo: result.content.responseData
      });
    }
  })
});

router.post('/', function (req, res, next) {
  let service = new commonService.commonInvoke('login');
  let parameter = req.body.account + '/' + req.body.password + '/3';

  service.get(parameter, function (result) {
    if(result.err){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        userInfo: result.content.responseData
      });
    }
  })
});

module.exports = router;