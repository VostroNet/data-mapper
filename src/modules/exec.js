//TODO: move to seperate lib as this is generally
//ill advised running in a unsafe enviroment
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!

export default function exec(input, component) {
  return Function(`"use strict"; var input = ${JSON.stringify(input)};${component.script}`)(); //eslint-disable-line
}
