const animalFunctions = require("./animal");
const FlowerFunctions = require("./handler");

exports.createAnimal = animalFunctions.createAnimal;
exports.getAnimal = animalFunctions.getAnimal;
exports.updateAnimal = animalFunctions.updateAnimal;
exports.deleteAnimal = animalFunctions.deleteAnimal;

exports.createFlower = FlowerFunctions.createFlower;
exports.getFlower = FlowerFunctions.getFlower;
exports.updateFlower = FlowerFunctions.updateFlower;
exports.deleteFlower = FlowerFunctions.deleteFlower;
exports.getAnimalsByFlowerId = FlowerFunctions.getAnimalsByFlowerId;
