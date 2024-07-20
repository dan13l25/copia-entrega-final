export class CustomError extends Error {
    constructor(name, message, code, description) {
      super(message);
      this.name = name;
      this.code = code;
      this.description = description;
      this.statusCode = code; 
    }

    static createError({ name, message, code, description }) {
        return new CustomError(name, message, code, description);
    }
}
