# Prerequesits
* *Nix system ;)
* Python 3
* pip
* virtualenv

# Installation
Create virtual environment and install all of the dependencies:
~~~bash
# Create isolated virtual environment
virtualenv --no-site-package -p python3 venv
source venv/bin/activate
# Install all dependencies listed in the file
pip install -r requirements.txt
~~~

# Running
~~~bash
cd wallet
# Install front end dependecies and colelct resulting static files
python manage.py bower install
python manage.py collectstatic

# Ensure database schema is created correctly
python manage.py migrate

# run actual server
python manage.py runserver
~~~
You may now visit localhost:8080 in your browser and see the results.