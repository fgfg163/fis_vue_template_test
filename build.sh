#!/bin/bash
export PATH=/home/fis/npm/bin:$PATH
rm -rf ./output
mkdir ./output
fis3 release -d ./output
cd ./output
mkdir -p webroot
mkdir -p data/smarty/config
cp -r config/* data/smarty/config
cp -r static/ webroot
rm -rf plugin
rm -rf static
rm -rf config
rm xss.php
tar -czvf compete.tar.gz ./*
rm -rf data
rm -rf php
rm -rf template
rm -rf webroot

