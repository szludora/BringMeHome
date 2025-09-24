export class ChangeLanguageError extends Error {
  constructor(message) {
    super(message);
    this.name = "ChangeLanguageError";
  }
}
