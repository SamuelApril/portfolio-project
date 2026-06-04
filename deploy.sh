#!/bin/bash

source ../portfolio/bin/activate

git pull origin main

python manage.py migrate
python manage.py collectstatic --noinput

sudo systemctl restart gunicorn
sudo systemctl restart nginx
