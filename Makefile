# Copyright Meshery Authors.
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

## Install site dependencies on your local machine.
## See https://gohugo.io/categories/installation
setup:
	npm install

## Run site on your local machine with draft and future content enabled.
site: check-go
	hugo server -D -F --disableFastRender --ignoreCache
	
## Build site on your local machine.
build:
	hugo

## Empty build cache and run site on your local machine.
clean: 
	hugo --cleanDestinationDir 
	make site

.PHONY: setup build site clean site-fast check-go docker setup-claude

check-go:
	@echo "Checking if Go is installed..."
	@command -v go > /dev/null || (echo "Go is not installed. Please install it before proceeding."; exit 1)
	@echo "Go is installed."

## Build and run site within a Docker container
docker:
	docker compose watch

## Set up local Claude Code configuration from contrib/claude/ templates.
## Run once after cloning if you use Claude Code as your AI coding assistant.
setup-claude:
	@mkdir -p .claude/agents .claude/skills/new-section
	@cp contrib/claude/agents/*.md .claude/agents/
	@cp contrib/claude/skills/new-section/SKILL.md .claude/skills/new-section/
	@rm -rf .claude/skills/gsap-animations .claude/skills/scroll-animations .claude/skills/glass-morphism
	@ln -s $(CURDIR)/.agents/skills/kanvas-animations/skills/gsap             .claude/skills/gsap-animations
	@ln -s $(CURDIR)/.agents/skills/kanvas-animations/skills/scroll-animations .claude/skills/scroll-animations
	@ln -s $(CURDIR)/.agents/skills/kanvas-animations/skills/glass-morphism   .claude/skills/glass-morphism
	@cp contrib/claude/settings-template.json .claude/settings.json
	@echo "Claude Code setup complete."
	@echo "Set GITHUB_PERSONAL_ACCESS_TOKEN in your environment for GitHub MCP."
