const validateAnimalData = (data) => {
  const errors = [];
  if (!data.id || typeof data.id !== "string" || data.id.trim() === "") {
    errors.push('Invalid or missing "id".');
  }
  if (!data.Name || typeof data.Name !== "string" || data.Name.trim() === "") {
    errors.push('Invalid or missing "Name".');
  }
  return errors;
};

const ValidationForAnimal = (id) => {
  const errors = [];
  if (!id) {
    errors.push('Invalid or missing "id".');
  }
  return errors;
};

module.exports = { validateAnimalData, ValidationForAnimal };
