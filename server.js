'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());

const validCountries = [
  'canada',
  'china',
  'france',
  'germany',
  'great britain',
  'hungary',
  'israel',
  'italy',
  'japan',
  'spain',
  'united states'
];

const validGenres = [
  'action',
  'adventure',
  'animation',
  'biography',
  'comedy',
  'crime',
  'documentary',
  'drama',
  'fantasy',
  'grotesque',
  'history',
  'horror',
  'musical',
  'romantic',
  'spy',
  'thriller',
  'war',
  'western',
];

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
      
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

function handleGetGenre(req, res) {
  res.json(validGenres);
}

app.get('/genre', handleGetGenre);

function handleGetCountries(req, res) {
  res.json(validCountries);
}

app.get('/country', handleGetCountries);

function handleMovie(req, res) {
  let response = MOVIES;

  if (req.query.genre) {
    response = response.filter(movie => 
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())    
    );
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())    
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }
  res.json(response);
}

app.get('/movie', handleMovie);

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT)