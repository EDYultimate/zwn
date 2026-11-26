package cn.lonwin.module.agent.datascope;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;

import cn.lonwin.common.core.exception.BusinessException;
import cn.lonwin.module.agent.config.AgentProperties;
import cn.lonwin.module.agent.support.AgentDataScope;

/**
 * 数据权限切面测试：开关、注入、清理、严格模式。
 *
 * <p>用 {@link AspectJProxyFactory} 直接织入，不启动 Spring 容器，保证这几条规则在任何重构后都还成立。
 */
class DataScopeAspectTest {

    /** 被测目标：方法内按需读取单位，方法体里没有任何权限参数 */
    static class ScopedService {

        @DataScope
        public String unitOfCurrentRequest() {
            return DataScopeContext.unitCode();
        }

        @DataScope
        public String failWithBusinessException() {
            DataScopeContext.unitCode();
            throw new BusinessException(500, "模拟业务异常");
        }

        public String withoutAnnotation() {
            return DataScopeContext.unitCode();
        }
    }

    private ScopedService proxy(boolean enabled, boolean strict, String unitCode) {
        AgentProperties properties = new AgentProperties();
        properties.getDataScope().setEnabled(enabled);
        properties.getDataScope().setStrict(strict);

        AgentDataScope dataScope = new AgentDataScope() {
            @Override
            public String resolveUnitCodeOrNull() {
                return unitCode;
            }

            @Override
            public String resolveUnitCode() {
                if (unitCode == null) {
                    throw new BusinessException(403, "未获取到当前用户的单位信息（deptCode）");
                }
                return unitCode;
            }
        };

        AspectJProxyFactory factory = new AspectJProxyFactory(new ScopedService());
        factory.addAspect(new DataScopeAspect(properties, dataScope));
        return factory.getProxy();
    }

    @Test
    @DisplayName("开关关闭：不解析、不注入，业务读到 null")
    void shouldNotInjectWhenDisabled() {
        assertThat(proxy(false, false, "U001").unitOfCurrentRequest()).isNull();
        assertThat(DataScopeContext.active()).isFalse();
    }

    @Test
    @DisplayName("开关开启：切面注入单位，调用结束后上下文被清理")
    void shouldInjectAndClear() {
        assertThat(proxy(true, false, "U001").unitOfCurrentRequest()).isEqualTo("U001");
        // 线程复用场景下必须清干净，否则下一个请求会串到上一个用户的单位
        assertThat(DataScopeContext.active()).isFalse();
        assertThat(DataScopeContext.unitCode()).isNull();
    }

    @Test
    @DisplayName("异常路径：方法抛异常也要清理上下文")
    void shouldClearOnException() {
        ScopedService proxy = proxy(true, false, "U001");

        assertThatThrownBy(proxy::failWithBusinessException).isInstanceOf(BusinessException.class);
        assertThat(DataScopeContext.active()).isFalse();
    }

    @Test
    @DisplayName("非严格模式：解析不到单位时放行，业务读到 null")
    void shouldPassThroughWhenUnitMissing() {
        assertThat(proxy(true, false, null).unitOfCurrentRequest()).isNull();
    }

    @Test
    @DisplayName("严格模式：解析不到单位时抛出 403")
    void shouldRejectWhenStrictAndUnitMissing() {
        ScopedService proxy = proxy(true, true, null);

        assertThatThrownBy(proxy::unitOfCurrentRequest)
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("单位信息");
    }

    @Test
    @DisplayName("未标注 @DataScope 的方法不受影响")
    void shouldIgnoreUnannotatedMethod() {
        assertThat(proxy(true, false, "U001").withoutAnnotation()).isNull();
    }
}
