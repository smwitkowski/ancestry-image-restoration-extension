FROM public.ecr.aws/lambda/python:3.8

COPY requirements.txt .

RUN pip install torch==1.12.0
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

COPY src/app.py ${LAMBDA_TASK_ROOT}

CMD ["app.handler"]