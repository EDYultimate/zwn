package cn.lonwin.common.core.utils;

import jakarta.servlet.http.HttpServletRequest;

import java.net.InetAddress;
import java.net.URL;

/**
 * 工具类
 */
@SuppressWarnings("rawtypes")
public abstract class ToolSystemUtils {
    /**
     * 获取ip地址返回int型
     *
     * @return ip地址
     * @throws Exception 使用工具失败异常
     */
    public static int gainIpAddressToInt() throws Exception {
        try {
            byte[] bIPAddress = InetAddress.getLocalHost().getAddress();
            // 0
            int iTemp = bIPAddress[0];
            int iIp = iTemp << 24;
            // 1
            iTemp = bIPAddress[1];
            iTemp = iTemp << 16;
            iIp = iIp ^ iTemp;
            // 2
            iTemp = bIPAddress[2];
            iTemp = iTemp << 8;
            iIp = iIp ^ iTemp;
            // 3
            iTemp = bIPAddress[3];
            iIp = iIp ^ iTemp;
            return iIp;
        } catch (Throwable cause) {
            throw new Exception("获取ip地址失败", cause);
        }
    }

    public static String gainIpAddressToString() throws Exception {
        try {

            return InetAddress.getLocalHost().getHostAddress();
        } catch (Throwable cause) {
            throw new Exception("获取ip地址失败", cause);
        }
    }

    /**
     * 获取当前方法名
     *
     * @return String 方法名
     * @throws Exception 使用工具失败异常
     */
    public static String gainMethodName() throws Exception {
        try {
            return new Throwable().getStackTrace()[1].getMethodName();
        } catch (Throwable cause) {
            throw new Exception("在序列化对象时发生IO错误", cause);
        }
    }

    /**
     * 相对路径转换为绝对路径
     *
     * @param strRelativePath 相对路径
     * @return String 决对路径
     * @throws Exception 使用工具失败异常
     */
    public static String toAbsolutePath(String strRelativePath) throws Exception {
        try {
            String strResult = null;
            if (!strRelativePath.startsWith("/")) {
                strRelativePath = "/" + strRelativePath;
            }
            URL urlFile = ToolSystemUtils.class.getResource(strRelativePath);
            if (urlFile == null) {
                strResult = ToolSystemUtils.class.getResource("/").getFile().replaceAll("%20", " ")
                        + strRelativePath.substring(1);
            } else {
                strResult = urlFile.getFile().replaceAll("%20", " ");
            }
            return strResult;
        } catch (Throwable cause) {
            throw new Exception("在转换为绝对路径时发生IO错误", cause);
        }
    }

    public static boolean ping(String ipAddress) throws Exception {
        int timeOut = 3000;  //超时应该在3钞以上
        boolean status = InetAddress.getByName(ipAddress).isReachable(timeOut);     // 当返回值是true时，说明host是可用的，false则不可。
        return status;
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    public static String getPath(HttpServletRequest request) {
        String path = request.getSession().getServletContext().getRealPath("/");//表示到项目的根目录下，要是想到目录下的子文件夹，修改"/"即可
        path = path.replaceAll("\\\\", "/");
        return path;
    }

}
