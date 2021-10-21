#!/bin/bash

set -ex

TARGET=gs://figurl/mcmc-monitor-1

yarn build
gsutil -m cp -R ./build/* $TARGET/