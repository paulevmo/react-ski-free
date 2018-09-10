import React, { Component } from 'react'
import styled from 'styled-components'

import HighScores from './HighScores'

const StartButton = styled.button`
  width: 200px;
  position: absolute;
  top: ${(props) => props.canvasHeight / 2 - 100}px;
  left: ${(props) => props.canvasWidth / 2 - 100}px;
  color: #494949;
  background: #ffffff;
  padding: 20px;
  border: 4px solid #494949;
  border-radius: 6px;
  display: inline-block;
  transition: all 1s ease 0s;

  &:hover {
    color: #20bf6b;
    border-radius: 200px;
    border-color: #20bf6b;
    cursor: pointer;
  }
`

const PlayerName = styled.input`
  width: 200px;
  position: absolute;
  top: ${(props) => props.canvasHeight / 2 - 150}px;
  left: ${(props) => props.canvasWidth / 2 - 100}px;
  padding: 12px 20px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`

const PostGameScore = styled.h2`
  position: absolute;
  left: ${(props) => props.canvasWidth / 2 - 60}px;
  top: ${(props) => props.canvasHeight / 5}px;
`

class PostGame extends Component {
  state = {
    playerName: ''
  }

  render () {
    const {startGame, canvasHeight, canvasWidth, updatePlayerName, playerName, highScores} = this.props
    return (
      <div>
        <PostGameScore
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}>
          Score: {this.props.currentScore}
        </PostGameScore>
        <PlayerName
          value={playerName}
          onChange={updatePlayerName}
          placeholder='Enter Player Name'
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
        />
        {
          playerName.length
          ? <StartButton
              onClick={startGame}
              canvasHeight={canvasHeight}
              canvasWidth={canvasWidth}>
              Try Again
            </StartButton>
          : null
        }
        <HighScores
          canvasWidth={canvasWidth}
          highScores={highScores}
          currentScore={this.props.currentScore}
        />
      </div>
    )
  }
}

export default PostGame
