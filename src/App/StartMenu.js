import React, { Component } from 'react'
import styled from 'styled-components'

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

class StartMenu extends Component {
  state = {
    playerName: ''
  }

  render () {
    console.log('render start menu')
    const {startGame, canvasHeight, canvasWidth, status, updatePlayerName, playerName} = this.props
    return (
      <div>
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
              Start
            </StartButton>
          : null
        }
      </div>
    )
  }
}

export default StartMenu
