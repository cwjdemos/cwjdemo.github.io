const WIDTH = 1000
const HEIGHT = 618
const MARGIN_W = 100
const MARGIN_H = 62
let MAX_Y = 0
let MIN_Y = 0
let throttle = false
const MIN_RANGE = 10
function getByRange (x, y, data) {
  if (!data.length) {
    return PRICE.slice(Math.floor(PRICE.length * 2 / 3), PRICE.length)
  }
  let fi = PRICE.findIndex(i => i[0] === data[0][0])
  let li = PRICE.findIndex(i => i[0] === data[data.length - 1][0])
  if (Math.abs(x) > Math.abs(y)) {
    fi += x
    li += x
  } else if (li - fi + y > MIN_RANGE){
    fi -= y
    li += y
  }
  fi = Math.max(0, fi)
  li = Math.min(PRICE.length - 1, li) + 1
  if (fi === 0) li = Math.max(li, fi + MIN_RANGE)
  if (li === PRICE.length) fi = Math.min(fi, li - MIN_RANGE)
  return PRICE.slice(fi, li)
}

function getScaleX (source) {
  function getTs (str) {
    let [y, m, d] = str.split('/')
    y = parseInt('20' + y)
    m -= 1
    let now = new Date()
    now.setFullYear(y, m, d)
    now.setHours(0, 0, 0)
    return now.valueOf()
  }
  let min = getTs(source[0][0])
  let max = getTs(source[source.length - 1][0])
  let offset = (max - min) / 40
  min -= offset
  max += offset
  return function (y) {
    return MARGIN_W + (WIDTH - MARGIN_W) * ((getTs(y) - min) / (max - min))
  }
}

function getScaleY (source) {
  let min = 100
  let max = 0
  for (let arr of source) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) max = arr[i]
      if (arr[i] < min) min = arr[i]
    }
  }
  min -= 1
  max += 1
  MIN_Y = min
  MAX_Y = max
  return function (x) {
    return (HEIGHT - MARGIN_H) * (1 - (x - min) / (max - min))
  }
}

new Vue({
  el: '#app',
  data () {
    return {
      path_92: '',
      path_95: '',
      text: [],
      axis: [],
      dataSet: []
    }
  },
  computed: {},
  methods: {
    render (x = 0, y = 0) {
      let data = getByRange(x, y, this.dataSet)
      this.dataSet = data
      let scaleX = getScaleX(data)
      let scaleY = getScaleY(data)
      let path_92 = path_95 = ''
      this.text = []
      this.axis = []
      for (let i = 0; i < data.length; i++) {
        let cur = data[i]
        let x = scaleX(cur[0])
        let tag = i === 0 ? 'M' : 'L'
        path_92 += `${tag} ${x},${scaleY(cur[1])} `
        path_95 += `${tag} ${x},${scaleY(cur[2])} `
        this.text.push({
          x: x - 25,
          y: HEIGHT - MARGIN_H + (i % 3) * 20,
          content: cur[0],
          clz: 't-x-axis'
        })
        this.text.push({
          x: x - 15,
          y: scaleY(cur[1]),
          content: cur[1],
          clz: 't92'
        })
        this.text.push({
          x: x - 15,
          y: scaleY(cur[2]),
          content: cur[2],
          clz: 't95'
        })
        this.axis.push({
          x1: x,
          y1: 0,
          x2: x,
          y2: 618
        })
      }
      this.path_92 = path_92
      this.path_95 = path_95
      // y axis
      for (let i = Math.ceil(MIN_Y); i < Math.floor(MAX_Y); i++) {
        this.text.push({
          x: 10,
          y: scaleY(i) - 10,
          content: i,
          clz: 'y-axis'
        })
        this.axis.push({
          x1: 0,
          y1: scaleY(i),
          x2: WIDTH,
          y2: scaleY(i)
        })
      }
    }
  },
  mounted () {
    this.render()
    let handleMove = (event) => {
      if (throttle) return
      throttle = true
      this.render(event.movementX, event.movementY)
      setTimeout(() => {
        throttle = false
      }, 60)
    }
    document.addEventListener('mousedown', function () {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', function () {
        document.removeEventListener('mousemove', handleMove)
      })
    })
  }
})
