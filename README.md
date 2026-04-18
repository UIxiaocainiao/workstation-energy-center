# Workstation Energy Center

前后端分离的工程级骨架，面向“工位补能站 V1”产品需求，覆盖首页、关于页、后台管理、状态签到、共鸣内容、基础配置与埋点扩展位。

## 技术栈

- Frontend: Next.js 14 (Pages Router) + React + TypeScript + Tailwind CSS + TanStack Query + GSAP + React Bits
- Backend: Node.js + Express + TypeScript + Prisma + SQLite + Zod
- Local Dev: 前后端本地分别运行（默认 SQLite 文件数据库）
- Production: 前端/后端独立部署

## 目录

- `frontend/` 前端项目
- `backend/` 后端项目
- `docker-compose.yml` 可选的本地 PostgreSQL 示例
- `README.md` 使用说明

## 本地启动

### 1) 启动后端
```bash
cd backend
cp .env.example .env.local
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 2) 启动前端
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

前端默认：`http://localhost:3000`
后端默认：`http://localhost:3001`

## 登录注册能力

- 邮箱登录/注册/忘记密码接口：`/api/auth/*`
- 忘记密码闭环：`POST /api/auth/forgot-password` + `POST /api/auth/reset-password`
- 重置密码邮件（Resend，可选）：
  - 在 `backend/.env.local` 配置 `RESEND_API_KEY`、`RESEND_FROM_EMAIL`
  - 可选配置 `RESET_PASSWORD_EMAIL_SUBJECT`
  - 未配置时，开发环境会返回 `debugResetUrl` 便于本地调试流程
- Google 登录（可选）：
  - 在 `backend/.env.local` 配置 `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`GOOGLE_REDIRECT_URI`
  - 本地回调默认：`http://localhost:3001/api/auth/google/callback`
  - Google Console 中的 Authorized redirect URI 必须与上述回调地址一致

## 备注

- 当前 UI 使用工程占位样式，方便后续替换正式设计稿
- 动画能力已预置 GSAP 与 React Bits 封装
- 当前版本聚焦状态签到与共鸣内容两条核心路径
