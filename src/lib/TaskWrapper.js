export default class TaskWrapper {
  constructor(data) {
    const rawData = data;
    this.getRaw = () => rawData;
  }
}
