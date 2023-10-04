const axios = require('axios');
const readlineSync = require('readline-sync');
const crypto = require("./simple_crypto.js");

var password = readlineSync.question('Please enter your router password: ', {
    hideEchoBack: true
  });

password = encode_Html(password);

var jsConfig = '{"csrfNonce": "undefined", "newPassword": "' + password + '", "oldPassword": "' + password + '", "ChangePassword": "false"}';

jsConfig = JSON.parse(jsConfig);
jsConfig = crypto.encryptData(jsConfig);
jsConfig = JSON.stringify(jsConfig);

console.log(jsConfig)

var headers = {
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'CSRF_NONCE': 'undefined',
}

axios.post('http://192.168.0.1/php/ajaxSet_Password.php',
    {configInfo: jsConfig}, {headers: headers})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });



// success: function(msg) {
//     if ("Match" == msg.p_status) {
//         var csrf_nonce = msg.nonce;
//         setSessionStorage("credential","eyAidW5pcXVlIjoiMjgwb2FQU0xpRiIsICJmYW1pbHkiOiI4NTIiLCAibW9kZWxuYW1lIjoiVEcyNDkyTEctODUiLCAibmFtZSI6InRlY2huaWNpYW4iLCAidGVjaCI6dHJ1ZSwgIm1vY2EiOjAsICJ3aWZpIjo1LCAiY29uVHlwZSI6IkxBTiIsICJnd1dhbiI6ImYiLCAiRGVmUGFzc3dkQ2hhbmdlZCI6IllFUyIgfQ==");
//         setSessionStorage("csrf_nonce",csrf_nonce);
// return isLoggedIn();


function encode_Html(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, "&#039;");
}

function decode_Html(str) {
    var map =
    {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function (m) { return map[m]; });
}

