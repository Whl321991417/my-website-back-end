# 使用官方 Node.js 20 镜像作为构建环境
FROM node:20-alpine as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖，包括开发依赖（用于构建）
RUN npm install

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 使用轻量级 Node.js 镜像作为生产环境
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env ./

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "start:prod"]