package cn.lonwin.module.agent.client;

import java.util.List;

/**
 * 一轮模型回复：正文与工具调用天然分流（原生 function calling）。
 *
 * <p>旧的文本协议里工具指令与最终回答共用 content 通道，编排层只能靠
 * 「正则抠 JSON + 前缀判定」区分轮次性质；原生协议下 {@code tool_calls}
 * 与 {@code content} 是响应里两个独立字段，工具轮 content 为空、回答轮
 * tool_calls 为空，不需要任何猜测。
 *
 * <param>语义：两者都为空视为非法响应（思考模式耗尽额度等），由客户端抛错。
 */
public record ModelReply(String content, List<ToolRequest> toolCalls) {

    /** 模型发起的一次工具调用：arguments 是原始 JSON 字符串，由编排层按工具参数定义解析 */
    public record ToolRequest(String id, String name, String arguments) { }

    public boolean hasToolCalls() {
        return toolCalls != null && !toolCalls.isEmpty();
    }

    public static ModelReply text(String content) {
        return new ModelReply(content, List.of());
    }
}
