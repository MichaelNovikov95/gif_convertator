# FROM openresty/openresty:1.21.4.1-0-alpine

# RUN apk update && apk add --no-cache \
#     git \
#     wget \
#     curl \
#     build-base \
#     libmaxminddb-dev \
#     zlib-dev \
#     pcre-dev

# WORKDIR /usr/local/src

# RUN git clone https://github.com/leev/ngx_http_geoip2_module.git

# RUN wget http://nginx.org/download/nginx-1.21.4.tar.gz \
#     && tar zxvf nginx-1.21.4.tar.gz

# WORKDIR /usr/local/src/nginx-1.21.4
# RUN ./configure --with-compat --add-dynamic-module=/usr/local/src/ngx_http_geoip2_module \
#     && make modules \
#     && cp objs/ngx_http_geoip2_module.so /usr/local/openresty/nginx/modules/

# RUN git clone https://github.com/openresty/lua-resty-upstream-healthcheck.git /usr/local/openresty/lualib/resty/upstream/healthcheck

# RUN mkdir -p /etc/nginx/geoip

# COPY GeoLite2-Country.mmdb /etc/nginx/geoip/GeoLite2-Country.mmdb

# COPY conf.d/load_balancer.conf /usr/local/openresty/nginx/conf/nginx.conf

# EXPOSE 80

# CMD ["openresty", "-g", "daemon off;"]
