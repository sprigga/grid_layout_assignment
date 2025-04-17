FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /app

WORKDIR /app
# RUN mkdir -p /app/staticfiles
COPY . /app

# COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# COPY . /app

RUN python manage.py collectstatic --noinput
# RUN python manage.py collectstatic --noinput || echo "Collectstatic failed (probably due to no static files). Ignoring."

CMD ["gunicorn", "grid_layout.wsgi:application", "--bind", "0.0.0.0:8000"]