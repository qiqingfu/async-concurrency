export default class Queue {
  constructor() {
    this.queues = [];
  }

  push(data) {
    return this.queues.push(data);
  }

  shift() {
    return this.queues.shift();
  }

  isEmpty() {
    return this.queues.length === 0;
  }
}
