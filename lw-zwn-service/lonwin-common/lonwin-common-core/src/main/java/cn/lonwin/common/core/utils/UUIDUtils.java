package cn.lonwin.common.core.utils;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

/**
 * 增强版UUID工具类
 */
public class UUIDUtils {

    private UUIDUtils() {
        // 工具类，不需要实例化
    }

    /**
     * 生成32位UUID（去掉连字符，小写）
     * @return 32位UUID字符串
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 生成32位UUID（去掉连字符，大写）
     * @return 32位大写UUID字符串
     */
    public static String generateUpperCaseUUID() {
        return UUID.randomUUID().toString().replace("-", "").toUpperCase();
    }

    /**
     * 生成标准UUID（包含连字符）
     * @return 36位标准UUID
     */
    public static String generateStandardUUID() {
        return UUID.randomUUID().toString();
    }

    /**
     * 基于名称生成UUID
     * @param name 名称
     * @return 基于名称的UUID
     */
    public static String generateUUIDFromName(String name) {
        return UUID.nameUUIDFromBytes(name.getBytes()).toString().replace("-", "");
    }

    /**
     * 生成短UUID（8位，可用于短链接等场景）
     * @return 8位短UUID
     */
    public static String generateShortUUID() {
        StringBuilder shortUUID = new StringBuilder();
        String uuid = generateUUID();
        // 取UUID的前8个字符
        for (int i = 0; i < 8; i++) {
            char c = uuid.charAt(i);
            // 确保是字母或数字
            if (Character.isLetterOrDigit(c)) {
                shortUUID.append(c);
            } else {
                // 如果不是字母或数字，用随机数字代替
                shortUUID.append(ThreadLocalRandom.current().nextInt(10));
            }
        }
        return shortUUID.toString();
    }

    /**
     * 生成有序UUID（时间+随机数）
     * @return 有序UUID字符串
     */
    public static String generateOrderedUUID() {
        long currentTime = System.currentTimeMillis();
        String timeHex = Long.toHexString(currentTime);
        String randomUUID = generateUUID();
        // 时间戳(13位) + 随机部分(19位) = 32位
        return String.format("%013x%s", currentTime, randomUUID.substring(13));
    }

    /**
     * 批量生成UUID
     * @param count 生成数量
     * @return UUID数组
     */
    public static String[] batchGenerateUUID(int count) {
        if (count <= 0) {
            throw new IllegalArgumentException("数量必须大于0");
        }
        String[] uuids = new String[count];
        for (int i = 0; i < count; i++) {
            uuids[i] = generateUUID();
        }
        return uuids;
    }

    /**
     * 验证是否为有效的32位UUID
     * @param uuid 待验证字符串
     * @return 是否有效
     */
    public static boolean isValidUUID32(String uuid) {
        if (uuid == null || uuid.length() != 32) {
            return false;
        }
        return uuid.matches("^[a-fA-F0-9]{32}$");
    }

    /**
     * 验证是否为有效的36位标准UUID
     * @param uuid 待验证字符串
     * @return 是否有效
     */
    public static boolean isValidUUID36(String uuid) {
        if (uuid == null || uuid.length() != 36) {
            return false;
        }
        return uuid.matches("^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$");
    }

    /**
     * 格式化UUID（从32位格式化为36位标准格式）
     * @param uuid32 32位UUID
     * @return 36位标准格式UUID
     */
    public static String formatToStandardUUID(String uuid32) {
        if (!isValidUUID32(uuid32)) {
            throw new IllegalArgumentException("无效的32位UUID格式");
        }
        return String.format("%s-%s-%s-%s-%s",
                uuid32.substring(0, 8),
                uuid32.substring(8, 12),
                uuid32.substring(12, 16),
                uuid32.substring(16, 20),
                uuid32.substring(20, 32));
    }
}