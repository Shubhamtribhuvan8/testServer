
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

module.exports = {
    db,
    animalCollection: db.collection('Animal'),
    flowerCollection: db.collection('Flower'),
  };
