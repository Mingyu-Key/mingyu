# 阁主作品集

面向 AI 业务赋能、ERP 与内部工具实践的静态个人作品集。

## 本地预览

这是零依赖静态站点。直接打开 `index.html` 即可查看基础内容；如需完整模拟 HTTP 环境，可使用任意静态文件服务在项目根目录启动。

## Cloudflare Pages 部署

1. 将本目录推送到 GitHub。
2. 在 Cloudflare Pages 新建项目并连接仓库。
3. Framework preset 选择 `None`，Build command 留空，Build output directory 填 `/`。
4. 在 Pages 的 Custom domains 中添加 `gezhu.top` 与 `www.gezhu.top`。
5. 将域名 DNS 托管切换到 Cloudflare，待 HTTPS 生效后再停止本地 frpc 与 Node 服务。

本仓库刻意不包含本地内网穿透配置、日志、临时工具和旧版文件。
