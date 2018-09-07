import React, { Component } from 'react'
import find from 'lodash/find'
import once from 'lodash/once'
import orderBy from 'lodash/orderBy'
import '../App.css'
import styled from 'styled-components'

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

import Skier from './Skier'
import Obstacle from './Obstacle'

import Score from './Score'
import StartMenu from './StartMenu'
import PostGame from './PostGame'

class App extends Component {
  state = {
    width: null,
    height: null,
    gameStatus: 'NEW',
    score: 0,
    playerName: ''
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
    this.reset()
    this.Obstacle.placeInitial(this.refs, this.state.width, this.state.height)
    requestAnimationFrame(this.gameLoop)
    this.setState({ gameStatus: 'PLAYING', score: 0 })
  }

  reset = () => {
    cancelAnimationFrame(this.animationId)
    this.Skier = new Skier()
    this.Obstacle = new Obstacle()
  }

  addToScore = (newPoints) => {
    this.setState({score: this.state.score + newPoints})
  }

  updatePlayerName = (e) => {
    this.setState({playerName: e.target.value})
  }

  handleUserInput = (e) => {
    if (this.state.gameStatus !== 'CRASHED')
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

  handleCrash = () => {
    this.Skier.direction = 0
    this.setState({ gameStatus: 'CRASHED' }, () => cancelAnimationFrame(this.animationId))
    this.setHighScore()
  }

  setHighScore = () => {
    console.log('setting high score...')
    const timestamp = Math.floor(Date.now() / 1000)
    localStorage.setItem(`ski-score.${this.state.playerName}.${timestamp}`, this.state.score)
    this.getHighScores()
  }

  getHighScores = () => {
    const unsortedScores = Object.keys(localStorage).reduce((highScores, key) => {
      const splitKey = key.split('.')
      if (splitKey[0] === 'ski-score') {
        const score = localStorage.getItem(key)
          highScores.push({
            name: splitKey[1],
            score: Number(score)
          })
      }
      return highScores
    }, [])
    const highScores = orderBy(unsortedScores, ['score'], ['desc']).slice(0, 10)
    this.setState({ highScores: highScores })
  }

  checkIfSkierHitObstacle = () => {
    const skierImage = this.refs[this.Skier.getAssetName()]
    const skierRect = {
      left: this.Skier.x + this.state.width / 2,
      right: this.Skier.x + skierImage.width + this.state.width / 2,
      top: this.Skier.y + skierImage.height - 5 + this.state.height / 2,
      bottom: this.Skier.y + skierImage.height + this.state.height / 2
    }

    const collision = find(this.Obstacle.obstacles, (obstacle) => {
      const obstacleImage = this.refs[obstacle.type]
      const obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + obstacleImage.width,
        top: obstacle.y + obstacleImage.height - 5,
        bottom: obstacle.y + obstacleImage.height
      }

      return this.intersectRect(skierRect, obstacleRect)
    })

    if (collision) {
      cancelAnimationFrame(this.animationId)
      this.handleCrash()
    }
  }

  intersectRect = (r1, r2) => {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top)
  }

  gameLoop = () => {
    if (this.state.gameStatus === 'PLAYING') {
      this.ctx.save()
      this.clearCanvas()
      this.Skier.move(this.placeNewObstacle, this.addToScore)
      this.checkIfSkierHitObstacle()
      this.Skier.draw(this.refs, this.ctx, this.state.width, this.state.height)
      this.Obstacle.draw(this.refs, this.ctx, this.Skier.x, this.Skier.y, this.state.width, this.state.height)
      this.ctx.restore()
      this.animationId = requestAnimationFrame(this.gameLoop)
    }
  }

  render() {
    console.log('Render index.....')
    const canvasWidth = this.state.width
    const canvasHeight = this.state.height
    return (
      <div className="App">
        {
          this.state.gameStatus === 'NEW'
          ? <StartMenu
              canvasHeight={canvasHeight}
              canvasWidth={canvasWidth}
              updatePlayerName={this.updatePlayerName}
              playerName={this.state.playerName}
              startGame={this.startGame} />
            : null
        }

        {
          this.state.gameStatus === 'PLAYING'
          ? <Score currentScore={this.state.score} />
            : null
        }

        {
          this.state.gameStatus === 'CRASHED'
          ? <PostGame
              canvasHeight={canvasHeight}
              canvasWidth={canvasWidth}
              updatePlayerName={this.updatePlayerName}
              playerName={this.state.playerName}
              startGame={this.startGame}
              highScores={this.state.highScores} />
            : null
        }


        <canvas ref={this.canvasRef} width={canvasWidth} height={canvasHeight} />
        <img ref='skierCrash' className='hidden' src={skierCrash} alt='' />
        <img ref='skierLeft' className='hidden' src={skierLeft} alt='' />
        <img ref='skierLeftDown' className='hidden' src={skierLeftDown} alt='' />
        <img ref='skierDown' className='hidden' src={skierDown} alt='' />
        <img ref='skierRightDown' className='hidden' src={skierRightDown} alt='' />
        <img ref='skierRight' className='hidden' src={skierRight} alt='' />
        <img ref='tree' className='hidden' src={tree} alt='' />
        <img ref='treeCluster' className='hidden' src={treeCluster} alt='' />
        <img ref='rock1' className='hidden' src={rock1} alt='' />
        <img ref='rock2' className='hidden' src={rock2} alt='' />
      </div>
    )
  }
}

export default App;
