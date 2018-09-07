import React, { Component } from 'react'
import styled from 'styled-components'

const HighScoreBoard = styled.div`
  margin: 20px;
  width: 300px;
  color: #494949;
  background: #ffffff;
  border: 4px solid #494949;
  border-radius: 6px;
  display: inline-block;
  position: absolute;
  left: 0;
`

const LeaderBoardHeader = styled.h2`
  text-decoration: underline;
`

class HighScores extends Component {
  render () {
    return (
      <HighScoreBoard>
        <LeaderBoardHeader>Leader Board</LeaderBoardHeader>
      </HighScoreBoard>
    )
  }
}

export default HighScores
