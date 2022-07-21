FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install software-properties-common -y && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get install -y \
    python3.8 \
    python3-pip \
    wget \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/TencentARC/GFPGAN/archive/refs/tags/v1.3.4.tar.gz && \
    tar -xzf v1.3.4.tar.gz && \
    rm v1.3.4.tar.gz && \
    mv GFPGAN-1.3.4 GFPGAN

WORKDIR /GFPGAN

RUN pip3 install torch && \
    pip3 install -r requirements.txt && \
    pip3 install realesrgan


COPY ./entry-script.sh /entry-script.sh

ADD aws-lambda-rie-arm64 /usr/bin/aws-lambda-rie

RUN chmod +x /entry-script.sh && \
    chmod +x /usr/bin/aws-lambda-rie

ENTRYPOINT ["/entry-script.sh"]