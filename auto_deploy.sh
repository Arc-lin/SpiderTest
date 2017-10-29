#!/bin/bash

echo "Start deployment"
echo "pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
chmod 777 auto_deploy.sh
echo "Finished."
