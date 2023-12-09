var passcert = require('./');

passcert.config({
    LinkID: 'TESTER',
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',
    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var passcertService = passcert.PasscertService();

// 본인인증 요청
// var Identity = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
//     receiverBirthday: passcertService._encrypt('19700101'),
//     reqTitle: '본인인증 요청 메시지 제목',
//     reqMessage: passcertService._encrypt('본인인증 요청 메시지'),
//     callCenterNum: '1600-9854',
//     expireIn: 1000,
//     token: passcertService._encrypt('본인인증 요청 원문'),
//     userAgreementYN: true,
//     receiverInfoYN: true,
// };

// passcertService.requestIdentity('023070000014', Identity,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 상태확인
// passcertService.getIdentityStatus('023070000014', '02304170230300000040000000000035',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// var IdentityVerify = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
// };

// 본인인증 검증
// passcertService.verifyIdentity('023070000014', '02304170230300000040000000000035', IdentityVerify, 
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 요청
// var Sign = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
//     receiverBirthday: passcertService._encrypt('19700101'),
//     reqTitle: '전자서명 요청 메시지 제목',
//     reqMessage: passcertService._encrypt('전자서명 요청 메시지'),
//     callCenterNum: '1600-9854',
//     expireIn: 1000,
//     token: passcertService._encrypt('전자서명 요청 원문'),
//     tokenType: 'URL',
//     userAgreementYN: true,
//     receiverInfoYN: true,
//     originalTypeCode: 'TR',
//     originalURL: 'https://www.passcert.co.kr',
//     originalFormatCode: 'HTML',
// };

// passcertService.requestSign('023070000014', Sign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인
// passcertService.getSignStatus('023070000014', '02304170230300000040000000000034',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// var SignVerify = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
// };

// 전자서명 검증
// passcertService.verifySign('023070000014', '02304170230300000040000000000034', SignVerify,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 요청
// var CMS = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
//     receiverBirthday: passcertService._encrypt('19700101'),
//     reqTitle: '출금동의 요청 메시지 제목',
//     reqMessage: passcertService._encrypt('출금동의 요청 메시지'),
//     callCenterNum: '1600-9854',
//     expireIn: 1000,
//     token: passcertService._encrypt('출금동의 요청 원문'),
//     userAgreementYN: true,
//     receiverInfoYN: true,
//     bankName: passcertService._encrypt('국민은행'),
//     bankAccountNum: passcertService._encrypt('9-****-5117-58'),
//     bankAccountName: passcertService._encrypt('홍길동'),
//     bankServiceType: passcertService._encrypt('CMS'),
//     bankWithdraw: passcertService._encrypt('1,000,000원'),
// };

// passcertService.requestCMS('023070000014', CMS,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 요청
// passcertService.getCMSStatus('023070000014', '02304170230300000040000000000037',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// var CMSVerify = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
// };

// // 출금동의 검증
// passcertService.verifyCMS('023070000014', '02304170230300000040000000000037', CMSVerify,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 간편로그인 요청
// var Login = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
//     receiverBirthday: passcertService._encrypt('19700101'),
//     reqTitle: '간편로그인 요청 메시지 제목',
//     reqMessage: passcertService._encrypt('간편로그인 요청 메시지'),
//     callCenterNum: '1600-9854',
//     expireIn: 1000,
//     token: passcertService._encrypt('간편로그인 요청 원문'),
//     userAgreementYN: true,
//     receiverInfoYN: true,
// };

// passcertService.requestLogin('023070000014', Login,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 간편로그인 상태확인
// passcertService.getLoginStatus('023070000014', '02304170230300000040000000000035',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// var LoginVerify = {
//     receiverHP: passcertService._encrypt('01012341234'),
//     receiverName: passcertService._encrypt('홍길동'),
// };

// 간편로그인 검증
// passcertService.verifyLogin('023070000014', '02304170230300000040000000000035', LoginVerify, 
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });
