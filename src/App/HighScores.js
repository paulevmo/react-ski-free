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

const LeaderBoardList = styled.ul`
  list-style: none;
  padding: 0;
`

const LeaderBoardItem = styled.li`
  margin: 10px 0;

  font-weight: ${(props) => props.score === props.currentScore ? 'bold' : 'normal'}
  top: ${(props) => props.canvasHeight / 2 - 150}px;
`

class HighScores extends Component {
  render () {
    return (
      <HighScoreBoard>
        <LeaderBoardHeader>Leader Board</LeaderBoardHeader>
        <LeaderBoardList>
          {
            this.props.highScores &&
            this.props.highScores.map((score, i) => (
              <LeaderBoardItem
                key={`score-${i}`}
                currentScore={this.props.currentScore}
                score={score.score} >
                {score.name} - {score.score}
              </LeaderBoardItem>
            ))
          }
        </LeaderBoardList>
      </HighScoreBoard>
    )
  }
}

export default HighScores
