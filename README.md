[![Netlify Status](https://api.netlify.com/api/v1/badges/98f22135-da33-4d41-8c8a-88a1f4098479/deploy-status)](https://app.netlify.com/sites/izens-quiz/deploys)

![image|30%](https://user-images.githubusercontent.com/25678351/92551283-78e79f00-f212-11ea-99bd-7750b8107da2.png)

Izen's Fullstack Quiz Application
=================================

A fullstack quiz web application written in Django + ReactJS, hosted on AWS EC2, Heroku, and Netlify. 

Motivation
----------

To build a fullstack web application with backend API written with Django REST framework, and frontend UI written in ReactJS. A small-scale application showcasing utilization of relational database, object-relational-mapping, REST protocols, and UI design. Users start by choosing a quiz, which loads the related questions. On submission of answers, the app tells the user how he/she did.

Documentation
-------------
The fullstack is broken into 2 main layers: backend & frontend. 

* **The backend** is written in Django, with the API production provided by Djagno's REST framework, and the database is stored in PostgreSQL hosted on an AWS EC2 instance. While SQLite3 is the default disk-based storage for many languages, due to the ephemeral stack nature of the hosting platform (Heroku's Dyno) containers, a persisting database was needed.

* **The frontend** is a single page application written in JavaScript, with a heavy reliance on the React framework and Redux arhcitecture. As this application was a small-scaled application, the API calls are centered in the `frontend/App.js` file.

For more information on the backend & frontend architecture, please visit the `README.md` pertaining to each individual folders.

The live servers can be found at these links:
* **Backend:** https://izen-quiz-backend.herokuapp.com/
* **Frontend:** https://izens-quiz.netlify.app/

Installation
------------
Installation and local hosting can be found in the `/backend` and `/frontend` folders.
