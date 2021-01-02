## async-concurrency

异步并发分批执行控制

## 例子

```js
import TaskPool from "/src/index.js"

const taskPool = new TaskPool(2)

const task = timeout => new Promise((resolve) => {
  setTimeout(() => {
    resolve(timeout)
  }, timeout)
})

const taskList = [1000, 3000, 200, 1300, 800, 2000]

async function startNoConcurrentControl() {
  console.time()
  await Promise.all(taskList.map(timeout => taskPool.add(task, timeout)))
  console.timeEnd()
}

startNoConcurrentControl()

// 5000ms 左右
```

![](https://tva1.sinaimg.cn/large/0081Kckwly1gm9okoukw7j30y70a474h.jpg)

> 注：图片来自 [descire本篇文章](https://juejin.cn/post/6912220538286899207)

## 选项
new TaskPool(size)
 - size: 异步并发执行数量的阈值
 
 - TaskPool.prototype.add(fn, args) 
    - fn：函数, 返回一个 promise 异步包装器对象
    - args: 传递给 fn 的参数值
   
## 参考

- [参考文章](https://juejin.cn/post/6912220538286899207)
