import React, { Component } from 'react';
import { default as _ } from 'lodash'
import '../App.css';

import skierCrash from '../img/skier_crash.png'
import skierLeft from '../img/skier_left.png'
import skierLeftDown from '../img/skier_left_down.png'
import skierDown from '../img/skier_down.png'
import skierRightDown from '../img/skier_right_down.png'
import skierRight from '../img/skier_right.png'
import tree from '../img/tree_1.png'
import treeCluster from '../img/tree_cluster.png'
import rock1 from '../img/rock_1.png'
import rock2 from '../img/rock_2.png'

const obstacleTypes = [
  'tree',
  'treeCluster',
  'rock1',
  'rock2'
]

class App extends Component {
  state = {
    width: null,
    height: null
  }

  canvasRef = React.createRef()

  skierCrash = React.createRef()
  skierLeft = React.createRef()
  skierLeftDown = React.createRef()
  skierDown = React.createRef()
  skierRightDown = React.createRef()
  skierRight = React.createRef()
  tree = React.createRef()
  treeCluster = React.createRef()
  rock1 = React.createRef()
  rock2 = React.createRef()

  obstacles = []
  skierDirection = 5
  skierMapX =  0
  skierMapY =  0
  skierSpeed =  8

  componentDidMount() {
    this.updateGameDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('keydown', this.handleUserInput);
    this.ctx = this.canvasRef.current.getContext('2d')
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  startGame = () => {
    console.log('starting game.....')
    this.placeInitialObstacles()
    requestAnimationFrame(this.gameLoop)
  }

  handleUserInput = (e) => {
    switch (e.which) {
      case 37: // left
        if(this.skierDirection === 1) {
          this.skierMapX -= this.skierSpeed
          this.placeNewObstacle(this.skierDirection)
        } else {
          this.skierDirection = Math.max(0, this.skierDirection - 1)
        }
        e.preventDefault()
        break
      case 39: // right
        if(this.skierDirection === 5) {
          this.skierMapX += this.skierSpeed
          this.placeNewObstacle(this.skierDirection)
        }
        else {
          this.skierDirection = Math.min(5, this.skierDirection + 1)
        }
        e.preventDefault()
        break
      case 38: // up
        if(this.skierDirection === 1 || this.skierDirection === 5) {
          this.skierMapY -= this.skierSpeed
          this.placeNewObstacle(6)
        }
        e.preventDefault()
        break
      case 40: // down
        this.skierDirection = 3
        e.preventDefault()
        break
    }
  }

  updateGameDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight})
  }

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.state.width, this.state.height)
  }

  moveSkier = () => {
    switch(this.skierDirection) {
      case 2:
        this.skierMapX -= Math.round(this.skierSpeed / 1.4142)
        this.skierMapY += Math.round(this.skierSpeed / 1.4142)

        this.placeNewObstacle()
        break
      case 3:
        this.skierMapY += this.skierSpeed

        this.placeNewObstacle()
        break
      case 4:
        this.skierMapX += this.skierSpeed / 1.4142
        this.skierMapY += this.skierSpeed / 1.4142

        this.placeNewObstacle()
        break
    }
  }

  getSkierAssetName = () => {
    switch(this.skierDirection) {
      case 0: return 'skierCrash'
      case 1: return 'skierLeft'
      case 2: return 'skierLeftDown'
      case 3: return 'skierDown'
      case 4: return 'skierRightDown'
      case 5: return 'skierRight'
    }
  }

  drawSkier = () => {
    console.log('draw skier......')
    const skierImage = this.refs[this.getSkierAssetName()]
    console.log('skierImage: ', skierImage)
    const x = (this.state.width - skierImage.width) / 2
    const y = (this.state.height - skierImage.height) / 2
    console.log('x: ', x)
    console.log('y: ', y)
    this.ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height)
  }

  drawObstacles = () => {
    console.log('drawingObstacles....')
    console.log('this.obstacles: ', this.obstacles)
    this.obstacles.forEach((obstacle) => {
      const obstacleImage = this.refs[obstacle.type]
      const x = obstacle.x - this.skierMapX - obstacleImage.width / 2
      const y = obstacle.y - this.skierMapY - obstacleImage.height / 2

      if(x < -100 || x > this.state.width + 50 || y < -100 || y > this.state.height + 50) {
        return
      }

      this.ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height)
    })
  }

  placeInitialObstacles = () => {
    console.log('placeInitialObstacles....')
    const numberObstacles = Math.ceil(_.random(5, 7) * (this.state.width / 800) * (this.state.height / 500))
    console.log('numberObstacles: ', numberObstacles)

    const minX = -50
    const maxX = this.state.width + 50
    const minY = this.state.height / 2 + 100
    const maxY = this.state.height + 50

    for(let i = 0; i < numberObstacles; i++) {
      this.placeRandomObstacle(minX, maxX, minY, maxY)
    }
    console.log('this.obstacles: ', this.obstacles)

    this.obstacles = _.sortBy(this.obstacles, (obstacle) => {
      const obstacleImage = this.refs[obstacle.type]
      console.log('obstacleImage: ', obstacleImage)
      return obstacle.y + obstacleImage.height
    })
    console.log('sorted this.obstacles: ', this.obstacles)
  }

  placeNewObstacle = () => {
    console.log('placeNewObstacle....')
    const shouldPlaceObstacle = _.random(1, 8)
    if(shouldPlaceObstacle !== 8) return

    const leftEdge = this.skierMapX
    const rightEdge = this.skierMapX + this.state.width
    const topEdge = this.skierMapY
    const bottomEdge = this.skierMapY + this.state.height

    switch(this.skierDirection) {
      case 1: // left
        this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge)
        break
      case 2: // left down
        this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge)
        this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50)
        break
      case 3: // down
        this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50)
        break
      case 4: // right down
        this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge)
        this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50)
        break
      case 5: // right
        this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge)
        break
      case 6: // up
        this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge)
        break
    }
  }

  placeRandomObstacle = (minX, maxX, minY, maxY) => {
    console.log('placing random obstacle at: ', minX, maxX, minY, maxY)
    const obstacleIndex = _.random(0, obstacleTypes.length - 1)

    const position = this.calculateOpenPosition(minX, maxX, minY, maxY)

    this.obstacles.push({
      type : obstacleTypes[obstacleIndex],
      x : position.x,
      y : position.y
    })
  }

  calculateOpenPosition = (minX, maxX, minY, maxY) => {
    const x = _.random(minX, maxX)
    const y = _.random(minY, maxY)

    const foundCollision = _.find(this.obstacles, (obstacle) => {
      return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50)
    })

    if(foundCollision) {
      return this.calculateOpenPosition(minX, maxX, minY, maxY)
    }
    else { return { x, y } }
  }

  checkIfSkierHitObstacle = () => {
    const skierImage = this.refs[this.getSkierAssetName()]
    console.log('skierImage: ', skierImage, this.getSkierAssetName())
    if (skierImage === undefined) debugger
    const skierRect = {
      left: this.skierMapX + this.state.width / 2,
      right: this.skierMapX + skierImage.width + this.state.width / 2,
      top: this.skierMapY + skierImage.height - 5 + this.state.height / 2,
      bottom: this.skierMapY + skierImage.height + this.state.height / 2
    }

    const collision = _.find(this.obstacles, (obstacle) => {
      const obstacleImage = this.refs[obstacle.type]
      const obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + obstacleImage.width,
        top: obstacle.y + obstacleImage.height - 5,
        bottom: obstacle.y + obstacleImage.height
      }

      return this.intersectRect(skierRect, obstacleRect)
    })

    if(collision) this.skierDirection = 0
  }

  intersectRect = (r1, r2) => {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top)
  }

  gameLoop = () => {
    console.log('---------------')
    console.log('gameLoop....')
    this.ctx.save()
    this.clearCanvas()
    this.moveSkier()
    this.checkIfSkierHitObstacle()
    this.drawSkier()
    this.drawObstacles()
    this.ctx.restore()
    requestAnimationFrame(this.gameLoop)
  }

  render() {
    const canvasWidth = this.state.width
    const canvasHeight = this.state.height
    return (
      <div className="App">
        <button onClick={this.startGame}>Start</button>
        <canvas ref={this.canvasRef} width={canvasWidth} height={canvasHeight} />
        <img ref='skierCrash' src={skierCrash} />
        <img ref='skierLeft' src={skierLeft} />
        <img ref='skierLeftDown' src={skierLeftDown} />
        <img ref='skierDown' src={skierDown} />
        <img ref='skierRightDown' src={skierRightDown} />
        <img ref='skierRight' src={skierRight} />
        <img ref='tree' src={tree} />
        <img ref='treeCluster' src={treeCluster} />
        <img ref='rock1' src={rock1} />
        <img ref='rock2' src={rock2} />
      </div>
    )
  }
}

export default App;
