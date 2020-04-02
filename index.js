const {merge} = require('lodash')

function a () {}
function b () {}
function c () {}

var arr = [
  {
    name: 'a',
    cb: [
      b,
      a,
    ]
  }
]

var arr2 = [
  {
    name: 'a',
    cb: [
      a,
      b,
    ]
  },
  {
    name: 'b',
    cb: [c]
  }
]

console.log(merge(arr, arr2))