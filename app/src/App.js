import React, {Component} from 'react';
import Snake from './components/Snake';
import Victim from './components/Victim';
import Result from "./components/Result"

const getRandomCoordinates = () =>{
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min)/2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min)/2) * 2;
  return [x , y]
}
const keyCodes = []
const initialState = {
  intervalId:null,
  food: getRandomCoordinates(),
  speed: 200,
  started: false,  
  showResult:false,
  score:0,
  direction: "RIGHT",
  snakeDots: [[0, 0], [2, 0]]
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.keyCodes = keyCodes;
    
  }
  speed () {
      clearInterval(this.interval);
      this.interval = setInterval(this.moveSnake ,this.state.speed);
        this.setState({intervalId :this.interval})   
   }
  
  componentDidMount() {
    document.onkeydown = this.onKeyDown;
    
  }

  componentDidUpdate() { 
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    
  } 

  stop = () => {
    clearInterval(this.state.intervalId)
    this.setState({
      started:!this.state.started
    })
  }  

  onStart = () => {
    if (!this.state.started) {
      this.speed();
      return this.setState({
        started:!this.state.started
      })
    }else{
      this.stop();
    } 
  }
  onKeyDown = e => {
    e = e || window.event;  
    switch (e.keyCode) {
      case 38:
        this.keyCodes.push(e.keyCode)
        this.setState({ direction: "UP" });
        break;
      case 40:
          this.keyCodes.push(e.keyCode)
        this.setState({ direction: "DOWN" });
        break;
      case 37:
          this.keyCodes.push(e.keyCode)
        this.setState({ direction: "LEFT" });
        break;
      case 39:
        this.keyCodes.push(e.keyCode)
        this.setState({ direction: "RIGHT" });
        break;
      default:
        break;
    }
  };
  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];   
    switch (this.state.direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }
    dots.shift();
    dots.push(head);
    this.setState({
      snakeDots: dots
    });  
  };
  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let length = snake.length;
    let head = snake[length - 1];
    let direction = this.state.direction;
    if (direction === "DOWN") {
      if (this.keyCodes[this.keyCodes.length-2] === 38) {
        return snake.reverse();
      }
    }
    if (direction === "UP") {
      if (this.keyCodes[this.keyCodes.length-2] === 40) {
        return snake.reverse();
      }
    }
    if (direction === "RIGHT") {
      if (this.keyCodes[this.keyCodes.length-2] === 37) {
        return snake.reverse();
      }
    }
    if (direction === "LEFT") {
      if (this.keyCodes[this.keyCodes.length-2] === 39) {
        return snake.reverse();       
      }
    }
    snake.pop();  
      snake.forEach(dot => {
        if (head[0] === dot[0] && head[1] === dot[1]) {
          this.onGameOver();
        }
      });   
  }
  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      let newState = {...this.state };
      newState.score =  this.state.score + 10;
      newState.started = this.state.started;
      newState.food = getRandomCoordinates();
      newState.snakeDots = this.enlargeSnake();
      newState.speed = this.increaseSpeed();
      this.setState(newState);
      this.speed();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    return newSnake;
  }

  increaseSpeed() {
    return (this.state.speed > 50) ? this.state.speed -10: this.state.speed;
  }

  newGame = () =>{
    this.setState({
      showResult:!this.state.showResult,
      score:0
    });
    this.keyCodes=[];
  }

  onGameOver() {
    this.setState({...initialState ,showResult:true,score:this.state.score});
    this.stop();    
  }

  render(){

     return (
        <div>
          <Result showResult = {this.state.showResult} score = {this.state.score} newGame={this.newGame}/>
          <div className = 'app'style={{display:!this.state.showResult? "flex" : "none"}}>
          <div className = "score">Score {this.state.score === 0 ? "":this.state.score}</div>
          <div className="game-area" >
            <Snake snakeDots = {this.state.snakeDots}/>
            <Victim dot = {this.state.food}/>
          </div>
          <button className = "start" onClick = {this.onStart} style= {{backgroundColor:!this.state.started ? "red" : "blue"}}>
            {!this.state.started ? "Start" : "Stop"}
          </button>
          </div>
        </div>  
    );
  }  
}

export default App;
