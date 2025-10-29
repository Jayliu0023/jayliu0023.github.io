$(document).ready(function() {
    var postsPerPage = 6; // **每页展示 6 篇帖子 (需求 2)**
    var $postsContainer = $('.posts'); // 帖子容器
    var $allArticles = $postsContainer.find('article'); // 所有文章元素
    var totalPosts = $allArticles.length;

    // 1. 读取并排序文章 (需求 3 & 4)
    // 将所有文章放入一个数组，并根据 data-timestamp 属性排序
    var sortedArticles = $allArticles.toArray().sort(function(a, b) {
        var dateA = new Date($(a).data('timestamp'));
        var dateB = new Date($(b).data('timestamp'));
        
        // 越小的页数展示越新的文章 (时间从晚到早，即降序)
        // dateB - dateA 得到一个正值（如果 B 比 A 新），实现 B 在前
        return dateB - dateA; 
    });

    var totalPages = Math.ceil(totalPosts / postsPerPage);
    
    // 清空原始容器中的内容，准备动态渲染
    $postsContainer.empty();

    // 2. 渲染帖子和分页器
    function renderPage(pageNumber) {
        var startIndex = (pageNumber - 1) * postsPerPage;
        var endIndex = startIndex + postsPerPage;
        var pageArticles = sortedArticles.slice(startIndex, endIndex);

        // 2.1 清空并渲染当前页面的文章
        $postsContainer.empty(); 
        
        // Massively 模板每行有 3 篇帖子，所以我们用一个 <section class="posts"> 包裹所有帖子
        // 为了保留模板的网格布局，这里直接添加到 $postsContainer
        $(pageArticles).each(function(index, element) {
            $postsContainer.append(element);
        });
    }

    // 3. 构建并渲染分页器
    function buildPagination(currentPage) {
        var $paginationDiv = $('.pagination');
        $paginationDiv.empty(); // 清空原有分页器

        // 添加上一页按钮 (可选)
        if (currentPage > 1) {
            $paginationDiv.append('<a href="#" class="previous" data-page="' + (currentPage - 1) + '">Prev</a>');
        } else {
            $paginationDiv.append('<a href="#" class="previous disabled">Prev</a>');
        }

        // 添加页码
        for (var i = 1; i <= totalPages; i++) {
            var activeClass = i === currentPage ? ' active' : '';
            $paginationDiv.append('<a href="#" class="page' + activeClass + '" data-page="' + i + '">' + i + '</a>');
        }
        
        // 添加省略号 (简化处理，如果页数过多可以优化)
        // if (totalPages > 10) { $paginationDiv.append('<span class="extra">&hellip;</span>'); }

        // 添加下一页按钮 (可选)
        if (currentPage < totalPages) {
            $paginationDiv.append('<a href="#" class="next" data-page="' + (currentPage + 1) + '">Next</a>');
        } else {
            $paginationDiv.append('<a href="#" class="next disabled">Next</a>');
        }

        // 4. 绑定分页点击事件
        $paginationDiv.off('click', 'a').on('click', 'a', function(e) {
            e.preventDefault();
            var newPage = $(this).data('page');
            if (newPage && newPage !== currentPage) {
                // 重新渲染和构建分页器
                renderPage(newPage);
                buildPagination(newPage); 
                
                // 滚动到顶部
                $('html, body').animate({ scrollTop: $('#main').offset().top - 50 }, 500);
            }
        });
    }

    // 页面加载时：初始化第一页
    renderPage(1);
    buildPagination(1);
});