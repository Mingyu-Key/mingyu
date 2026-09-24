# 阁主 · 作品集 - 放图说明

## 📁 项目结构

```
E:\桌面\数据整理\作品集\
├── index.html              ← 主页（Hero + 6 分类入口）
├── op.html                 ← 运营分类页（5 个系统）
├── purchase.html           ← 采购分类页（1 个系统）
├── assistant.html          ← 助理分类页（2 个系统）
├── finance.html            ← 财务分类页（2 个系统）
├── cs.html                 ← 客服分类页（1 个系统）
├── shared.html             ← 公共分类页（4 个系统）
├── contact.html            ← 联系页
├── assets\
│   ├── style.css
│   ├── data.js
│   ├── header.js
│   ├── nav.js
│   ├── category-page.js
│   └── screenshots\        ← 你的图就放这里
└── 零时\                   ← 临时文件（可忽略）
```

## 🖼️ 怎么放图

把每张截图放到 `assets\screenshots\` 目录下，文件名按下方对照表命名即可。

主图命名规则：**`{端口号}-main.jpg`**（必填，每个系统至少 1 张）

| 端口 | 系统名 | 所属分类 | 期望文件名 |
|------|--------|----------|------------|
| 5801 | 电商综合系统 | 主门户 / 公共 | `5801-main.jpg` |
| 5802 | 五部曲数据分析 | 运营 | `5802-main.jpg` |
| 5803 | 企划选品系统 | 采购 | `5803-main.jpg` |
| 5805 | 运营独立面板 | 运营 | `5805-main.jpg` |
| 5806 | 生意参谋选品系统 | 运营 | `5806-main.jpg` |
| 5807 | 派大星对账系统 | 财务 | `5807-main.jpg` |
| 5808 | 代发系统 | 助理 | `5808-main.jpg` |
| 5809 | 工作流系统(局域网) | 公共 | `5809-main.jpg` |
| 5810 | 商品经营数据看板 | 运营 | `5810-main.jpg` |
| 5811 | 十端数据库管家 | 运营 | `5811-main.jpg` |
| 5812 | 售后监控预测系统 | 客服 | `5812-main.jpg` |
| 5813 | 生意参谋市场数据 | 公共 | `5813-main.jpg` |
| 5815 | 成本版本管理 | 助理 | `5815-main.jpg` |
| 5816 | 大店总金额 | 财务 | `5816-main.jpg` |

### 轮播图（可选）

如要同一系统多图轮播，按数字后缀加文件，例如：
- `5802-main.jpg` - 主图
- `5802-1.jpg` - 第 1 张轮播
- `5802-2.jpg` - 第 2 张轮播
- `5802-3.jpg` - 第 3 张轮播

把图放好后，告诉我"图放好了"，我帮你改 JS 让它支持轮播。

## 📐 图片建议

- **尺寸**：建议 1280×800 左右的横图（系统截图原生比例即可）
- **格式**：jpg / png / webp 都行
- **大小**：单张尽量 < 500 KB（作品集加载更快）

## 🔒 隐私提醒

放图前请**遮盖掉敏感信息**：
- 公司名称 / 工厂名称 / 店铺名称
- 真实金额 / 真实订单号 / 真实手机号
- 内部员工姓名

如果想保留系统 UI 框架但隐藏数据，建议截"设置/模板下载/帮助"等无数据页面，或对图做局部打码。

## 🖥️ 本地预览

服务已启动，访问：**`http://localhost:8765/index.html`**

如果服务挂了，重新启动 PowerShell 跑这段：

```powershell
Set-Location 'E:\桌面\数据整理\作品集'
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8765/')
$listener.Start()
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
  if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
  $path = Join-Path (Get-Location) $rel
  if (Test-Path $path -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    $mime = switch ($ext) {
      '.html' { 'text/html; charset=utf-8' }
      '.css'  { 'text/css; charset=utf-8' }
      '.js'   { 'application/javascript; charset=utf-8' }
      '.jpg'  { 'image/jpeg' }
      '.png'  { 'image/png' }
      '.svg'  { 'image/svg+xml' }
      default { 'application/octet-stream' }
    }
    $res.ContentType = $mime
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.StatusCode = 200
  } else {
    $res.StatusCode = 404
  }
  $res.Close()
}
```

## 📞 联系方式（如要改）

- 微信号：编辑 `contact.html` 里的 `15627375961` 即可（全文搜替换）
- 系统链接：编辑 `assets/data.js` 里的 `href` 字段
- 系统描述：编辑 `assets/data.js` 里的 `desc / problem / features` 字段
