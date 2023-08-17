var KakaocertService = require('./lib/KakaocertService');
var PasscertService = require('./lib/PasscertService');

var configuration = { LinkID: '', SecretKey: '' };

exports.config = function (config) {
    configuration = config;
}

exports.KakaocertService = function () {
    if (!this._KakaocertService) {
        this._KakaocertService = new KakaocertService(configuration);
    }
    return this._KakaocertService;
}

exports.PasscertService = function() {
    if (!this._PasscertService) {
        this._PasscertService = new PasscertService(configuration);
    }
    return this._PasscertService;
}
