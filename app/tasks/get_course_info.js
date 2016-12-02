/**
 * Created by Songzhou Yang on 12/1/2016.
 */

const getCourse = async (user, courseID) => {
  const course = user.courses.find(c => c.courseID === courseID)
  return course
}

exports.getCourse = getCourse
