#!/usr/bin/env sh
bundle exec rake chat:build_javascripts
git add public/javascripts/datajam/chat/app-compiled.js
git add public/javascripts/datajam/chat/app-compiled.min.js