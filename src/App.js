import React, { Component } from 'react';
import { default as _ } from 'lodash'
import './App.css';

import skierCrash from './img/skier_crash.png'
import skierLeft from './img/skier_left.png'
import skierLeftDown from './img/skier_left_down.png'
import skierDown from './img/skier_down.png'
import skierRightDown from './img/skier_right_down.png'
import skierRight from './img/skier_right.png'
import tree from './img/tree_1.png'
import treeCluster from './img/tree_cluster.png'
import rock1 from './img/rock_1.png'
import rock2 from './img/rock_2.png'

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
    this.ctx = this.canvasRef.current.getContext('2d')
    console.log('refs: ', this.refs)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
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

        this.placeNewObstacle(this.skierDirection)
        break
      case 3:
        this.skierMapY += this.skierSpeed

        this.placeNewObstacle(this.skierDirection)
        break
      case 4:
        this.skierMapX += this.skierSpeed / 1.4142
        this.skierMapY += this.skierSpeed / 1.4142

        this.placeNewObstacle(this.skierDirection)
        break
    }
  }

  getSkierAsset = () => {
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
    console.log('drawSkier...')
    console.log('refs: ', this.refs)
    const skierImage = this.refs[this.getSkierAsset()]
    const x = (this.state.width - skierImage.width) / 2
    const y = (this.state.height - skierImage.height) / 2

    console.log('draw skier.... ')
    console.log('skierImage: ', skierImage)
    this.ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height)
  }

  placeNewObstacle = () => {

  }

  render() {
    console.log("this.state: ", this.state)
    console.log("this.canvasRef: ", this.canvasRef)
    console.log("this.ctx: ", this.ctx)
    const canvasWidth = this.state.width * window.devicePixelRatio
    const canvasHeight = this.state.height * window.devicePixelRatio
    return (
      <div className="App">
        <button onClick={this.drawSkier}>Start</button>
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
    );
  }
}

export default App;
