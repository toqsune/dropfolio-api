import { AsyncLocalStorage } from "node:async_hooks";

class Context {
  static asyncLocalStorage = new AsyncLocalStorage();

  // Store item
  static setContext = (value, callback) => {
    this.asyncLocalStorage.run(value, callback);
  };

  // Retrieve item
  static getContext = () => {
    return this.asyncLocalStorage.getStore();
  };
}

export default Context;
