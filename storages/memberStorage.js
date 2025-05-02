// storages/usersStorage.js
// This class lets us simulate interacting with a database.
class MemberStorage {
    constructor() {
      this.storage = {};
      this.id = 0;
    }
  
    addUser({ firstName, lastName, email, password }) {
      const id = this.id;
      const status = false
      this.storage[id] = { id, firstName, lastName, email,  password, status};
      this.id++;
    }
  
    getUsers() {
      return Object.values(this.storage);
    }
  
    getUser(id) {
      return this.storage[id];
    }
  
    updateUser(id, { firstName, lastName, email, password }) {
      this.storage[id] = { id, firstName, lastName, email, password };
    }
  
    deleteUser(id) {
      delete this.storage[id];
    }

  }
  // Rather than exporting the class, we can export an instance of the class by instantiating it.
  // This ensures only one instance of this class can exist, also known as the "singleton" pattern.
  module.exports = new MemberStorage();
  