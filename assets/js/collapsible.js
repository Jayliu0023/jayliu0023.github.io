$(document).ready(function() {
    // 监听所有 class 为 'collapsible' 的按钮的点击事件
    $('.collapsible').on('click', function() {
        // 切换当前按钮的 'active' 类
        $(this).toggleClass('active');

        // 找到紧随其后的 div.content
        var $content = $(this).next('.content');

        // 检查当前内容的高度
        if ($content.css('max-height') !== '0px') {
            // 如果目前是展开的，则收起它
            $content.css('max-height', '0px');
        } else {
            // 如果目前是收起的 (max-height: 0)，则展开它
            // 使用 scrollHeight 属性来获取内容的实际高度，从而实现完全展开
            $content.css('max-height', $content.prop('scrollHeight') + 'px');
        }
    });

    // 页面加载时，如果按钮带有 .active 类，则默认展开
    $('.collapsible.active').each(function() {
        var $content = $(this).next('.content');
        $content.css('max-height', $content.prop('scrollHeight') + 'px');
    });
});