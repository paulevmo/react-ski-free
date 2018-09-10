import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import random from 'lodash/random'

class Obstacle {
  constructor () {
    this.obstacles = []
    this.difficultyThreshold = 500
    this.obstaclePlacementFactor = 8
  }

  obstacleTypes = [
    'tree',
    'treeCluster',
    'rock1',
    'rock2',
    'jumpRamp'
  ]

  sortObstacles = (refs) => {
    this.obstacles = sortBy(this.obstacles, (obstacle) => {
      const obstacleImage = refs[obstacle.type]
      return obstacle.y + obstacleImage.height
    })
  }

  placeInitial = (refs, width, height) => {
    const numberObstacles = Math.ceil(random(5, 7) * (width / 800) * (height / 500))

    const minX = -50
    const maxX = width + 50
    const minY = height / 2 + 100
    const maxY = height + 50

    for(let i = 0; i < numberObstacles; i++) {
      this.placeRandom(minX, maxX, minY, maxY)
    }

    this.sortObstacles(refs)
  }

  placeNew = (skierX, skierY, skierDirection, width, height, currentScore) => {
    if (currentScore > this.difficultyThreshold) {
      this.difficultyThreshold += 500
      this.obstaclePlacementFactor = Math.max(2, this.obstaclePlacementFactor - 1)
    }
    const shouldPlaceObstacle = Math.floor(Math.random() * this.obstaclePlacementFactor) + 1
    if(shouldPlaceObstacle !== this.obstaclePlacementFactor) return

    const leftEdge = skierX
    const rightEdge = skierX + width
    const topEdge = skierY
    const bottomEdge = skierY + height

    switch(skierDirection) {
      case 1: // left
        this.placeRandom(leftEdge - 50, leftEdge, topEdge, bottomEdge)
        break
      case 2: // left down
        this.placeRandom(leftEdge - 50, leftEdge, topEdge, bottomEdge)
        this.placeRandom(leftEdge, rightEdge, bottomEdge, bottomEdge + 50)
        break
      case 3: // down
        this.placeRandom(leftEdge, rightEdge, bottomEdge, bottomEdge + 50)
        break
      case 4: // right down
        this.placeRandom(rightEdge, rightEdge + 50, topEdge, bottomEdge)
        this.placeRandom(leftEdge, rightEdge, bottomEdge, bottomEdge + 50)
        break
      case 5: // right
        this.placeRandom(rightEdge, rightEdge + 50, topEdge, bottomEdge)
        break
      default:
        break
    }
  }

  placeRandom = (minX, maxX, minY, maxY) => {
    const obstacleIndex = Math.floor(Math.random() * this.obstacleTypes.length)
    const position = this.calculateOpenPosition(minX, maxX, minY, maxY)

    this.obstacles.push({
      type : this.obstacleTypes[obstacleIndex],
      x : position.x,
      y : position.y
    })
  }

  calculateOpenPosition = (minX, maxX, minY, maxY) => {
    const x = Math.floor(Math.random()*(maxX-minX+1)+minX)
    const y = Math.floor(Math.random()*(maxY-minY+1)+minY)

    const foundCollision = find(this.obstacles, (obstacle) => {
      return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50)
    })

    if(foundCollision) {
      return this.calculateOpenPosition(minX, maxX, minY, maxY)
    }
    else { return { x, y } }
  }

  draw = (refs, ctx, skierX, skierY, width, height) => {
    this.obstacles.forEach((obstacle) => {
      const obstacleImage = refs[obstacle.type]
      const x = obstacle.x - skierX - obstacleImage.width / 2
      const y = obstacle.y - skierY - obstacleImage.height / 2

      if(x < -100 || x > width + 50 || y < -100 || y > height + 50) return
      ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height)
    })
  }

  reset = () => {
    this.obstacles = []
  }
}

export default Obstacle
