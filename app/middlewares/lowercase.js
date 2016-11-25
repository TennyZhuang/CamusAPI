const _lowercase = (rawObj) => {
  const obj = {}

  for (const [k, v] of Object.entries(rawObj)) {
    obj[k.toLowerCase()] = (typeof v === 'object' ? _lowercase(v) : v)
  }

  return obj
}

const lowercase = async (ctx, next) => {
  await next()
  if (typeof ctx.body === 'object') {
    ctx.body = _lowercase(ctx.body)
  }
}

exports.lowercase = lowercase
