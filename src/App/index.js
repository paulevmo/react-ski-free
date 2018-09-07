import React, { Component } from 'react'
import { default as _ } from 'lodash'
import '../App.css'

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

import Score from './Score'

import Skier from './Skier'
import Obstacle from './Obstacle'

class App extends Component {
  state = {
    width: null,
    height: null,
    gameStatus: 'NEW'
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

  componentDidMount() {
    this.updateGameDimensions();

    window.addEventListener('resize', this.updateWindowDimensions);
    window.addEventListener('keydown', this.handleUserInput);

    this.ctx = this.canvasRef.current.getContext('2d')

    this.Skier = new Skier()
    this.Obstacle = new Obstacle()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  startGame = () => {
    this.Obstacle.placeInitial(this.refs, this.state.width, this.state.height)
    requestAnimationFrame(this.gameLoop)
    this.setState({ gameStatus: 'PLAYING' })
  }

  handleUserInput = (e) => {
    switch (e.which) {
      case 37:
        if(this.Skier.direction === 1) {
          this.Skier.moveLeft()
          this.placeNewObstacle()
        } else {
          this.Skier.turnLeft()
        }
        e.preventDefault()
        break
      case 39:
        if(this.Skier.direction === 5) {
          this.Skier.moveRight()
          this.placeNewObstacle()
        }
        else {
          this.Skier.turnRight()
        }
        e.preventDefault()
        break
      case 40:
        this.Skier.turnDown()
        e.preventDefault()
        break
      default:
        break
    }
  }

  updateGameDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight})
  }

  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.state.width, this.state.height)
  }

  placeNewObstacle = () => {
    this.Obstacle.placeNew(this.Skier.x, this.Skier.y, this.Skier.direction, this.state.width, this.state.height)
  }

  checkIfSkierHitObstacle = () => {
    const skierImage = this.refs[this.Skier.getAssetName()]
    const skierRect = {
      left: this.Skier.x + this.state.width / 2,
      right: this.Skier.x + skierImage.width + this.state.width / 2,
      top: this.Skier.y + skierImage.height - 5 + this.state.height / 2,
      bottom: this.Skier.y + skierImage.height + this.state.height / 2
    }

    const collision = _.find(this.Obstacle.obstacles, (obstacle) => {
      const obstacleImage = this.refs[obstacle.type]
      const obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + obstacleImage.width,
        top: obstacle.y + obstacleImage.height - 5,
        bottom: obstacle.y + obstacleImage.height
      }

      return this.intersectRect(skierRect, obstacleRect)
    })

    if(collision) this.Skier.direction = 0
  }

  intersectRect = (r1, r2) => {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top)
  }

  gameLoop = () => {
    this.ctx.save()
    this.clearCanvas()
    this.Skier.move(this.placeNewObstacle)
    this.checkIfSkierHitObstacle()
    this.Skier.draw(this.refs, this.ctx, this.state.width, this.state.height)
    this.Obstacle.draw(this.refs, this.ctx, this.Skier.x, this.Skier.y, this.state.width, this.state.height)
    this.ctx.restore()
    requestAnimationFrame(this.gameLoop)
  }

  render() {
    const canvasWidth = this.state.width
    const canvasHeight = this.state.height
    return (
      <div className="App">
        {
          this.state.gameStatus === 'NEW'
          ? <button onClick={this.startGame}>Start</button>
          : <Score />
        }
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
