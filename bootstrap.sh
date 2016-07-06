sudo apt-get install php5-xdebug

VHOST=$(cat <<EOF
Listen 9000

<VirtualHost *:80>
    UseCanonicalName Off
    VirtualDocumentRoot /var/www/html/%1
    <Directory /var/www/html/%1>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName busybody-tx.scot.dev
    ServerAlias www.busybody-tx.scot.dev
    DocumentRoot /var/www/html/busybody-tx/web
    <Directory /var/www/html/busybody-tx/web>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:9000>
    UseCanonicalName Off
    DocumentRoot /var/www/sync/datamgr
    <Directory /var/www/sync/datamgr>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
#testdfdsaf d
EOF
)
echo "${VHOST}" > /etc/apache2/sites-available/000-default.conf

sudo a2enmod vhost_alias

service apache2 restart
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jre-headless
# create db for each site in /sites

# echo "SET default_storage_engine=INNODB;" | mysql -u root -proot
# for f in /var/www/sites/*; do
#     if [ -d ${f} ]; then
# 	echo "MySQL: CREATE DATABASE IF NOT EXISTS $(basename $f)"
# 	echo "CREATE DATABASE IF NOT EXISTS $(basename $f) DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;" | mysql -u root -proot
#     fi
# done
# echo "Database creation finished"
#
# sudo echo  "PATH=$PATH:/var/www/sync/bin" >> /etc/environment

rsync -a /var/www/sync/sites/ /var/www/html/
