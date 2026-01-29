# Copyright Layer5, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

include .github/build/Makefile.show-help.mk

## Install docs.layer5.io dependencies on your local machine.
## See https://gohugo.io/categories/installation
setup:
	npm install

## Run docs.layer5.io on your local machine with draft and future content enabled.
site: check-go
	hugo server -D -F --disableFastRender --ignoreCache
	
## Run docs.layer5.io on your local machine. Alternate method.
site-fast:
	gatsby develop

## Build site on your local machine.
build:
	hugo --gc --minify

## Build site for production deployment.
build-prod:
	hugo --gc --minify --baseURL "/"
	touch public/.nojekyll
	echo "www.kanvas.new" > public/CNAME

## Empty build cache and run site on your local machine.
clean: 
	hugo --cleanDestinationDir 
	make site

.PHONY: setup build build-prod site clean site-fast check-go docker

check-go:
	@echo "Checking if Go is installed..."
	@command -v go > /dev/null || (echo "Go is not installed. Please install it before proceeding."; exit 1)
	@echo "Go is installed."

## Build and run docs website within a Docker container
docker:
	docker compose watch