# 使用官方 Node.js 20 镜像作为构建环境
# 改用完整版本而非 alpine，减少依赖问题
FROM node:20 as build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖，包括开发依赖（用于构建）
# 配置国内镜像源，加速依赖下载
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --legacy-peer-deps --no-cache

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 使用轻量级 Node.js 镜像作为生产环境
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 仅复制生产环境需要的依赖，减少镜像大小
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# 安装生产环境依赖，不包含开发依赖
# 配置国内镜像源，加速依赖下载
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --production --legacy-peer-deps --no-cache

# 创建uploads目录，确保持久化存储
RUN mkdir -p /app/uploads

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "run", "start:prod"]