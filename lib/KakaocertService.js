var crypto = require('crypto');
var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var linkhub = require('linkhub');
var http_tls = require('https');
var http_request = require('http');
var zlib = require('zlib');

var LINKHUB_API_VERSION = "2.0";

module.exports = KakaocertService;
Util.inherits(KakaocertService, EventEmitter);

function KakaocertService(config) {
  EventEmitter.call(this);

  this._config = config;
  this.ServiceID = 'BAROCERT';

  if (this._config.IPRestrictOnOff != undefined) {
    this.IPRestrictOnOff = this._config.IPRestrictOnOff;
  } else {
    this.IPRestrictOnOff = true;
  }

  if (this._config.UseLocalTimeYN != undefined) {
    this._config.UseLocalTimeYN = this._config.UseLocalTimeYN;;
  } else {
    this._config.UseLocalTimeYN = true;
  }

  if (this._config.UseStaticIP != undefined) {
    this.UseStaticIP = this._config.UseStaticIP;;
  } else {
    this.UseStaticIP = false;
  }

  if (this.UseStaticIP) {
    this.ServiceURL = 'static-barocert.linkhub.co.kr';
  } else {
    this.ServiceURL = 'barocert.linkhub.co.kr';
  }

  linkhub.initialize({
    LinkID: this._config.LinkID,
    SecretKey: this._config.SecretKey,
    UseLocalTimeYN: this._config.UseLocalTimeYN,
    AuthURL: this._config.AuthURL,
    defaultErrorHandler: this._config.defaultErrorHandler
  });

  this._Linkhub_Token_Cash = {};
  this._scopes = ['partner', '401', '402', '403', '404'];
};

KakaocertService.addMethod = function (object, name, fn) {
  var old = object[name];
  object[name] = function () {
    if (fn.length == arguments.length)
      return fn.apply(this, arguments);
    else if (typeof old == 'function')
      return old.apply(this, arguments);
  };
}

KakaocertService.prototype._getToken = function (err) {

  var newToken = this._Linkhub_Token_Cash[this._config.LinkID];
  var expired = true;
  var UTCTime = linkhub.getTime(this.UseStaticIP, false);

  if (typeof newToken === 'function') {
    var expiration = new Date(newToken(function () {
    }, err).expiration);

    if (expiration) {
      expired = Date.parse(UTCTime) > Date.parse(expiration);

    } else {
      expired = true;
    }
  }

  if (expired) {
    newToken = linkhub.newToken(this.ServiceID, '', this._getScopes(), this.IPRestrictOnOff ? null : '*', this.UseStaticIP, false);
    this._Linkhub_Token_Cash[this._config.LinkID] = newToken;
  }

  return newToken;

};

KakaocertService.prototype._getScopes = function () {
  return this._scopes;
};

KakaocertService.prototype._executeAction = function (options) {
  var CRLF = '\r\n';

  if (!(options.Method)) options.Method = 'GET';

  var headers = {};
  var Token = function (callback) {
    callback(null);
  };

  Token = this._getToken();

  var _this = this;

  Token(function (token) {

    if (options.Method == 'POST') {
      var xDate = linkhub.getTime(_this.UseStaticIP, false);
      headers['x-bc-date'] = xDate;
      var requestData = options.Data;
      var sha256 = crypto.createHash('sha256');
      var signTarget = "";

      signTarget = 'POST\n';
      signTarget += options.uri + '\n';
      if (requestData) {
        sha256.update(requestData);
        var bodyDigest = sha256.digest('base64');
        signTarget += bodyDigest + '\n';
      }
      signTarget += xDate + '\n';

      var hmac = crypto.createHmac('sha256', new Buffer(_this._config.SecretKey, 'base64'));
      hmac.update(signTarget);
      var Signature = hmac.digest('base64');

      headers['x-bc-version'] = '2.0';
      headers['x-bc-auth'] = Signature;
      headers['x-bc-encryptionmode'] = 'GCM';
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }

    if (token) headers['Authorization'] = 'Bearer ' + token.session_token;

    var requestOpt = {
      host: _this.ServiceURL,
      path: options.uri,
      method: options.Method == 'GET' ? 'GET' : 'POST',
      headers: headers
    }

    var req = _this._makeRequest(
      requestOpt,
      function (response) {
        if (options.success) options.success(response);
      },
      (typeof options.error === 'function') ? options.error : _this._config.defaultErrorHandler
    );

    if (options.Method != 'GET' && options.Data) {
      req.write(options.Data);
    }
    req.end();

  }, options.error);
};

KakaocertService.prototype._makeRequest = function (options, success, error) {

  if (this._config.ServiceURL == undefined || this._config.ServiceURL.includes("https")) {

    var request = http_tls.request(options,
      function (response) {
        var buf = new Buffer(0);
        //Gzip Compressed Response stream pipe
        if (response.headers['content-encoding'] == 'gzip') {
          var gzip = zlib.createGunzip();
          response.pipe(gzip);
          gzip.on('data', function (chunk) {
            buf = Buffer.concat([buf, chunk]);
          });

          gzip.on('end', function () {
            if (response.statusCode == '200') {
              success(JSON.parse(buf));
            }
            else if (error) {
              error(JSON.parse(buf));
            }
          });
        } else {
          response.on('data', function (chunk) {
            buf = Buffer.concat([buf, chunk]);
          });

          response.on('end', function () {
            if (this.statusCode == '200') {
              success(JSON.parse(buf));
            }
            else if (error) {
              error(JSON.parse(buf));
            }
          });
        }
      }
    );

    request.on('error', function (err) {
      if (err.code != 'ECONNRESET')
        console.error(err);
    });
    return request;

  } else {

    options.host = this._config.ServiceURL.substring(7, this._config.ServiceURL.lastIndexOf(":"));
    options.port = Number(this._config.ServiceURL.substring(this._config.ServiceURL.lastIndexOf(":") + 1));

    var request = http_request.request(options,
      function (response) {
        var buf = new Buffer(0);
        //Gzip Compressed Response stream pipe
        if (response.headers['content-encoding'] == 'gzip') {
          var gzip = zlib.createGunzip();
          response.pipe(gzip);
          gzip.on('data', function (chunk) {
            buf = Buffer.concat([buf, chunk]);
          });

          gzip.on('end', function () {
            if (response.statusCode == '200') {
              success(JSON.parse(buf));
            }
            else if (error) {
              error(JSON.parse(buf));
            }
          });
        } else {
          response.on('data', function (chunk) {
            buf = Buffer.concat([buf, chunk]);
          });

          response.on('end', function () {
            if (this.statusCode == '200') {
              success(JSON.parse(buf));
            }
            else if (error) {
              error(JSON.parse(buf));
            }
          });
        }
      }
    );

    request.on('error', function (err) {
      if (err.code != 'ECONNRESET')
        console.error(err);
    });
    return request;

  }

};

KakaocertService.prototype._encrypt = function (plainText) {
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(this._config.SecretKey, 'base64'), nonce);
  const nonceCiphertextTag = Buffer.concat([nonce, cipher.update(plainText), cipher.final(), cipher.getAuthTag()]);
  return nonceCiphertextTag.toString('base64');
};

KakaocertService.prototype._stringify = function (obj) {
  return JSON.stringify(obj, function (key, value) {
    return !value ? undefined : value;
  });
};

KakaocertService.prototype._throwError = function (Code, Message, err) {
  if (err)
    err({ code: Code, message: Message });
  else if (typeof this._config.defaultErrorHandler === 'function')
    this._config.defaultErrorHandler({ code: Code, message: Message });
};



// 본인인증 요청
KakaocertService.addMethod(KakaocertService.prototype, 'requestIdentity', function (ClientCode, Identity, success, error) {
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
  if (Object.keys(Identity).length === 0) {
    this._throwError(-99999999, '본인인증 서명요청 정보가 입력되지 않았습니다.', error);
    return;
  }
  if (!Identity.ci || 0 !== Identity.ci.length) {
    if (!Identity.receiverHP || 0 === Identity.receiverHP) {
      this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
      return;
    }
    if (!Identity.receiverName || 0 === Identity.receiverName) {
      this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
      return;
    }
    if (!Identity.receiverBirthday || 0 === Identity.receiverBirthday) {
      this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
      return;
    }
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
KakaocertService.addMethod(KakaocertService.prototype, 'getIdentityStatus', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'verifyIdentity', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'requestSign', function (ClientCode, Sign, success, error) {
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
  if (Object.keys(Sign).length === 0) {
    this._throwError(-99999999, '전자서명 요청정보가 입력되지 않았습니다.', error);
    return;
  }

  if (!Sign.ci || 0 !== Sign.ci.length) {
    if (!Sign.receiverHP || 0 === Sign.receiverHP) {
      this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
      return;
    }
    if (!Sign.receiverName || 0 === Sign.receiverName) {
      this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
      return;
    }
    if (!Sign.receiverBirthday || 0 === Sign.receiverBirthday) {
      this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
      return;
    }
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
KakaocertService.addMethod(KakaocertService.prototype, 'getSignStatus', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'verifySign', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'requestMultiSign', function (ClientCode, multiSign, success, error) {
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
  if (!multiSign.ci || 0 !== multiSign.ci.length) {
    if (!multiSign.receiverHP || 0 === multiSign.receiverHP) {
      this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
      return;
    }
    if (!multiSign.receiverName || 0 === multiSign.receiverName) {
      this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
      return;
    }
    if (!multiSign.receiverBirthday || 0 === multiSign.receiverBirthday) {
      this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
      return;
    }
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
KakaocertService.addMethod(KakaocertService.prototype, 'getMultiSignStatus', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'verifyMultiSign', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'requestCMS', function (ClientCode, CMS, success, error) {
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
  if (!CMS.ci || 0 !== CMS.ci.length) {
    if (!CMS.receiverHP || 0 === CMS.receiverHP) {
      this._throwError(-99999999, '수신자 휴대폰번호가 입력되지 않았습니다.', error);
      return;
    }
    if (!CMS.receiverName || 0 === CMS.receiverName) {
      this._throwError(-99999999, '수신자 성명이 입력되지 않았습니다.', error);
      return;
    }
    if (!CMS.receiverBirthday || 0 === CMS.receiverBirthday) {
      this._throwError(-99999999, '생년월일이 입력되지 않았습니다.', error);
      return;
    }
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
KakaocertService.addMethod(KakaocertService.prototype, 'getCMSStatus', function (ClientCode, ReceiptID, success, error) {
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
KakaocertService.addMethod(KakaocertService.prototype, 'verifyCMS', function (ClientCode, ReceiptID, success, error) {
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
