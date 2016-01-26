#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
apt-get install -y php5-common libapache2-mod-php5 php5-cli
if ! [ -L /var/www ]; then
  rm -rf /var/www
  mkdir -p /vagrant/build
  ln -fs /vagrant/build /var/www
fi
sudo cp /etc/apache2/mods-available/socache_shmcb.load /etc/apache2/mods-enabled/
sudo cp /etc/apache2/mods-available/ssl.* /etc/apache2/mods-enabled/
sudo cp mods-available/proxy_http.load mods-enabled/
sudo rm /etc/apache2/sites-enabled/000-default.conf
sudo a2enmod headers
sudo a2enmod proxy
cp /vagrant/vhosts.conf /etc/apache2/sites-enabled/
sudo apache2ctl graceful
