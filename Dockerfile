FROM debian:trixie

RUN apt update && apt upgrade -y && apt install -y \
    make \
    curl

RUN mkdir /transcendence
WORKDIR /transcendence

EXPOSE 3000

CMD ["make", "production"]
