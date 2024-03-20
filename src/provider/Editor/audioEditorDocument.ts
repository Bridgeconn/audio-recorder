export default class documentData {
  public static async create(data: Uint8Array): Promise<documentData> {
    return new documentData();
  }
}
