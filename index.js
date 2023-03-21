var KakaocertService = require('./lib/KakaocertService');

var configuration = {LinkID: 'BKAKAO', SecretKey: 'egkxYN99ZObjLa3c0nr9/riG+a0VDkZu87LSGR8c37U='};

exports.config = function (config) {
    configuration = config;
}

exports.KakaocertService = function () {
    if (!this._KakaocertService) {
        this._KakaocertService = new KakaocertService(configuration);
    }
    return this._KakaocertService;
}
