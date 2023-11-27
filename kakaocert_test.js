var kakaocert = require('./');

kakaocert.config({
    LinkID: 'TESTER',
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',
    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var kakaocertService = kakaocert.KakaocertService();


//본인인증 요청
// var Identity = {
//     receiverHP: kakaocertService._encrypt('01012341234'),
//     receiverName: kakaocertService._encrypt('홍길동'),
//     receiverBirthday: kakaocertService._encrypt('19700101'),
//     reqTitle: '본인인증 요청 메시지 제목',
//     extraMessage: kakaocertService._encrypt('본인인증 상세 설명'),
//     expireIn: 1000,
//     token: kakaocertService._encrypt('본인인증 요청 원문'),
//     returnURL: 'https://kakao.barocert.com'
// };

// kakaocertService.requestIdentity('023040000001', Identity,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 상태확인
// kakaocertService.getIdentityStatus('023040000001', '02304170230300000040000000000035',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 검증
// kakaocertService.verifyIdentity('023040000001', '02304170230300000040000000000035',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });


// 전자서명 요청(단건)
// var requestSign = {
//     receiverHP: kakaocertService._encrypt('01012341234'),
//     receiverName: kakaocertService._encrypt('홍길동'),
//     receiverBirthday: kakaocertService._encrypt('19700101'),
//     signTitle: '전자서명(단건) 서명 요청 제목',
//     extraMessage: kakaocertService._encrypt('전자서명(단건) 상세 설명'),
//     expireIn: 1000,
//     token: kakaocertService._encrypt('전자서명(단건) 요청 원문'),
//     tokenType: 'TEXT',
//     returnURL: 'https://kakao.barocert.com',
// };

// kakaocertService.requestSign('023040000001', requestSign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인(단건)
// kakaocertService.getSignStatus('023040000001', '02304170230300000040000000000034',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 검증(단건)
// kakaocertService.verifySign('023040000001', '02304170230300000040000000000034',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 요청(복수)
// var multiSign = {
//     receiverHP: kakaocertService._encrypt('01012341234'),
//     receiverName: kakaocertService._encrypt('홍길동'),
//     receiverBirthday: kakaocertService._encrypt('19700101'),
//     reqTitle: '전자서명(복수) 요청 메시지 제목',
//     extraMessage: kakaocertService._encrypt('전자서명(복수) 상세 설명'),
//     expireIn: 1000,
//     tokens: [{
//         signTitle: '전자서명(복수) 서명 요청 제목 1',
//         token: kakaocertService._encrypt('전자서명(복수) 요청 메시지 원문 1')
//     }, {
//         signTitle: '전자서명(복수) 서명 요청 제목 2',
//         token: kakaocertService._encrypt('전자서명(복수) 요청 메시지 원문 2')
//     }],
//     tokenType: 'TEXT',
//     returnURL: 'https://kakao.barocert.com'
// };

// kakaocertService.requestMultiSign('023040000001', multiSign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인(복수)
// kakaocertService.getMultiSignStatus('023040000001', '02304170230300000040000000000036',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 검증(복수)
// kakaocertService.verifyMultiSign('023040000001', '02304170230300000040000000000036',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 요청
// var CMS = {
//     receiverHP: kakaocertService._encrypt('01012341234'),
//     receiverName: kakaocertService._encrypt('홍길동'),
//     receiverBirthday: kakaocertService._encrypt('19700101'),
//     reqTitle: '출금동의 요청 메시지 제목',
//     extraMessage: kakaocertService._encrypt('출금동의 상세 설명'),
//     expireIn: 1000,
//     returnURL: 'https://kakao.barocert.com',
//     requestCorp: kakaocertService._encrypt('청구 기관명란'),
//     bankName: kakaocertService._encrypt('출금은행명란'),
//     bankAccountNum: kakaocertService._encrypt('9-4324-5117-58'),
//     bankAccountName: kakaocertService._encrypt('예금주명 입력란'),
//     bankAccountBirthday: kakaocertService._encrypt('19700101'),
//     bankServiceType: kakaocertService._encrypt('CMS')
// };

// kakaocertService.requestCMS('023040000001', CMS,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 상태확인
// kakaocertService.getCMSStatus('023040000001', '02304170230300000040000000000037',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// // 출금동의 검증
// kakaocertService.verifyCMS('023040000001', '02304170230300000040000000000037',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });


// // 간편로그인 검증
// kakaocertService.verifyLogin('023040000001', '011537db12-a0cd-488c-8a61-522cf9567c11',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });