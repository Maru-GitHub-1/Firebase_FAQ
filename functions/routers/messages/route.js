const express = require('express');
const admin = require('firebase-admin');
admin.initializeApp();

const router = express.Router();

const endPoint = '/foods'

const db = admin.firestore();

router
  .route(endPoint)
  .get(async (req, res) => {
    const foods = [];
    try {
      // getがプロミスで帰ってくるからasync/await
      const querySnapShot = await db.collection('foods').get()
      querySnapShot.forEach(doc => {
        foods.push({
          foodId: doc.id,
          ...doc.data()
        });
      });
    } catch (error) {
      console.log(error, '@@@@@')
    }
    res.json({
      food: 'Called by the GET method',
      foods
    })
  })
  
  .post(async (req, res) => {
    const { name, weight } = req.body;
    try {
      // .set ではなく .add でIDが自動生成される
      const docRef = await db.collection('foods').add({
        name,
        weight
      });

      const docSnapShot = await docRef.get();
      const createdFood = {
        id: docSnapShot.id,
        ...docSnapShot.data()
      };

      res.json({
        message: 'Called by the POST methods',
        data: createdFood
      });
    } catch (error) {
      console.log(error, '@@@@@');
    }
  })

router
  .route(`${endPoint}/:id`)
  .put((req, res) => {
    res.json({
      food: `Called by the PUT method  ID: ${req.params.id}`
    });
  })
  .delete((req, res) => {
    res.json({
      food: `Called by the DELETE method  ID: ${req.params.id}`
    });
  })

module.exports = router;