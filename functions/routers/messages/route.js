const express = require('express');

const router = express.Router();

const endPoint = '/messages'

router
  .route(endPoint)
  .get((req, res) => {
    res.json({
      message: 'Called by the GET method'
    });
  })
  .post((req, res) => {
    res.json({
      message: 'Called by the POST method'
    });
  })

router
  .route(`${endPoint}/:id`)
  .put((req, res) => {
    res.json({
      message: `Called by the PUT method  ID: ${req.params.id}`
    });
  })
  .delete((req, res) => {
    res.json({
      message: `Called by the DELETE method  ID: ${req.params.id}`
    });
  })

module.exports = router;