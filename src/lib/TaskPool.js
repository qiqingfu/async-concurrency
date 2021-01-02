import Queue from './Queue';
import TaskWrapper from './TaskWrapper';

export default class TaskPool {
  constructor(size) {
    this.size = size;
    this.queue = new Queue();
  }

  /**
   * 添加任务到队列中
   * @param fn
   * @param args
   * @returns Promise
   */
  add(fn, args) {
    return new Promise((resolve) => {
      const task = new TaskWrapper({ resolve, fn, args });
      this.queue.push(task);

      // 根据 size 来初始并发执行指定数量的任务
      // 当 size 为 0 时, 暂停任务的执行, 等待正在执行的异步任务完成后 size 自增
      if (this.size) this.run();
    });
  }

  /**
   * taskFn 执行结果返回一个 Promise 对象实例
   * @param taskFn Promise
   * @param taskFnArgs any
   * @return Promise
   */
  runTask(taskFn, taskFnArgs) {
    const taskFnResult = Promise.resolve(taskFn(taskFnArgs));

    const end = () => {
      this.size++;
      this.pullTask();
    };

    taskFnResult.then(end, end);

    return taskFnResult;
  }

  /**
   * 分批次拉取队列中的任务执行
   * 直到队列为空或者size为0
   */
  pullTask() {
    if (this.queue.isEmpty() || this.size === 0) return;
    this.run();
  }

  /**
   * 为调度运行真正的 task 前做准备
   */
  run() {
    this.size--;
    const { taskResolve, taskFn, taskFnArgs } = this.getRaw();
    taskResolve(this.runTask(taskFn, taskFnArgs));
  }

  /**
   * 获取队头的任务
   * @returns {{taskFn: *, taskResolve: *, taskFnArgs: *}}
   */
  getRaw() {
    const task = this.queue.shift();
    const { resolve: taskResolve, fn: taskFn, args: taskFnArgs } = task.getRaw();
    return {
      taskResolve,
      taskFn,
      taskFnArgs,
    };
  }
}
