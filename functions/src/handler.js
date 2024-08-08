const functions = require("firebase-functions");
const { validateAnimalData, ValidationForAnimal } = require("./validations");
const { generateRandomId } = require("./utils");
const {flowerCollection,animalCollection} =require('./db')

// Create
exports.createFlower = functions.https.onRequest(async (request, response) => {
  try {
    const data = request?.body?.data;
    const validationErrors = validateAnimalData(data);

    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }
    const { id, Name } = request?.body?.data;
    const firebaseID = generateRandomId();
    await flowerCollection.doc(id).set({ Name, firebaseID });
    response.status(201).send(`flower with ID ${id} created successfully.`);
  } catch (error) {
    console.error("Error creating document:", error);
    response.status(500).send("Error creating document.");
  }
});

// Read
exports.getFlower = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await flowerCollection.get();
    const flower = [];
    snapshot.forEach((doc) => {
        flower.push({ id: doc.id, ...doc.data() });
    });

    if (flower.length === 0) {
      res.status(404).send("No documents found!");
    } else {
      res.status(200).json(flower);
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).send("Error getting document");
  }
});

// Update
exports.updateFlower = functions.https.onRequest(async (request, response) => {
  try {
    const { id, Name } = request?.body?.data;
    const validationErrors = ValidationForAnimal(id);

    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }
    await flowerCollection.doc(id).update({ Name: Name });
    response.status(200).send(`Animal with ID ${id} updated successfully.`);
  } catch (error) {
    console.error("Error updating document:", error);
    response.status(500).send("Error updating document.");
  }
});

// Delete
exports.deleteFlower = functions.https.onRequest(async (request, response) => {
  try {
    const { id } = request.query;
    const validationErrors = ValidationForAnimal(id);

    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }
    if (!id || typeof id !== "string" || id.trim() === "") {
      response.status(400).send("Invalid ID parameter.");
      return;
    }
    await flowerCollection.doc(id).delete();
    response.status(200).send(`Animal with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document:", error);
    response.status(500).send("Error deleting document.");
  }
});

exports.getAnimalsByFlowerId = functions.https.onRequest(async (request, response) => {
    try {
      const { flowerId } = request.query;
      if (!flowerId || typeof flowerId !== "string" || flowerId.trim() === "") {
        console.log('Invalid flower ID parameter');
        return response.status(400).send("Invalid flower ID parameter.");
      }
      const snapshot = await animalCollection.where('flowerId', '==', flowerId).get();
      
      if (snapshot.empty) {
        console.log('No animals found for the provided flower ID');
        return response.status(404).send("No animals found for the provided flower ID.");
      }
  
      const animals = [];
      snapshot.forEach((doc) => {
        animals.push({ id: doc.id, ...doc.data() });
      });
  
      console.log('Found animals:', animals);
      response.status(200).json(animals);
    } catch (error) {
      console.error("Error getting animals:", error);
      response.status(500).send("Error getting animals.");
    }
  });