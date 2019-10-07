let commonUtility = {};
commonUtility.COOKIE_LOGIN_USER = 'bwmUser';
commonUtility.COOKIE_LOGIN_USERID = 'bwmUserID';
commonUtility.COOKIE_LOGIN_BANKCODE = 'bwmBankCode';
commonUtility.COOKIE_LOGIN_BRANCHCODE = 'bwmBranchCode';

commonUtility.getLoginUserInfo = function() {
  let cookie = getCookie(this.COOKIE_LOGIN_USER);
  return cookie !== null ? JSON.parse(cookie) : null;
};

commonUtility.getLoginUser = function () {
  let cookie = this.getCookie(this.COOKIE_LOGIN_USER);
  return cookie !== null ? JSON.parse(cookie).account : 'unknown';
};

commonUtility.setCookie = function (name,value) {
  let days = 30;
  let exp = new Date();
  exp.setTime(exp.getTime() + days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

commonUtility.getCookie = function (name) {
  let reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  let arr = document.cookie.match(reg);
  return unescape(arr[2]);
};

commonUtility.delCookie = function (name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cookieName = this.getCookie(name);
  if(cookieName !== null)
    document.cookie= name + "=" + cookieName + ";expires=" + exp.toGMTString();
};