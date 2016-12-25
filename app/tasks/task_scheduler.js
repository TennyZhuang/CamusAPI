/**
 * Created by tianyizhuang on 30/11/2016.
 */

const uuid = require('uuid')

class TaskQueue {
  constructor() {
    this.timers = new Map()
  }

  async add(func, args, interval = null) {
    func(args)
    if (interval) {
      const eventID = uuid.v4()
      const timer = setInterval(() => {
        func(args)
      }, interval)
      this.timers.set(eventID, timer)
      return eventID
    }

    return ''
  }

  async cancel(eventID) {
    const timer = this.timers.get(eventID)
    if (timer) {
      clearInterval(timer)
    }

    this.timers.delete(eventID)
  }
}

module.exports = new TaskQueue()
