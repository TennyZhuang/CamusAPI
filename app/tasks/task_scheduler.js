/**
 * Created by tianyizhuang on 30/11/2016.
 */

class TaskQueue {
  async add(func, args, interval = null) {
    func(args)
    if (interval) {
      setInterval(() => {
        func(args)
      }, interval)
    }
  }
}

module.exports = new TaskQueue()
