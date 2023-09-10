ARG cdn_url="https://cdn.kabbalahmedia.info/"
ARG cdn_hls_url="https://cdn.kab.info/"
ARG public_base="https://kabbalahmedia.info/"
ARG feed_api_url="https://kabbalahmedia.info/feed_api/"
ARG personal_api_url="https://kabbalahmedia.info/backend/my/"
ARG chronicles_url="https://chronicles.kli.one/"
ARG file_trimmer_api_url="https://trim.kab.sh/rest/trim"
ARG mdb_rest_api_url="https://staging-archive.kabbalahmedia.info/mdb-api/"
ARG kc_api_url="https://accounts.kab.info/auth"

FROM bneibaruch/kmedia_base:10 as build

LABEL maintainer="edoshor@gmail.com"

ARG cdn_url
ARG cdn_hls_url
ARG public_base
ARG feed_api_url
ARG personal_api_url
ARG chronicles_url
ARG file_trimmer_api_url
ARG mdb_rest_api_url
ARG kc_api_url

WORKDIR /app

ENV NEXT_PUBLIC_ENV=production \
    NEXT_PUBLIC_API_BACKEND=/backend/ \
    NEXT_PUBLIC_ASSETS_BACKEND=/assets/ \
    NEXT_PUBLIC_IMAGINARY_URL=/imaginary/ \
    NEXT_PUBLIC_IMAGINARY_INTERNAL_HOST=nginx \
    NEXT_PUBLIC_LOCALES_BACKEND=/ \
    NEXT_PUBLIC_CDN_URL=${cdn_url} \
    NEXT_PUBLIC_CDN_HLS_URL=${cdn_hls_url} \
    NEXT_PUBLIC_PUBLIC_BASE=${public_base} \
    NEXT_PUBLIC_FEED=${feed_api_url} \
    NEXT_PUBLIC_PERSONAL_API_BACKEND=${personal_api_url} \
    NEXT_PUBLIC_CHRONICLES_BACKEND=${chronicles_url} \
    NEXT_PUBLIC_FILE_TRIMMER_API=${file_trimmer_api_url} \
    NEXT_PUBLIC_MDB_REST_API_URL=${mdb_rest_api_url} \
    REACT_KC_API_URL=${kc_api_url}

COPY . .

RUN yarn install --frozen-lockfile && \
    yarn build:svgs && \
    yarn build:scripts && \
    yarn build:css && \
    rm -rf node_modules && \
    yarn install --production --frozen-lockfile

FROM node:16-slim

ARG cdn_url
ARG cdn_hls_url
ARG public_base
ARG feed_api_url
ARG personal_api_url
ARG chronicles_url
ARG file_trimmer_api_url
ARG mdb_rest_api_url
ARG kc_api_url

WORKDIR /app
COPY --from=build /app .

ENV NODE_ENV=production \
    NEXT_PUBLIC_BASE_URL=${public_base} \
    NEXT_PUBLIC_API_BACKEND=http://nginx/backend/ \
    NEXT_PUBLIC_CMS_BACKEND=${public_base}cms/ \
    NEXT_PUBLIC_ASSETS_BACKEND=${public_base}assets/ \
    NEXT_PUBLIC_IMAGINARY_URL=${public_base}imaginary/ \
    NEXT_PUBLIC_IMAGINARY_INTERNAL_HOST=nginx \
    NEXT_PUBLIC_CDN_URL=${cdn_url} \
    NEXT_PUBLIC_CDN_HLS_URL=${cdn_hls_url} \
    NEXT_PUBLIC_PUBLIC_BASE=${public_base} \
    NEXT_PUBLIC_FEED=${feed_api_url} \
    NEXT_PUBLIC_PERSONAL_API_BACKEND=${personal_api_url} \
    NEXT_PUBLIC_CHRONICLES_BACKEND=${chronicles_url} \
    NEXT_PUBLIC_FILE_TRIMMER_API=${file_trimmer_api_url} \
    NEXT_PUBLIC_MDB_REST_API_URL=${mdb_rest_api_url} \
    REACT_KC_API_URL=${kc_api_url}

EXPOSE 3001
ENTRYPOINT ["/app/misc/docker-entrypoint.sh"]

