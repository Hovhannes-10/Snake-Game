import React, { Component } from 'react'

export default class Result extends Component {
    render() {
        const style = {display: this.props.showResult ?  "block" : "none"}
        return (
            <div>
                <div  >
                    <span className = "game-result" style = {style} >
                        <h1>Game Over</h1>
                        <h2>Result <strong>{this.props.score}</strong></h2>
                        <button type='button' onClick={() => this.props.newGame()}> New Game</button>
                    </span>
                </div>
            </div>
        )
    }
}
