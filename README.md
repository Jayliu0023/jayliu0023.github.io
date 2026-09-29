# Jay Liu 的博客

站点：[jayliu0023.github.io](https://jayliu0023.github.io/) · 基于 [HTML5 UP Massively](https://html5up.net/massively)。

纯静态 HTML/CSS/JavaScript，GitHub Pages 从 `master` 分支根目录发布，无需安装前端构建工具。

## 目录

- `index.html`：首页栏目索引。
- `biology/`：生物学文章列表和独立文章，不设子分类。
- `machine_learning/`：机器学习文章列表和独立文章，不设子分类。
- `reading/`、`thoughts/`：书单与随想，保留原有文字。
- `assets/`：全站唯一一份样式、脚本和字体。
- `images/`：公共图片和各栏目原有背景。
- `_archive/`：旧模板、旧页面和原始主题压缩包，不发布到站点。
- `scripts/check_site.py`：本地链接、资源路径和基础页面检查。

栏目入口统一为 `目录/index.html`；旧入口保留跳转，已有书签仍可使用。Biology 和 Machine Learning 各放置四篇明确标注的示例文章（可用 `example-article.html` 作为模板），用于展示文章格式；旧子分类地址统一跳转到栏目列表。

## 预览与检查

```sh
python3 -m http.server 8000 --bind 127.0.0.1
# 浏览器打开 http://127.0.0.1:8000
```

提交前运行：

```sh
python3 scripts/check_site.py
```

推送及 Pull Request 会自动运行同一检查。检查只验证仓库内的链接和资源，不代表外部网站始终可用。

## 更新内容

1. 在对应栏目中添加 HTML 文章，可复制该栏目中的 `example-article.html` 作为结构起点，并替换示例标题、摘要和正文，移除示例标记。
2. 填写页面标题、描述和正文；图片统一放入 `images/`，从栏目页用 `../images/文件名` 引用。
3. 在对应栏目的 `index.html` 中添加文章标题、摘要和链接；新文章不要使用 `href="#"` 占位或虚构发布日期。
4. 修改全站导航时同步各正式页面。旧地址跳转页无需更改导航。
5. 运行链接检查，预览桌面和手机布局，然后提交并推送到 `master`。

书单/随想使用原生 `<details><summary>标题</summary>内容</details>`，无需额外 JavaScript，键盘操作和禁用 JavaScript 时也可展开。

样式以 `assets/css/main.css` 为现有主题基础，自定义样式写在 `assets/css/blog.css`。`assets/sass/` 是主题参考源码，历史 CSS 已有手动修改，不能直接重新编译覆盖。`pagination.js` / `collapsible.js` 保留供旧模板参考，当前正式页面未使用。

## 发布与恢复

GitHub 仓库 Settings → Pages 保持 `Deploy from a branch`、`master`、`/(root)`。`_config.yml` 将归档及维护脚本排除在发布之外。

整理前完整版本位于提交 `cd4e306`；可通过 Git 历史查看或恢复。请保留页面底部 HTML5 UP 署名及 `LICENSE.txt`。
