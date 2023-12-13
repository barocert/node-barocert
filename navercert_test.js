var navercert = require('./');

navercert.config({
    LinkID: 'TESTER',
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',
    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var navercertService = navercert.NavercertService();


// 본인인증 요청
// var Identity = {
//      receiverHP: navercertService._encrypt('01012341234'),
//      receiverName: navercertService._encrypt('홍길동'),
//      receiverBirthday: navercertService._encrypt('19700101'),
//      callCenterNum: '1588-1234',
//      expireIn: 1000
// };

// navercertService.requestIdentity('023090000021', Identity,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 상태확인
// navercertService.getIdentityStatus('023090000021', '02309070230900000210000000000003',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 검증
// navercertService.verifyIdentity('023090000021', '02309070230900000210000000000003',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 요청(단건)
// var requestSign = {
//      receiverHP: navercertService._encrypt('01012341234'),
//      receiverName: navercertService._encrypt('홍길동'),
//      receiverBirthday: navercertService._encrypt('19700101'),
//      reqTitle: '전자서명(단건) 요청 메시지 제목',
//      reqMessage: navercertService._encrypt('전자서명(단건) 요청 메시지'),
//      callCenterNum: '15441234',
//      tokenType: 'TEXT',
//      token: navercertService._encrypt('전자서명(단건) 요청 원문'),
// //   tokenType: 'HASH',
// //   token: navercertService._encrypt(navercertService._sha256_base64url('전자서명(단건) 요청 원문')),
//      expireIn: 1000
// };

// navercertService.requestSign('023090000021', requestSign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인(단건)
// navercertService.getSignStatus('023090000021', '02309070230900000210000000000004',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 검증(단건)
// navercertService.verifySign('023090000021', '02309070230900000210000000000004',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 요청(복수)
// var multiSign = {
//     receiverHP: navercertService._encrypt('01012341234'),
//     receiverName: navercertService._encrypt('홍길동'),
//     receiverBirthday: navercertService._encrypt('19700101'),
//     reqTitle: '전자서명(복수) 요청 메시지 제목',
//     reqMessage: navercertService._encrypt('전자서명(복수) 요청 메시지'),
//     callCenterNum: '15441234',
//     expireIn: 1000,
//     tokens: [{
//         tokenType: 'TEXT',
//         token: navercertService._encrypt('전자서명(복수) 요청 원문 1')
// //      tokenType: 'HASH',
// //      token: navercertService._encrypt(navercertService._sha256_base64url('전자서명(단건) 요청 원문 1')),
//     }, {
//         tokenType: 'TEXT',
//         token: navercertService._encrypt('전자서명(복수) 요청 원문 2')
// //      tokenType: 'HASH',
// //      token: navercertService._encrypt(navercertService._sha256_base64url('전자서명(단건) 요청 원문 2')),
//     }]
// };

// navercertService.requestMultiSign('023090000021', multiSign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인(복수)
// navercertService.getMultiSignStatus('023090000021', '02309070230900000210000000000005',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 검증(복수)
// navercertService.verifyMultiSign('023090000021', '02309070230900000210000000000005',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 요청
// var CMS = {
//      receiverHP: navercertService._encrypt('01012341234'),
//      receiverName: navercertService._encrypt('홍길동'),
//      receiverBirthday: navercertService._encrypt('19700101'),
//      reqTitle: '출금동의 요청 메시지 제목',
//      reqMessage: navercertService._encrypt('출금동의 요청 메시지'),
//      callCenterNum: '1588-1234',
//      expireIn: 1000,
//      requestCorp: navercertService._encrypt('청구기관'),
//      bankName: navercertService._encrypt('출금은행'),
//      bankAccountNum: navercertService._encrypt('123-456-7890'),
//      bankAccountName: navercertService._encrypt('홍길동'),
//      bankAccountBirthday: navercertService._encrypt('19700101'),
// };

// navercertService.requestCMS('023090000021', CMS,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 상태확인
// navercertService.getCMSStatus('023090000021', '02312090230900000210000000000005',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 출금동의 검증
// navercertService.verifyCMS('023090000021', '02312090230900000210000000000005',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });