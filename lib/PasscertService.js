var Util = require('util');
var BaseService = require('./BaseService');

module.exports = PasscertService;
Util.inherits(PasscertService, BaseService);

function PasscertService(config) {
  BaseService.call(this, config);
  this._scopes.push('441', '442', '443', '444');
};

BaseService.addMethod(BaseService.prototype, '_encrypt', function(plainText, success, error) {
  BaseService._encrypt({
    plainText,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 요청
BaseService.addMethod(PasscertService.prototype, 'requestIdentity', function (ClientCode, Identity, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (0 === Object.keys(Identity).length) {
    this._throwError(-99999999, '본인인증 요청정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.receiverHP || 0 === Identity.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.receiverName || 0 === Identity.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.reqTitle || 0 === Identity.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.callCenterNum || 0 === Identity.callCenterNum.length) {
    this._throwError(-99999999, '고객센터 연락처가 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.token || 0 === Identity.token.length) {
    this._throwError(-99999999, '토큰 원문이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(Identity);

  this._executeAction({
    uri: '/PASS/Identity/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 상태확인
BaseService.addMethod(PasscertService.prototype, 'getIdentityStatus', function (ClientCode, ReceiptID, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }

  this._executeAction({
    uri: '/PASS/Identity/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 검증
BaseService.addMethod(PasscertService.prototype, 'verifyIdentity', function (ClientCode, ReceiptID, IdentityVerify, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }
  if (0 === Object.keys(IdentityVerify).length) {
    this._throwError(-99999999, '본인인증 검증 요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!IdentityVerify.receiverHP || 0 === IdentityVerify.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!IdentityVerify.receiverName || 0 === IdentityVerify.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(IdentityVerify);

  this._executeAction({
    uri: '/PASS/Identity/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 요청
BaseService.addMethod(PasscertService.prototype, 'requestSign', function (ClientCode, Sign, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (0 === Object.keys(Sign).length) {
    this._throwError(-99999999, '전자서명 요청정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.receiverHP || 0 === Sign.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.receiverName || 0 === Sign.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.reqTitle || 0 === Sign.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.callCenterNum || 0 === Sign.callCenterNum.length) {
    this._throwError(-99999999, '고객센터 연락처가 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.token || 0 === Sign.token.length) {
    this._throwError(-99999999, '토큰 원문이 입력되지 않았습니다.', error);
    return;
  }
  if (!Sign.tokenType || 0 === Sign.tokenType.length) {
    this._throwError(-99999999, '원문 유형이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(Sign);

  this._executeAction({
    uri: '/PASS/Sign/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 상태확인
BaseService.addMethod(PasscertService.prototype, 'getSignStatus', function (ClientCode, ReceiptID, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }

  this._executeAction({
    uri: '/PASS/Sign/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 검증
BaseService.addMethod(PasscertService.prototype, 'verifySign', function (ClientCode, ReceiptID, SignVerify, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }
  if (0 === Object.keys(SignVerify).length) {
    this._throwError(-99999999, '전자서명 검증 요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!SignVerify.receiverHP || 0 === SignVerify.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!SignVerify.receiverName || 0 === SignVerify.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(SignVerify);

  this._executeAction({
    uri: '/PASS/Sign/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 출금동의 요청
BaseService.addMethod(PasscertService.prototype, 'requestCMS', function (ClientCode, CMS, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (Object.keys(CMS).length === 0) {
    this._throwError(-99999999, '자동이체 출금동의 요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.receiverHP || 0 === CMS.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.receiverName || 0 === CMS.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.reqTitle || 0 === CMS.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.callCenterNum || 0 === CMS.callCenterNum.length) {
    this._throwError(-99999999, '고객센터 연락처가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankName || 0 === CMS.bankName.length) {
    this._throwError(-99999999, '출금은행명이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankAccountNum || 0 === CMS.bankAccountNum.length) {
    this._throwError(-99999999, '출금계좌번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankAccountName || 0 === CMS.bankAccountName.length) {
    this._throwError(-99999999, '출금계좌 예금주명이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankServiceType || 0 === CMS.bankServiceType.length) {
    this._throwError(-99999999, '출금 유형이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(CMS);

  this._executeAction({
    uri: '/PASS/CMS/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 출금동의 상태확인
BaseService.addMethod(PasscertService.prototype, 'getCMSStatus', function (ClientCode, ReceiptID, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }

  this._executeAction({
    uri: '/PASS/CMS/' + ClientCode + '/' + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 출금동의 검증
BaseService.addMethod(PasscertService.prototype, 'verifyCMS', function (ClientCode, ReceiptID, CMSVerify, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }
  if (0 === Object.keys(CMSVerify).length) {
    this._throwError(-99999999, '출금동의 검증 요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMSVerify.receiverHP || 0 === CMSVerify.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMSVerify.receiverName || 0 === CMSVerify.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(CMSVerify);

  this._executeAction({
    uri: '/PASS/CMS/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 간편로그인 요청
BaseService.addMethod(PasscertService.prototype, 'requestLogin', function (ClientCode, Login, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (Object.keys(Login).length === 0) {
    this._throwError(-99999999, '간편로그인 요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!Login.receiverHP || 0 === Login.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!Login.receiverName || 0 === Login.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }
  if (!Login.reqTitle || 0 === Login.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (!Login.callCenterNum || 0 === Login.callCenterNum.length) {
    this._throwError(-99999999, '고객센터 연락처가 입력되지 않았습니다.', error);
    return;
  }
  if (!Login.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }
  if (!Login.token || 0 === Login.token.length) {
    this._throwError(-99999999, '토큰 원문이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(Login);

  this._executeAction({
    uri: '/PASS/Login/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 간편로그인 상태확인
BaseService.addMethod(PasscertService.prototype, 'getLoginStatus', function (ClientCode, ReceiptID, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }

  this._executeAction({
    uri: '/PASS/Login/' + ClientCode + '/' + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 간편로그인 검증
BaseService.addMethod(PasscertService.prototype, 'verifyLogin', function (ClientCode, ReceiptID, LoginVerify, success, error) {
  if (!ClientCode || 0 === ClientCode.length) {
    this._throwError(-99999999, '이용기관코드가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ClientCode)) {
    this._throwError(-99999999, '이용기관코드는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (12 !== ClientCode.length) {
    this._throwError(-99999999, '이용기관코드는 12자 입니다.', error);
    return;
  }
  if (!ReceiptID || 0 === ReceiptID.length) {
    this._throwError(-99999999, '접수아이디가 입력되지 않았습니다.', error);
    return;
  }
  if (isNaN(ReceiptID)) {
    this._throwError(-99999999, '접수아이디는 숫자만 입력할 수 있습니다.', error);
    return;
  }
  if (32 !== ReceiptID.length) {
    this._throwError(-99999999, '접수아이디는 32자 입니다.', error);
    return;
  }
  if (0 === Object.keys(LoginVerify).length) {
    this._throwError(-99999999, '간편로그인 검증 요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!LoginVerify.receiverHP || 0 === LoginVerify.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!LoginVerify.receiverName || 0 === LoginVerify.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(LoginVerify);

  this._executeAction({
    uri: '/PASS/Login/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});