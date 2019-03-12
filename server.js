'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies.json');

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan('dev'));
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

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});