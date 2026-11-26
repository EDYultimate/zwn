package cn.lonwin.common.core.base;

import cn.lonwin.common.core.model.dto.LoginUserDTO;
import cn.lonwin.common.core.model.dto.PageQuery;
import cn.lonwin.common.core.utils.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.function.Function;

/**
 * web层通用数据处理
 */
public class BaseController
{
    protected final Logger logger = LoggerFactory.getLogger(BaseController.class);

    /**
     * 获取用户对象
     * @return
     */
    protected LoginUserDTO getLoginUser(){
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        // 用户的信息在TokenInterceptor的拦截器中，通过token获取到用户信息，设置到session中
        Object userinfo1 = request.getSession().getAttribute("userinfo");
        if(userinfo1 == null){
            return null;
        }
        return (LoginUserDTO)userinfo1;
    }

    /**
     * 是否为分页，两个参数：pageSize和pageNum都不可为空。
     */
    public boolean isPage(HttpServletRequest request) {
        String pageNumber = request.getParameter("pageNumber");
        String pageNum = request.getParameter("pageNum");
        String pageSize = request.getParameter("pageSize");
        return StringUtils.isNotEmpty(pageNumber)  || StringUtils.isNotEmpty(pageNum) || StringUtils.isNotEmpty(pageSize);
    }

    /**
     * 得到分页的内容。
     * @param request
     * @return
     */
    public PageRequest getPageRequest_jpa(HttpServletRequest request){
        Integer pageNumber = 0, pageSize = 10;
        pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? request.getParameter("pageNum") : request.getParameter("pageNumber"));
        // 默认是从第0页开始。jpa的方式。Mybatis的方式是默认从第1页开始。所以再使用mybatis的时候需要pageNumer+1
        if(pageNumber > 0){
            pageNumber = pageNumber-1;
        }
        pageSize = Integer.parseInt(request.getParameter("pageSize"));
        PageRequest pageable = PageRequest.of(pageNumber, pageSize);
        return pageable;
    }

    /**
     * 得到分页的内容。
     * @param request
     * @return
     */
    public PageRequest getPageRequest_mybatis(HttpServletRequest request){
        Integer pageNumber = 0, pageSize = 10;
        pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? request.getParameter("pageNum") : request.getParameter("pageNumber"));
        // 默认是从第0页开始。jpa的方式。Mybatis的方式是默认从第1页开始。所以再使用mybatis的时候需要pageNumer+1
        pageSize = Integer.parseInt(request.getParameter("pageSize"));
        PageRequest pageable = PageRequest.of(pageNumber, pageSize);
        return pageable;
    }

    // ==================== 通用分页（推荐使用） ====================

    /**
     * 构建 MyBatis-Plus 分页对象（直接从 PageQuery 获取参数，无需 HttpServletRequest）
     * <p>
     * 使用方式：
     * <pre>
     * &#64;GetMapping("/getList")
     * public Result getList(WrWhsBQuery query) {
     *     Page&lt;WrWhsB&gt; page = buildPage(query);
     *     Page&lt;WrWhsB&gt; result = service.findListByPage(page, query);
     *     return Result.success(new PageResult(result.getRecords(), result.getTotal()));
     * }
     * </pre>
     *
     * @param query 继承 PageQuery 的查询对象
     * @return MyBatis-Plus 分页对象
     */
    public <T> com.baomidou.mybatisplus.extension.plugins.pagination.Page<T> buildPage(PageQuery query) {
        int pageNum = (query != null && query.getPageNum() != null) ? query.getPageNum() : 1;
        int pageSize = (query != null && query.getPageSize() != null) ? query.getPageSize() : 20;
        return new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNum, pageSize);
    }

    /**
     * 通用分页查询（封装分页逻辑，Controller 中一行代码搞定）
     * <p>
     * 使用方式：
     * <pre>
     * &#64;GetMapping("/getList")
     * public Result getList(WrWhsBQuery query) {
     *     return pageQuery(query, page -&gt; service.findListByPage(page, query));
     * }
     * </pre>
     *
     * @param query    继承 PageQuery 的查询对象
     * @param executor 分页查询函数（接收 Page，返回填充数据后的 Page）
     * @return 分页结果
     */
    public <T, Q extends PageQuery> cn.lonwin.common.core.model.vo.Result pageQuery(
            Q query,
            Function<com.baomidou.mybatisplus.extension.plugins.pagination.Page<T>,
                    com.baomidou.mybatisplus.extension.plugins.pagination.Page<T>> executor) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<T> page = buildPage(query);
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<T> result = executor.apply(page);
        return cn.lonwin.common.core.model.vo.Result.success(
                "查询成功",
                new cn.lonwin.common.core.model.vo.PageResult(result.getRecords(), result.getTotal())
        );
    }
}