var navercert = require('./');

navercert.config({
    LinkID: 'TESTER',
    SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',
    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

var navercertService = navercert.NavercertService();


// var Identity = {
//      receiverHP: navercertService._encrypt('01012341234'),
//      receiverName: navercertService._encrypt('홍길동'),
//      receiverBirthday: navercertService._encrypt('19700101'),
//      callCenterNum: '1588-1234',
//      expireIn: 1000
// };

// 본인인증 요청
// navercertService.requestIdentity('023060000088', Identity,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 상태확인
// navercertService.getIdentityStatus('023060000088', '02309070230600000880000000000003',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 본인인증 검증
// navercertService.verifyIdentity('023060000088', '02309070230600000880000000000003',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// var requestSign = {
//      receiverHP: navercertService._encrypt('01012341234'),
//      receiverName: navercertService._encrypt('홍길동'),
//      receiverBirthday: navercertService._encrypt('19700101'),
//      callCenterNum: '15441234',
//      tokenType: 'TEXT',
//      token: navercertService._encrypt('전자서명단건테스트데이터'),
//      reqTitle: '전자서명단건테스트',
//      reqMessage: navercertService._encrypt('전자서명단건테스트데이터'),
//      expireIn: 1000
// };

// 전자서명 요청(단건)
// navercertService.requestSign('023060000088', requestSign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인(단건)
// navercertService.getSignStatus('023060000088', '02309070230600000880000000000004',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 검증(단건)
// navercertService.verifySign('023060000088', '02309070230600000880000000000004',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// var multiSign = {
//     receiverHP: navercertService._encrypt('01012341234'),
//     receiverName: navercertService._encrypt('홍길동'),
//     receiverBirthday: navercertService._encrypt('19700101'),
//     callCenterNum: '15441234',
//     reqTitle: '전자서명복수테스트',
//     reqMessage: navercertService._encrypt('전자서명복수테스트데이터'),
//     expireIn: 1000,
//     tokens: [{
//         tokenType: 'TEXT',
//         token: navercertService._encrypt('테스트')
//     }, {
//         tokenType: 'TEXT',
//         token: navercertService._encrypt('테스트')
//     }]
// };

// 전자서명 요청(복수)
// navercertService.requestMultiSign('023060000088', multiSign,
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 상태확인(복수)
// navercertService.getMultiSignStatus('023060000088', '02309070230600000880000000000005',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });

// 전자서명 검증(복수)
// navercertService.verifyMultiSign('023060000088', '02309070230600000880000000000005',
//     function (response) {
//         console.log(response)
//     }, function (error) {
//         console.log(error)
//     });