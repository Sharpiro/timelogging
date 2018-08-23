@echo off
rmdir dist /S /Q
CALL node_modules/.bin/ng build --prod --base-href "https://sharpiro.github.io/timelogging/"
move dist\timelogging\* dist
rmdir dist\timelogging /S /Q
CALL angular-cli-ghpages