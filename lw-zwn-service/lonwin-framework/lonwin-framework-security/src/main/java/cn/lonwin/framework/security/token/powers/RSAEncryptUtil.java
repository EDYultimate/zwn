package cn.lonwin.framework.security.token.powers;


//import org.apache.tomcat.util.codec.binary.Base64;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

/**
 * RSA加密算法
 */
public class RSAEncryptUtil {


    /**
     * 参数分别代表
     */
    private static final String ALGORITHMS = "RSA";

    /**
     * 密钥长度，DH算法的默认密钥长度是1024 密钥长度必须是64的倍数，在512到65536位之间.
     **/
    private static final int KEY_SIZE = 1024;

    /**
     * 随机生成密钥对.
     *
     * @return
     */
    public static Map<String, String> genKeyPair() {
        try {
            // KeyPairGenerator类用于生成公钥和私钥对，基于RSA算法生成对象
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(ALGORITHMS);
            // 初始化密钥对生成器，密钥大小为96-1024位
            keyPairGen.initialize(KEY_SIZE);
            // 生成一个密钥对，保存在keyPair中
            KeyPair keyPair = keyPairGen.generateKeyPair();
            // 得到私钥
            RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
            // 得到公钥
            RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
            // 得到公钥字符串
            String publicKeyString = Base64.encodeBase64String(publicKey.getEncoded());
            // 得到私钥字符串
            String privateKeyString = Base64.encodeBase64String(privateKey.getEncoded());
            Map<String, String> map = new HashMap<>();
            map.put("publicKey", publicKeyString);
            map.put("privateKey", privateKeyString);
            return map;
        } catch (Exception e) {
        }
        return null;
    }

    /**
     * 生成公钥，私钥
     *
     * @return 返回值
     * @throws NoSuchAlgorithmException
     */
    public static HashMap<String, String> generatePublicPrivateKeys() throws NoSuchAlgorithmException {
        HashMap<String, String> keys = new HashMap<>();
        // KeyPairGenerator:秘钥对生成器对象
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(ALGORITHMS);
        // 生成密钥对
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        // 生成私钥
        PrivateKey privateKey = keyPair.getPrivate();
        // 生成公钥
        PublicKey publicKey = keyPair.getPublic();
        // 获取私销的字节数组
        byte[] privateKeyEncoded = privateKey.getEncoded();
        // 获取公销字节数组
        byte[] publicKeyEncoded = publicKey.getEncoded();
        // 使用base64进行编码
        String privateEncodeString = Base64.encodeBase64String(privateKeyEncoded);
        String publicEncodeString = Base64.encodeBase64String(publicKeyEncoded);
        // 打印公钥和私钥
        System.out.println("privateEncodeString=" + privateEncodeString);
        System.out.println("publicEncodeString=" + publicEncodeString);
        keys.put("privateKey", privateEncodeString);
        keys.put("publicKey", publicEncodeString);
        return keys;
    }

    /**
     * @param content          未加密的字符串
     * @param publicKeyEncoded 公钥
     * @return
     * @throws Exception
     */
    public static String encrypt(String content, byte[] publicKeyEncoded) throws Exception {
        // 创建key的工厂
        KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHMS);
        // 创建 已编码的公钥规格
        X509EncodedKeySpec encPubKeySpec = new X509EncodedKeySpec(publicKeyEncoded);
        // 获取指定算法的密钥工厂, 根据 已编码的公钥规格, 生成公钥对象
        PublicKey publicKey = keyFactory.generatePublic(encPubKeySpec);
        // 获取指定算法的密码器
        Cipher cipher = Cipher.getInstance(ALGORITHMS);
        // 初始化密码器（公钥加密模型）
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        // 加密数据, 返回加密后的密文
        byte[] cipherData = cipher.doFinal(content.getBytes(StandardCharsets.UTF_8));
        // 采用base64算法进行转码,避免出现中文乱码
        return Base64.encodeBase64String(cipherData);
    }

    /**
     * @param encodeEncryptString 未解密的字符串
     * @param privateKeyEncoded   私钥
     * @return
     * @throws Exception
     */
    public static String decrypt(String encodeEncryptString, byte[] privateKeyEncoded) throws Exception {
        // 创建key的工厂
        KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHMS);
        // 创建 已编码的私钥规格
        PKCS8EncodedKeySpec encPriKeySpec = new PKCS8EncodedKeySpec(privateKeyEncoded);
        // 获取指定算法的密钥工厂, 根据 已编码的私钥规格, 生成私钥对象
        PrivateKey privateKey = keyFactory.generatePrivate(encPriKeySpec);
        // 获取指定算法的密码器
        Cipher cipher = Cipher.getInstance(ALGORITHMS);
        // 初始化密码器（私钥解密模型）
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        // 解密数据, 返回解密后的明文
        byte[] plainData = cipher.doFinal(Base64.decodeBase64(encodeEncryptString));
        // 采用base64算法进行转码,避免出现中文乱码
        return new String(plainData, StandardCharsets.UTF_8);
    }

    public static void main(String[] args) throws Exception {

        // 请求端
        Map<String, String> genKeyPair = genKeyPair();
        // 请求端公钥
        String publicKey = genKeyPair.get("publicKey");
        // 请求端私钥
        String privateKey = genKeyPair.get("privateKey");

        System.out.println(privateKey);
        System.out.println(publicKey);

        String a = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmwAZy5QH7i3CY92IkNdFn4dy1SLMa43Xgdf56mR/kcOwxpFc+wK/Ujs7mWErM0Oxq7bnpilQe8lMWXT3C/TIndP3dYcuelBh4+TKboIinRAPcRLpad38ErNL7ZIMhHCQfsO9KqI02GtjCa4tVTPA26XZMhiR/BBuBegGiyFY9dwIDAQAB";
        String b = "TUlJQ2RnSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NBbUF3Z2dKY0FnRUFBb0dCQUplUEE5OFNvNzFxVUJvRGdJSTJzZ05CNVV1SzZ4dTRSbktJNDdQa3NjM1dDcnNsTWZ2NEE2c3dtN2h3dzg1MllMM083bTkxNkpoZElqdm96MHBFSTcxL1IyM1RMdUdGYjl2VGUxd2dlODFiYWJtZTJuSDVGbVZ3cmNxS1VMcjl6YlRzVEhPell0bEN0eVdvWWx6bDFIaVM2bGVsOS9BYWdST1RLYkx2bFhlVkFnTUJBQUVDZ1lBclc3blN6cVZUWWgvS1lXZ1pXSVp5MGg1RUQxa1ZsQkZyWU9ncnBlaU1KNGpvWTBxNmVBaXNwL3BVdU1YN3dmZ0pOVE1YWmhjRng5Y3NabjB2RlBGWUtvZUNyRDNwR0xXSlJZRU9hVUZxZXo0REtQT213WjNsczZGc1pBTlNqUnJmTEVwTWVGbUhQaHpPZWIyNGZoVTBPMUloSmZNdTI0TElzVWRTVTY2TWdRSkJBTjhHWnVDWlFxZzRBKzBZVlFGa3hkM0ZJZmZhWlNjMWJKVm5JMXlBWTNlak1kUWE1WmRxZGVjdnVyS1VWeGxQN1p2cHRMdTVDZ3NVL0NnSk5PbmZzaUVDUVFDdDk1UkZRSGdlZlZSQ3RndXcrT2w0WGFCeU1GazE3VVVpYy9GNmVMNU9WNjBKbmtXalo2a2UvSGRQUTNWQ2VyVW1FNlpzUzgzc2pmM2liNWg3M0Q3MUFrRUFyVm5RaFNzYlFKMnBqNVNtSGhzeUlScWxPSDJzdWprd1dVQjluOXk3YzdhSmVKQWZmUDNtL3ZkK2FtZ2ErelhCUHJyOUhCekx6YWxXQmRpQ0pIY1hnUUpBYlNMMmQ0TjhWOVJVT2cydXcvVkRzbWs2TUtpNExxYU5TcEhtR2VrSnFtaENlOWc0NDh3eVF1Z3JpU1JPdWNmMVFNL3ZCZDJBY0RpYjM2UVd5dzFleVFKQVpqc3FDcTZ3ZEdvVEhhTkZxTVQrRG0rMlNTRVhIU0dpL2N5aE94M1FXUC9vNjRnWE81VW1iZ2ViOVRXUjVObnpoajlweE9pZVVvRHY1b2RJOVZHdjF3PT0=";

        byte[] publicKeyBytes = a.getBytes("UTF-8");
        byte[] privateKeyBytes = b.getBytes("UTF-8");

        String conent = "10.3.34.106&&2024-01-17 15:10:10";
        String encrypt = RSAEncryptUtil.encrypt(conent, Base64.decodeBase64(publicKeyBytes));

        //------------------------RSA算法解密
//        String decrypt = RSAEncryptUtil.decrypt(encrypt, Base64.decodeBase64(privateKeyBytes));

        System.out.println("-----------------加密------------------");
        System.out.println(encrypt);
        System.out.println("-----------------解密------------------");
//        System.out.println(decrypt);

    }
}