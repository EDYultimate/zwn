package cn.lonwin.framework.log.entity;

import lombok.Data;

import java.util.Date;

@Data
public class LogEntity {

    public static final Integer STATUS_SUCCESS = 0;
    public static final Integer STATUS_FAIL = 1;
    public static final String LOG_TYPE_LOG = "LOG_TYPE_LOG";
    public static final String LOG_TYPE_OP = "LOG_TYPE_OP";


    /** 业务系统日志表ID */
    private String id;

    /** 操作日志用户IP */
    private String ip;

    /** 日志说明 */
    private String name;

    /** 业务系统生成的操作日志时间 */
    private Date tm;

    /** 同步日志时间 */
    private Date syncTm;

    /** 操作类型 */
    private String type;

    /** 操作用户名 */
    private String username;

    /** 模块名称 */
    private String modelName;

    /** 系统ID */
    private String sysId;

    /** 系统名称 */
    private String sysName;

    /** 系统账号，与SYS_ID对应。 */
    private String account;

    /** 操作人姓名 */
    private String operName;

    /** 请求参数 */
    private String operUrl;

    /** 请求参数 */
    private String operParam;

    /** 返回参数 */
    private String jsonResult;

    /** 错误消息 */
    private String errorMsg;

    /** 操作状态（0正常 1异常） */
    private Integer status;

    /** 业务类型（0其它 1新增 2修改 3删除） */
    private Integer businessType;

    /** 请求方法 */
    private String method;

    /** 请求方式 */
    private String requestMethod;
}
