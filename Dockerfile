FROM node:13 as build

LABEL maintainer="edoshor@gmail.com"

WORKDIR /app

ENV REACT_APP_ENV=production \
    REACT_APP_API_BACKEND=/backend/ \
    REACT_APP_ASSETS_BACKEND=/assets/ \
    REACT_APP_IMAGINARY_URL=/imaginary/ \
    REACT_APP_IMAGINARY_INTERNAL_HOST=nginx \
    REACT_APP_LOCALES_BACKEND=/ \
    REACT_APP_CDN_URL=https://cdn.kabbalahmedia.info/ \
    REACT_APP_PUBLIC_BASE=https://kabbalahmedia.info/

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build:svgs && \
    yarn build:scripts && \
    yarn build:css && \
    rm -rf node_modules && \
    yarn install --production --frozen-lockfile

FROM node:13-slim
WORKDIR /app
COPY --from=build /app .

ENV NODE_ENV=production \
    REACT_APP_BASE_URL=https://kabbalahmedia.info/ \
    REACT_APP_API_BACKEND=http://nginx/backend/ \
    REACT_APP_CMS_BACKEND=https://kabbalahmedia.info/cms/ \
    REACT_APP_ASSETS_BACKEND=https://kabbalahmedia.info/assets/ \
    REACT_APP_IMAGINARY_URL=https://kabbalahmedia.info/imaginary/ \
    REACT_APP_IMAGINARY_INTERNAL_HOST=nginx \
    REACT_APP_CDN_URL=https://cdn.kabbalahmedia.info/ \
    REACT_APP_PUBLIC_BASE=https://kabbalahmedia.info/

EXPOSE 3001
CMD [ "node", "/app/server/index.js" ]
