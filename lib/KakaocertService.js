var Util = require('util');
var BaseService = require('./BaseService');

module.exports = KakaocertService;
Util.inherits(KakaocertService, BaseService);

function KakaocertService(config) {
  BaseService.call(this, config);
  this._scopes.push('401', '402', '403', '404', '405');
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
BaseService.addMethod(KakaocertService.prototype, 'requestIdentity', function (ClientCode, Identity, success, error) {
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
  if (!Identity.reqTitle || 0 === Identity.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
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
    uri: '/KAKAO/Identity/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 상태확인
BaseService.addMethod(KakaocertService.prototype, 'getIdentityStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/Identity/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 본인인증 검증
BaseService.addMethod(KakaocertService.prototype, 'verifyIdentity', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/Identity/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 요청(단건)
BaseService.addMethod(KakaocertService.prototype, 'requestSign', function (ClientCode, Sign, success, error) {
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

  if ((!Sign.signTitle || 0 === Sign.signTitle.length) && (!Sign.reqTitle || 0 === Sign.reqTitle.length)) {
      this._throwError(-99999999, '서명 요청 제목이 입력되지 않았습니다.', error);
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
    uri: '/KAKAO/Sign/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});


// 전자서명 상태확인(단건)
BaseService.addMethod(KakaocertService.prototype, 'getSignStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/Sign/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 검증(단건)
BaseService.addMethod(KakaocertService.prototype, 'verifySign', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/Sign/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});


// 전자서명 요청(복수)
BaseService.addMethod(KakaocertService.prototype, 'requestMultiSign', function (ClientCode, multiSign, success, error) {
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
  if (this._isNullorEmptyTitle(multiSign.tokens)) {
    this._throwError(-99999999, '서명 요청 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (this._isNullorEmptyToken(multiSign.tokens)) {
    this._throwError(-99999999, '토큰 원문이 입력되지 않았습니다.', error);
    return;
  }
  if (!multiSign.tokenType || 0 === multiSign.tokenType.length) {
    this._throwError(-99999999, '원문 유형이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(multiSign);

  this._executeAction({
    uri: '/KAKAO/MultiSign/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});


// 전자서명 상태확인(복수)
BaseService.addMethod(KakaocertService.prototype, 'getMultiSignStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/MultiSign/' + ClientCode + "/" + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 전자서명 검증(복수)
BaseService.addMethod(KakaocertService.prototype, 'verifyMultiSign', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/MultiSign/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 출금동의 요청
BaseService.addMethod(KakaocertService.prototype, 'requestCMS', function (ClientCode, CMS, success, error) {
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
    this._throwError(-99999999, '출금동의 서명요청 정보가 입력되지 않았습니다.', error);
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
  if (!CMS.receiverBirthday || 0 === CMS.receiverBirthday.length) {
    this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
    return;
  }

  if (!CMS.reqTitle || 0 === CMS.reqTitle.length) {
    this._throwError(-99999999, '인증요청 메시지 제목이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.expireIn) {
    this._throwError(-99999999, '만료시간이 입력되지 않았습니다.', error);
    return;
  }

  if (!CMS.requestCorp || 0 === CMS.requestCorp.length) {
    this._throwError(-99999999, '청구기관명이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankName || 0 === CMS.bankName.length) {
    this._throwError(-99999999, '은행명이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankAccountNum || 0 === CMS.bankAccountNum.length) {
    this._throwError(-99999999, '계좌번호가 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankAccountName || 0 === CMS.bankAccountName.length) {
    this._throwError(-99999999, '예금주명이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankAccountBirthday || 0 === CMS.bankAccountBirthday.length) {
    this._throwError(-99999999, '예금주 생년월일이 입력되지 않았습니다.', error);
    return;
  }
  if (!CMS.bankServiceType || 0 === CMS.bankServiceType.length) {
    this._throwError(-99999999, '출금 유형이 입력되지 않았습니다.', error);
    return;
  }

  var postData = this._stringify(CMS);

  this._executeAction({
    uri: '/KAKAO/CMS/' + ClientCode,
    Method: 'POST',
    Data: postData,
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 출금동의 상태확인
BaseService.addMethod(KakaocertService.prototype, 'getCMSStatus', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/CMS/' + ClientCode + '/' + ReceiptID,
    Method: 'GET',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 출금동의 검증
BaseService.addMethod(KakaocertService.prototype, 'verifyCMS', function (ClientCode, ReceiptID, success, error) {
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
    uri: '/KAKAO/CMS/' + ClientCode + '/' + ReceiptID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});

// 간편로그인 검증
BaseService.addMethod(KakaocertService.prototype, 'verifyLogin', function (ClientCode, TxID, success, error) {
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
  if (!TxID || 0 === TxID.length) {
    this._throwError(-99999999, '트랜잭션 아이디가 입력되지 않았습니다.', error);
    return;
  }

  this._executeAction({
    uri: '/KAKAO/Login/' + ClientCode + '/' + TxID,
    Method: 'POST',
    success: function (response) {
      if (success) success(response);
    },
    error: error
  });
});