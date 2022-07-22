FROM public.ecr.aws/lambda/python:3.8

RUN yum install wget ffmpeg libsm6 libxext6 mesa-libGL -y

COPY GFPGAN-models.txt .
COPY facexlib-weights.txt  .

RUN wget -i GFPGAN-models.txt -P ${LAMBDA_TASK_ROOT}/models
RUN wget -i facexlib-weights.txt -P ${LAMBDA_TASK_ROOT}/facexlib/weights

COPY requirements.txt .

RUN pip install torch==1.12.0
RUN pip install -r requirements.txt 

COPY src/app.py ${LAMBDA_TASK_ROOT}

CMD ["app.handler"]