const Core = require('@alicloud/pop-core');
/*生成指定长度的随机数*/
function randomCode(length) {
    var chars = ['0','1','2','3','4','5','6','7','8','9'];
    var result = ""; 
    for(var i = 0; i < length ; i ++) {
        var index = Math.ceil(Math.random()*9);
        result += chars[index];
    }
    return result;
}
exports.randomCode = randomCode;

/*向指定号码发送指定验证码*/
function sendCode(phone, code, callback) {
    var client = new Core({
        accessKeyId: 'LTAI5tKb******Da2TFkTG',//your-access-key-id
        accessKeySecret: 'bNy6Q**********jyYP',//your-access-key-secret
        // securityToken: '<your-sts-token>', // use STS Token
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
      });
      var params = {
        "SignName": "阿里云短信测试",
        "TemplateCode": "SMS_154950909",//测试签名模板
        "PhoneNumbers": phone,
        "TemplateParam": JSON.stringify({ 'code': code }) //指定要发送的验证码
      }
      var requestOption = {
        method: 'POST',
        formatParams: false
      };
      //发送结果
      client.request('SendSms', params, requestOption).then((result) => {//成功
        callback(1)
        console.log(JSON.stringify(result));
      }, (ex) => {//失败
        callback(0)
        console.log(ex);
      })
}
exports.sendCode = sendCode;
