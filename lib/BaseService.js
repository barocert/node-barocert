var crypto = require('crypto');
var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var linkhub = require('linkhub');
var http_tls = require('https');
var http_request = require('http');
var zlib = require('zlib');

var APIVERSION = "2.1";

module.exports = BaseService;
Util.inherits(BaseService, EventEmitter);

function BaseService(config) {
  EventEmitter.call(this);

  this._config = config;
  this.ServiceID = 'BAROCERT';

  if (this._config.IPRestrictOnOff != undefined) {
    this.IPRestrictOnOff = this._config.IPRestrictOnOff;
  } else {
    this.IPRestrictOnOff = true;
  }

  if (this._config.UseLocalTimeYN != undefined) {
    this._config.UseLocalTimeYN = this._config.UseLocalTimeYN;
  } else {
    this._config.UseLocalTimeYN = true;
  }

  if (this._config.UseStaticIP != undefined) {
    this.UseStaticIP = this._config.UseStaticIP;
  } else {
    this.UseStaticIP = false;
  }

  if (this._config.ServiceURL != undefined) {
    this.ServiceURL = this._config.ServiceURL;
  } else {
    if (this.UseStaticIP) {
      this.ServiceURL = 'static-barocert.linkhub.co.kr';
    } else {
      this.ServiceURL = 'barocert.linkhub.co.kr';
    }
  }

  this._tokenBuilder = new linkhub.TokenBuilder({
    LinkID: this._config.LinkID,
    SecretKey: this._config.SecretKey,
    UseLocalTimeYN: this._config.UseLocalTimeYN,
    AuthURL: this._config.AuthURL,
    defaultErrorHandler: this._config.defaultErrorHandler
  });
  
  this._Linkhub_Token_Cash = {};
  this._scopes = ['partner'];
};

BaseService.addMethod = function (object, name, fn) {
  var old = object[name];
  object[name] = function () {
    if (fn.length == arguments.length)
      return fn.apply(this, arguments);
    else if (typeof old == 'function')
      return old.apply(this, arguments);
  };
}

BaseService.prototype._getToken = function (err) {

  var newToken = this._Linkhub_Token_Cash[this._config.LinkID];
  var expired = true;
  var UTCTime = this._tokenBuilder.getTime(this.UseStaticIP, false);

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
    newToken = this._tokenBuilder.newToken(this.ServiceID, '', this._getScopes(), this.IPRestrictOnOff ? null : '*', this.UseStaticIP, false);
    this._Linkhub_Token_Cash[this._config.LinkID] = newToken;
  }

  return newToken;

};

BaseService.prototype._getScopes = function () {
  return this._scopes;
};

BaseService.prototype._checkMajorVersionZero = function () {
  var version = process.version.replace(/[^0-9.]/g, "");
  var majorVersion = version.split('.')[0];
  if (majorVersion > 0) {
    return false;
  } else {
    return true;
  }
};

BaseService.prototype._executeAction = function (options) {
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
      var xDate = _this._tokenBuilder.getTime(_this.UseStaticIP, false);
      headers['x-bc-date'] = xDate;
      var requestData = options.Data;
      var sha256 = crypto.createHash('sha256');
      var signTarget = "";

      signTarget = 'POST\n';
      if (requestData) {
        sha256.update(requestData, 'utf-8');
        var bodyDigest = sha256.digest('base64');
        signTarget += bodyDigest + '\n';
      }
      signTarget += xDate + '\n';
      signTarget += options.uri + '\n';

      var hmac = crypto.createHmac('sha256', new Buffer(_this._config.SecretKey, 'base64'));
      hmac.update(signTarget, 'utf-8');
      var Signature = hmac.digest('base64');

      headers['x-bc-version'] = APIVERSION;
      headers['x-bc-auth'] = Signature;
      if (_this._checkMajorVersionZero()) {
        headers['x-bc-encryptionmode'] = 'CBC';
      } else {
        headers['x-bc-encryptionmode'] = 'GCM';
      }
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

BaseService.prototype._makeRequest = function (options, success, error) {

  if (this._config.ServiceURL == undefined || this._config.ServiceURL.includes("https")) {
    if(this._config.ServiceURL != undefined && this._config.ServiceURL.includes("https")) {
      options.host = this._config.ServiceURL.substring(this._config.ServiceURL.search("https://") + "https://".length);
    }

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

BaseService.prototype._sha256_base64url = function (target) {
  const hash = crypto.createHash('sha256').update(target).digest();
  return hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

BaseService.prototype._encrypt = function (plainText) {
  if (this._checkMajorVersionZero()) {
    return this._AES256CBC(plainText);
  } else {
    return this._AES256GCM(plainText);
  }
};

BaseService.prototype._AES256CBC = function (plainText) {
  const nonce = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(this._config.SecretKey, 'base64'), nonce);
  const nonceCiphertextTag = Buffer.concat([nonce, cipher.update(plainText, 'utf-8'), cipher.final()]);
  return nonceCiphertextTag.toString('base64');
}

BaseService.prototype._AES256GCM = function (plainText) {
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(this._config.SecretKey, 'base64'), nonce);
  const nonceCiphertextTag = Buffer.concat([nonce, cipher.update(plainText, 'utf-8'), cipher.final(), cipher.getAuthTag()]);
  return nonceCiphertextTag.toString('base64');
}

BaseService.prototype._isNullorEmptyTitle = function (multiSignTokens) {
  if (multiSignTokens == null || multiSignTokens.length === 0) return true;
  for (var i = 0; i < multiSignTokens.length; i += 1) {
    const signToken = multiSignTokens[i];
    if (signToken == null) return true;
    if ((signToken.signTitle == null || signToken.signTitle.length === 0) && (signToken.reqTitle == null || signToken.reqTitle.length === 0)) {  
      return true;
    }
  }
  return false;
};

BaseService.prototype._isNullorEmptyTokenType = function (multiSignTokens) {
  if (multiSignTokens == null || multiSignTokens.length === 0) return true;
  for (var i = 0; i < multiSignTokens.length; i += 1) {
    const signToken = multiSignTokens[i];
    if (signToken == null) return true;
    if (signToken.tokenType == null || signToken.tokenType.length === 0) return true;
  }
  return false;
};

BaseService.prototype._isNullorEmptyToken = function (multiSignTokens) {
  if (multiSignTokens == null || multiSignTokens.length === 0) return true;
  for (var i = 0; i < multiSignTokens.length; i += 1) {
    const signToken = multiSignTokens[i];
    if (signToken == null) return true;
    if (signToken.token == null || signToken.token.length === 0) return true;
  }
  return false;
};

BaseService.prototype._stringify = function (obj) {
  return JSON.stringify(obj, function (key, value) {
    return !value ? undefined : value;
  });
};

BaseService.prototype._throwError = function (Code, Message, err) {
  if (err)
    err({ code: Code, message: Message });
  else if (typeof this._config.defaultErrorHandler === 'function')
    this._config.defaultErrorHandler({ code: Code, message: Message });
};