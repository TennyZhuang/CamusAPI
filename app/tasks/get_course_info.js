/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const getCourse = async(user, courseID) => {
  return user.courses.find(c => c.courseID === courseID || c.courseNS === courseID)
}

exports.getCourse = getCourse
