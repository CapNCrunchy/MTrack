# MTrack

## Dependencies
- Install NPM dependencies for frontend (run from /mtrack/frontend):
    - `npm install`
- Install Django dependencies (run from /mtrack):
    - `pip install pipenv`
    - `pipenv install`

## To get running
First, use npm to build the frontend (run from /mtrack/frontend):
- `npm run build` (builds frontend in mtrack/frontend/build)

Then, for Django (run from /mtrack):
- `python manage.py runserver`

# For development
- Make sure the URL variable in mtrack/frontend/src/App.js is set correctly (either pythonanywhere.com or localhost)
