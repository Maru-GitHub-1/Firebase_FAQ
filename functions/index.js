const functions = require('firebase-functions');
const express = require('express');
const foodsRouter = require('./routers/messages/route')

const app = express();
app.use('/', foodsRouter)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.api = functions.https.onRequest(app);