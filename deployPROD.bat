git config --global user.email "infotech.idms@gmail.com"

git config --global user.name "IDMS"

call heroku login

call git init

call git add .

call git commit -m "Adding the stream"

rem call heroku create erp-decaltechprod

rem this if for Prod deployment
call heroku git:remote -a erp-decaltechprod

call git push heroku master

pause