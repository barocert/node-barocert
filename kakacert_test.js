var kakaocert = require('./');

kakaocert.config({
    LinkID :'BKAKAO',
    SecretKey : 'egkxYN99ZObjLa3c0nr9/riG+a0VDkZu87LSGR8c37U=',
    //AuthURL : 'http://192.168.0.228:9080',
    //ServiceURL : 'http://192.168.0.228:9081',
    defaultErrorHandler :  function(Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var kakaocertService = kakaocert.KakaocertService();

var requestESign = {
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '01087674117',
    receiverName : '이승환',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '전자서명다건테스트',
    expireIn : 1000,
    token : '전자서명단건테스트데이터',
    tokenType : 'TEXT',
    returnURL : 'https://kakao.barocert.com',
};

var bulkRequestESign = {
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '01087674117',
    receiverName : '이승환',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '전자서명다건테스트',
    expireIn : 1000,
    tokens : '',
    tokenType : 'TEXT',
    returnURL : 'https://kakao.barocert.com'
};

// 전자서명 요청(단건)
kakaocertService.requestESign('023020000003', requestESign, false,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 전자서명 요청(다건)
kakaocertService.bulkRequestESign('023020000003', bulkRequestESign, false,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 전자서명 상태확인(단건)
kakaocertService.getESignState('023020000003', '020090913412000001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 전자서명 상태확인(단건)
kakaocertService.getBulkESignState('023020000003', '020090913412000001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 전자서명 검증(단건)
kakaocertService.verifyESign('023020000003', '020090913412000001','1234',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 전자서명 검증(다건)
kakaocertService.bulkVerifyESign('023020000003', '020090913412000001','1234',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });


var requestCMS = {
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '이승환',
    receiverName : '01087674117',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '인증요청 메시지 제공란',
    expireIn : 1000,
    returnURL : 'https://kakao.barocert.com',
    requestCorp : '청구 기관명란',
    bankName : '출금은행명란',
    bankAccountNum : '9-4324-5117-58',
    bankAccountName : '예금주명 입력란',
    bankAccountBirthday : '19930112',
    bankServiceType : 'CMS'
};

// 출금동의 요청
kakaocertService.requestCMS('023020000003', requestCMS, false,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 출금동의 요청
kakaocertService.getCMSState('023020000003', '020090913390400001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 출금동의 검증
kakaocertService.verifyCMS('023020000003', '020090913390400001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });


var requestVerifyAuth = {
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '01087674117',
    receiverName : '이승환',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '인증요청 메시지 제목란',
    expireIn : 1000,
    token : '본인인증요청토큰',
    returnURL : 'https://kakao.barocert.com'
};

// 본인인증 요청
kakaocertService.requestVerifyAuth('023020000003', requestVerifyAuth, false,
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 본인인증 상태확인
kakaocertService.getVerifyAuthState('023020000003', '020090913401100001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });

// 본인인증 검증
kakaocertService.verifyAuth('023020000003', '020090913401100001',
    function(response){
        console.log(response)
    }, function(error){
        console.log(error)
    });
