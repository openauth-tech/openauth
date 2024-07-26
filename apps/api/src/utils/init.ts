import { IS_PRODUCTION } from '../constants/env'

export function init() {
  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    return this.toString()
  }

  if (IS_PRODUCTION) {
    console.debug = () => {}
    console.log = () => {}
  }
}
