ARG cdn_url="https://cdn.kabbalahmedia.info/"
ARG cdn_hls_url="https://cdn.kab.info/"
ARG public_base="https://kabbalahmedia.info/"
ARG feed_api_url="https://kabbalahmedia.info/feed_api/"
ARG personal_api_url="https://kabbalahmedia.info/backend/my/"
ARG chronicles_url="https://chronicles.kli.one/"
ARG file_trimmer_api_url="https://trim.kab.sh/rest/trim"
ARG mdb_rest_api_url="https://staging-archive.kabbalahmedia.info/mdb-api/"
ARG kc_api_url="https://accounts.kab.info/auth"

FROM bneibaruch/kmedia_base:25 as build

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

ENV REACT_APP_ENV=production \
    REACT_APP_API_BACKEND=/backend/ \
    REACT_APP_ASSETS_BACKEND=/assets/ \
    REACT_APP_IMAGINARY_URL=/imaginary/ \
    REACT_APP_IMAGINARY_INTERNAL_HOST=nginx \
    REACT_APP_LOCALES_BACKEND=/ \
    REACT_APP_CDN_URL=${cdn_url} \
    REACT_APP_CDN_HLS_URL=${cdn_hls_url} \
    REACT_APP_PUBLIC_BASE=${public_base} \
    REACT_APP_FEED=${feed_api_url} \
    REACT_APP_PERSONAL_API_BACKEND=${personal_api_url} \
    REACT_APP_CHRONICLES_BACKEND=${chronicles_url} \
    REACT_APP_FILE_TRIMMER_API=${file_trimmer_api_url} \
    REACT_APP_MDB_REST_API_URL=${mdb_rest_api_url} \
    REACT_KC_API_URL=${kc_api_url}

COPY . .

RUN yarn install --immutable && \
    yarn build:svgs && \
    yarn build:scripts && \
    yarn build:css && \
    yarn install --immutable

FROM node:21.6.0-slim

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
    REACT_APP_BASE_URL=${public_base} \
    REACT_APP_API_BACKEND=http://nginx/backend/ \
    REACT_APP_CMS_BACKEND=${public_base}cms/ \
    REACT_APP_ASSETS_BACKEND=${public_base}assets/ \
    REACT_APP_IMAGINARY_URL=${public_base}imaginary/ \
    REACT_APP_IMAGINARY_INTERNAL_HOST=nginx \
    REACT_APP_CDN_URL=${cdn_url} \
    REACT_APP_CDN_HLS_URL=${cdn_hls_url} \
    REACT_APP_PUBLIC_BASE=${public_base} \
    REACT_APP_FEED=${feed_api_url} \
    REACT_APP_PERSONAL_API_BACKEND=${personal_api_url} \
    REACT_APP_CHRONICLES_BACKEND=${chronicles_url} \
    REACT_APP_FILE_TRIMMER_API=${file_trimmer_api_url} \
    REACT_APP_MDB_REST_API_URL=${mdb_rest_api_url} \
    REACT_KC_API_URL=${kc_api_url}

EXPOSE 3001
ENTRYPOINT ["/app/misc/docker-entrypoint.sh"]

