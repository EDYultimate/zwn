package cn.lonwin;


import java.nio.charset.StandardCharsets;
import java.util.Base64;

import java.io.UnsupportedEncodingException;

public class SmsDemo {

        public static void sendSms(String phoneNumber, String smsContent){
        String sign = "【天津市水文水资源管理中心】";
        // 1. 构建 JSON 参数
        StringBuffer msg = new StringBuffer();
        msg.append(smsContent + sign);

//            msgutf8 = new String(msg.toString().getBytes(StandardCharsets.UTF_8));
            String msgcontent = Base64.getEncoder().encodeToString(msg.toString().getBytes(StandardCharsets.UTF_8));
            System.out.println(msgcontent);


        int strLen=0;


    }


    public static void main(String[] args) {
        String smsContent = "您好，测试短信！";
        sendSms("18622652112", smsContent);
    }
}
