package cn.lonwin.module.agent.tool;

import java.beans.Introspector;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import cn.lonwin.module.agent.annotation.AgentTool;
import cn.lonwin.module.agent.annotation.AgentToolContract;
import lombok.extern.slf4j.Slf4j;

/**
 * 能力清单自动注册：扫描 {@code @AgentToolContract} 接口，把 {@code impl} 子包里对应的实现类注册成 Spring Bean。
 *
 * <p>目录约定（这也是「新增能力只需加文件、不用改框架」的关键）：
 * <pre>
 * feignclient/WaterCertToolApi.java          ← 契约（@AgentToolContract + @AgentTool 方法）
 * feignclient/impl/WaterCertToolApiImpl.java ← 实现（implements 契约，依赖构造注入）
 * </pre>
 * 不需要加 {@code @Component}，也不需要在任何配置里登记。
 *
 * <h3>为什么 fail-fast</h3>
 * 只写了清单没写实现，若静默跳过，模型会在提示词里看到一个「永远失败」的工具，
 * 比缺少工具更误导。这里直接启动失败，并在异常里给出可直接照抄的修复模板。
 */
@Slf4j
public class AgentToolContractRegistrar implements BeanDefinitionRegistryPostProcessor {

    /**
     * 能力清单所在包（约定优于配置）。
     *
     * <p>固定为 {@code feignclient} 包是有意的：能力清单是「智能体对外能力的唯一入口」，
     * 散落到各处会让「这个智能体到底能做什么」重新变得无法一眼看清。
     */
    static final String CONTRACT_PACKAGE = "cn.lonwin.module.agent.feignclient";

    /** 实现类所在包：{@code feignclient.impl.<契约名>Impl} */
    static final String IMPL_PACKAGE = CONTRACT_PACKAGE + ".impl";

    /** 能力清单集合的 Bean 名 */
    static final String CONTRACTS_BEAN = "agentToolContracts";

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
        List<AgentToolContracts.Contract> contracts = new ArrayList<>();

        for (BeanDefinition candidate : scanner().findCandidateComponents(CONTRACT_PACKAGE)) {
            Class<?> apiInterface = resolve(candidate.getBeanClassName());
            Class<?> implClass = findImpl(apiInterface);
            String beanName = Introspector.decapitalize(implClass.getSimpleName());

            if (!registry.containsBeanDefinition(beanName)) {
                registry.registerBeanDefinition(beanName,
                        BeanDefinitionBuilder.genericBeanDefinition(implClass).getBeanDefinition());
            }
            contracts.add(new AgentToolContracts.Contract(apiInterface, beanName));
            log.info("[agent-tool] 能力清单 {} 注册完成：实现类 {}，工具方法 {} 个",
                    apiInterface.getSimpleName(), implClass.getSimpleName(), toolMethodCount(apiInterface));
        }

        if (!registry.containsBeanDefinition(CONTRACTS_BEAN)) {
            registry.registerBeanDefinition(CONTRACTS_BEAN,
                    BeanDefinitionBuilder.genericBeanDefinition(AgentToolContracts.class)
                            .addConstructorArgValue(contracts)
                            .getBeanDefinition());
        }
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        // 只做 BeanDefinition 注册，BeanFactory 阶段无需干预
    }

    /** 只认接口：默认的扫描器会把接口排除掉 */
    private ClassPathScanningCandidateComponentProvider scanner() {
        ClassPathScanningCandidateComponentProvider scanner =
                new ClassPathScanningCandidateComponentProvider(false) {
                    @Override
                    protected boolean isCandidateComponent(
                            org.springframework.beans.factory.annotation.AnnotatedBeanDefinition beanDefinition) {
                        return beanDefinition.getMetadata().isInterface();
                    }
                };
        scanner.addIncludeFilter(new AnnotationTypeFilter(AgentToolContract.class));
        return scanner;
    }

    private Class<?> resolve(String className) {
        try {
            return ClassUtils.forName(className, getClass().getClassLoader());
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("能力清单类加载失败：" + className, e);
        }
    }

    /**
     * 按命名约定找 {@code feignclient.impl} 包里的实现类。
     *
     * @throws IllegalStateException 找不到或不匹配时抛出，异常信息里带可直接照抄的模板
     */
    private Class<?> findImpl(Class<?> apiInterface) {
        AgentToolContract contract = apiInterface.getAnnotation(AgentToolContract.class);
        String simpleName = contract == null || !StringUtils.hasText(contract.impl())
                ? apiInterface.getSimpleName() + "Impl"
                : contract.impl().trim();
        String className = IMPL_PACKAGE + "." + simpleName;

        Class<?> implClass = loadQuietly(className);
        boolean matched = implClass != null
                && !implClass.isInterface()
                && !Modifier.isAbstract(implClass.getModifiers())
                && apiInterface.isAssignableFrom(implClass);
        if (matched) {
            return implClass;
        }
        throw new IllegalStateException("能力清单 " + apiInterface.getName() + " 缺少实现类 " + className + "，"
                + "请在 feignclient/impl/ 下新增：\n"
                + "    @RequiredArgsConstructor\n"
                + "    public class " + simpleName + " implements " + apiInterface.getSimpleName() + " {\n"
                + "        private final XxxService xxxService;   // 需要什么就注入什么\n"
                + "        // 逐个实现上面的工具方法\n"
                + "    }");
    }

    private Class<?> loadQuietly(String className) {
        try {
            return ClassUtils.forName(className, getClass().getClassLoader());
        } catch (ClassNotFoundException | LinkageError e) {
            return null;
        }
    }

    private long toolMethodCount(Class<?> apiInterface) {
        long count = 0;
        for (Method method : apiInterface.getDeclaredMethods()) {
            if (method.isAnnotationPresent(AgentTool.class)) {
                count++;
            }
        }
        return count;
    }
}
