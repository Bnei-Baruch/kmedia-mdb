export class SerializableMap extends Map {
  toJSON() {
    return Object.fromEntries(this);
  }
}
