FROM node:6
Maintainer "Othmane AIT AMI - othmane.aitami@gmail.com"

##install programs
RUN apt-get -y update && apt-get install -y sudo vim curl sudo nano git lsof supervisor cron

COPY env/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /var/log/supervisor && mkdir -p /var/log/babel

WORKDIR /unemRest

RUN npm install -g nodemon babel-cli babel-preset-env yo generator-rest 

EXPOSE 8888

CMD ["supervisord"]