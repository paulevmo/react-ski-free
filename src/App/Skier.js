class Skier {
  constructor () {
    this.direction = 5
    this.x = 0
    this.y = 0
    this.speed = 8
  }

  assets = [
    'skierCrash',
    'skierLeft',
    'skierLeftDown',
    'skierDown',
    'skierRightDown',
    'skierRight'
  ]

  getAssetName = () => this.assets[this.direction]

  turnLeft = () => {
    this.direction = Math.max(0, this.direction - 1)
  }

  turnRight = () => {
    this.direction = Math.min(5, this.direction + 1)
  }

  turnDown = () => {
    this.direction = 3
  }

  moveLeft = () => {
    this.x = this.x - this.speed
  }

  moveDownLeft = () => {
    this.x = this.x - Math.round(this.speed / 1.4142)
    this.y = this.y + Math.round(this.speed / 1.4142)
  }

  moveDown = () => {
    this.y = this.y + this.speed
  }

  moveDownRight = () => {
    this.x = this.x + Math.round(this.speed / 1.4142)
    this.y = this.y + Math.round(this.speed / 1.4142)
  }

  moveRight = () => {
    this.x = this.x + this.speed
  }

  draw = (refs, ctx, width, height) => {
    const skierImage = refs[this.getAssetName()]
    const x = (width - skierImage.width) / 2
    const y = (height - skierImage.height) / 2
    ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height)
  }

  move = (placeNewObstacle) => {
    switch(this.direction) {
      case 2:
        this.moveDownLeft()
        placeNewObstacle()
        break
      case 3:
        this.moveDown()
        placeNewObstacle()
        break
      case 4:
        this.moveDownRight()
        placeNewObstacle()
        break
      default:
        break
    }
  }
}

export default Skier