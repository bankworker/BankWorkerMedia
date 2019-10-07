let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mediaModuleList', function(req, res, next) {
  let service = new commonService.commonInvoke('media');
  let bankCode = req.cookies.bwmBankCode;
  let branchCode = req.cookies.bwmBranchCode;
  if(bankCode === undefined || branchCode === undefined){
    res.json({
      err: false,
      msg: 'use default setting.',
      mediaList: null
    });
    return false;
  }

  let parameter = '/1/5/' + bankCode + '/' + branchCode;
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
        mediaList: result.content.responseData
      });
    }
  })
});

router.get('/mediaModuleDetail', function(req, res, next) {
  let service = new commonService.commonInvoke('media');
  let bankCode = req.cookies.bwmBankCode;
  let branchCode = req.cookies.bwmBranchCode;
  let mediaModuleID = req.query.mediaModuleID;
  if(bankCode === undefined || branchCode === undefined){
    res.json({
      err: false,
      msg: 'use default setting.',
      mediaInfo: null
    });
    return false;
  }

  let parameter = '/' + bankCode + '/' + branchCode + '/' + mediaModuleID;
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
        mediaInfo: result.content.responseData
      });
    }
  })
});

module.exports = router;
