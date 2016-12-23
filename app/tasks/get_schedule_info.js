/**
 * Created by XiYe on 12/23/2016.
 */

/**
 * Created by XiYe on 12/1/2016.
 */

const getWeekScheduleInfo = async(user, week) => {
  return user.schedule.toObject()[week - 1]
}

exports.getWeekScheduleInfo = getWeekScheduleInfo
