# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cloudflare Worker API 服务，基于 Hono 框架，使用 pnpm + TypeScript + Wrangler 工具链。

## Commands

- `pnpm dev` — 本地开发（Miniflare 热重载）
- `pnpm deploy` — 部署到 Cloudflare（--minify）
- `npx tsc --noEmit` — 类型检查（无构建步骤，Wrangler 内置 esbuild 处理编译）

## Architecture

- **入口**: `src/index.ts` — 创建 Hono 实例，挂载所有路由子模块
- **路由**: `src/routes/` 下每个文件是一个独立的 Hono 子应用，通过 `app.route('/', ...)` 挂载到根路径
- **新增路由**: 在 `src/routes/` 创建文件，导出 Hono 实例，在 `src/index.ts` 中导入并挂载
- **无绑定**: 未配置 KV/D1/R2 等 Cloudflare 绑定
- **无测试/lint/CI**

## Tech Stack

- Hono v4（路由 + JSX/HTML 模板）
- TypeScript 6（strict, ESNext, Bundler moduleResolution）
- JSX 配置为 `hono/jsx`（`jsxImportSource`）
- Wrangler v4（开发/部署/打包）
- pnpm 11（corepack 管理版本）
