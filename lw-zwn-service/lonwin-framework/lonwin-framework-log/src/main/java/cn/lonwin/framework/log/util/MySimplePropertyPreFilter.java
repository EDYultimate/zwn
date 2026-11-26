package cn.lonwin.framework.log.util;

import com.alibaba.fastjson2.JSONWriter;
import com.alibaba.fastjson2.filter.PropertyPreFilter;

/**
 * fastjson2属性过滤器，序列化时排除指定的敏感属性（如密码字段）。
 */
public class MySimplePropertyPreFilter implements PropertyPreFilter {

    /** 默认排除的敏感属性 */
    public static final String[] EXCLUDE_PROPERTIES = {"password", "oldPassword", "newPassword", "confirmPassword"};

    /** 要排除的属性数组 */
    private final String[] excludeProperties;

    public MySimplePropertyPreFilter(String... excludeProperties) {
        this.excludeProperties = excludeProperties;
    }

    public MySimplePropertyPreFilter() {
        this.excludeProperties = EXCLUDE_PROPERTIES;
    }

    @Override
    public boolean process(JSONWriter jsonWriter, Object object, String propertyName) {
        for (String excludeProp : excludeProperties) {
            // 属性名在排除列表中返回false（过滤该属性），否则保留
            if (excludeProp.equals(propertyName)) {
                return false;
            }
        }
        return true;
    }
}
