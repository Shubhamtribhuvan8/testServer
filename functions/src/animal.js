const functions = require("firebase-functions");
const { validateAnimalData, ValidationForAnimal } = require("./validations");
const { generateRandomId } = require("./utils");
const { animalCollection,flowerCollection } = require("./db");

// Create
// Create Animal
exports.createAnimal = functions.https.onRequest(async (request, response) => {
  try {
    const data = request.body.data;
    if (!data) {
      return response.status(400).send("No data found in request body.");
    }
    const { id, Name, flowerId } = data;
    const validationErrors = validateAnimalData(data);
    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }

    const flowerDoc = await flowerCollection.doc(flowerId).get();
    if (!flowerDoc.exists) {
      return response.status(404).send("Flower document not found.");
    }

    await animalCollection.doc(id).set({
      Name,
      flowerId,
    });

    response.status(201).send(`Animal with ID ${id} created successfully.`);
  } catch (error) {
    console.error("Error creating document:", error);
    response.status(500).send("Error creating document.");
  }
});

// Read
exports.getAnimal = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await animalCollection.get();
    const animals = [];
    snapshot.forEach((doc) => {
      animals.push({ id: doc.id, ...doc.data() });
    });

    if (animals.length === 0) {
      res.status(404).send("No documents found!");
    } else {
      res.status(200).json(animals);
    }
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).send("Error getting document");
  }
});

// Update
exports.updateAnimal = functions.https.onRequest(async (request, response) => {
  try {
    const { id, Name } = request?.body?.data;
    const validationErrors = ValidationForAnimal(id);

    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }
    await animalCollection.doc(id).update({ Name: Name });
    response.status(200).send(`Animal with ID ${id} updated successfully.`);
  } catch (error) {
    console.error("Error updating document:", error);
    response.status(500).send("Error updating document.");
  }
});

// Delete
exports.deleteAnimal = functions.https.onRequest(async (request, response) => {
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
    await animalCollection.doc(id).delete();
    response.status(200).send(`Animal with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document:", error);
    response.status(500).send("Error deleting document.");
  }
});
