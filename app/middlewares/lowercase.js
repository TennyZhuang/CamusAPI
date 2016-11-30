const _lowercase = (rawObj) => {
  let obj = null
  if (rawObj instanceof Array) {
    console.log(rawObj)
    obj = []
    for (const v of rawObj) {
      obj.push(_lowercase(v))
    }
  } else if (rawObj instanceof Object) {
    obj = {}
    for (const [k, v] of Object.entries(rawObj)) {
      obj[k.toLowerCase()] = _lowercase(v)
    }
  } else {
    obj = rawObj
  }

  return obj
}

const lowercase = async (ctx, next) => {
  await next()
  ctx.body = _lowercase(ctx.body)
}

module.exports = lowercase
