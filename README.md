# Workstation Energy Center

前后端分离的工程级骨架，面向“工位补能站 V1”产品需求，覆盖首页、关于页、后台管理、状态签到、共鸣内容、基础配置与埋点扩展位。

## 技术栈

- Frontend: Next.js 14 (Pages Router) + React + TypeScript + Tailwind CSS + TanStack Query + GSAP + React Bits
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL + Zod
- Local Dev: Docker Compose 启动 PostgreSQL，前后端本地分别运行
- Production: 前端/后端独立部署，数据库使用托管 PostgreSQL

## 目录

- `frontend/` 前端项目
- `backend/` 后端项目
- `docker-compose.yml` 本地 PostgreSQL
- `README.md` 使用说明

## 本地启动

### 1) 启动数据库
```bash
docker compose up -d postgres
```

### 2) 启动后端
```bash
cd backend
cp .env.example .env.local
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 3) 启动前端
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

前端默认：`http://localhost:3000`
后端默认：`http://localhost:3001`

## 备注

- 当前 UI 使用工程占位样式，方便后续替换正式设计稿
- 动画能力已预置 GSAP 与 React Bits 封装
- 当前版本聚焦状态签到与共鸣内容两条核心路径
