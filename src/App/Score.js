import React, { Component } from 'react'
import styled from 'styled-components'

const Scoreboard = styled.div`
  width: 300px;
  color: #494949;
  background: #ffffff;
  border: 4px solid #494949;
  border-radius: 6px;
  display: inline-block;
  position: absolute;
`

class Score extends Component {
  render () {
    return (
      <Scoreboard>
        <h2>Score: {this.props.currentScore}</h2>

      </Scoreboard>
    )
  }
}

export default Score
