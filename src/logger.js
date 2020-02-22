import moment from "moment"

function prefixWithDateTime() {
  return `${moment().format("YYYY-MM-DD hh:mm:ss Z")}:`
}

export const logger = {}

logger.log = function (message) {
  console.log(prefixWithDateTime(), message)
}

logger.error = function (message) {
  console.error(prefixWithDateTime(), message)
}
