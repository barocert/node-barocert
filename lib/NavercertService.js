var Util = require('util');
var BaseService = require('./BaseService');

module.exports = NavercertService;
Util.inherits(NavercertService, BaseService);

function NavercertService(config) {
  BaseService.call(this, config);
  this._scopes.push('421', '422', '423');
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
BaseService.addMethod(NavercertService.prototype, 'requestIdentity', function (ClientCode, Identity, success, error) {
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
    this._throwError(-99999999, '본인인증 서명요청 정보가 입력되지 않았습니다.', error);
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
  if (!Identity.receiverBirthday || 0 === Identity.receiverBirthday.length) {
    this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(Identity);

  this._executeAction({
    uri: '/NAVER/Identity/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 상태확인
BaseService.addMethod(NavercertService.prototype, 'getIdentityStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/NAVER/Identity/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 검증
BaseService.addMethod(NavercertService.prototype, 'verifyIdentity', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/NAVER/Identity/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 요청(단건)
BaseService.addMethod(NavercertService.prototype, 'requestSign', function (ClientCode, Sign, success, error) {
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
  if (!Sign.receiverBirthday || 0 === Sign.receiverBirthday.length) {
    this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
    return;
  }

  if (!Sign.reqTitle || 0 === Sign.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
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
    uri: '/NAVER/Sign/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});


// 전자서명 상태확인(단건)
BaseService.addMethod(NavercertService.prototype, 'getSignStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/NAVER/Sign/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 검증(단건)
BaseService.addMethod(NavercertService.prototype, 'verifySign', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/NAVER/Sign/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});


// 전자서명 요청(복수)
BaseService.addMethod(NavercertService.prototype, 'requestMultiSign', function (ClientCode, multiSign, success, error) {
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
  if (Object.keys(multiSign).length === 0) {
    this._throwError(-99999999, '전자서명 요청정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!multiSign.receiverHP || 0 === multiSign.receiverHP.length) {
    this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!multiSign.receiverName || 0 === multiSign.receiverName.length) {
    this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
    return;
  }
  if (!multiSign.receiverBirthday || 0 === multiSign.receiverBirthday.length) {
    this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
    return;
  }

  if (!multiSign.reqTitle || 0 === multiSign.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (!multiSign.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }
  if (this._isNullorEmptyTokenType(multiSign.tokens)) {
    this._throwError(-99999999, '원문 유형이 입력되지 않았습니다.', error);
    return;
  }
  if (this._isNullorEmptyToken(multiSign.tokens)) {
    this._throwError(-99999999, '토큰 원문이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(multiSign);

  this._executeAction({
    uri: '/NAVER/MultiSign/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});


// 전자서명 상태확인(복수)
BaseService.addMethod(NavercertService.prototype, 'getMultiSignStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/NAVER/MultiSign/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 검증(복수)
BaseService.addMethod(NavercertService.prototype, 'verifyMultiSign', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/NAVER/MultiSign/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});