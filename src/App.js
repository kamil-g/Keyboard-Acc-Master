import React from 'react';
import './App.css';

class Game extends React.Component {
  state = {
    text: "",
    queuedLetters: [],
    speedMultiplier: 1,
    hit: 0,
    miss: 0,
    letterObjects: []
  }

  componentDidMount() {
    this.interval = setInterval(() =>{this.queueLetters()},(1000 * this.state.speedMultiplier));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  queueLetters() {
    let generatedLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)).toLowerCase(); 
    if (this.state.queuedLetters.length !== 26){
      if(this.state.queuedLetters.includes(generatedLetter) && this.state.queuedLetters.length <= 25)
        this.queueLetters();
      else {
        this.setState({
          queuedLetters: [...this.state.queuedLetters, generatedLetter]
        })
        this.createLetterObject(generatedLetter)
      } 
    }
  }

  changeValue = () => {
    let letter = this.refs.letter.value;
    this.setState({
      text: letter
    });
    this.isLetterQueued(letter);
  }

  isLetterQueued = (letter) => {
    if (this.state.queuedLetters.includes(letter)) {
      this.deleteQueuedLetter(letter)
      this.setState({
        text: ""
      })
    }
      else {
        this.setState({
          text: "",
          miss: this.state.miss + 1
      })
    }
  }

  deleteQueuedLetter = (ltr) => {
    let indexOfLetter = this.state.queuedLetters.findIndex((element)=>{
      return element === ltr;
    })
    let newQueuedLetters = this.state.queuedLetters.filter((letter) => {
      return letter !== ltr;
    }) 

    let newLetterObjects = this.state.letterObjects;
    newLetterObjects.splice(indexOfLetter, 1);
    
    this.setState({
      queuedLetters: newQueuedLetters,
      letterObjects: newLetterObjects,
      hit: this.state.hit + 1
    })
  }

  createLetterObject = (letter) => {
    let left = Math.floor(Math.random() * 70).toString() + "vw";
    let top = Math.floor(Math.random() * 50).toString() + "vh";

    let letterStyle = {
      color: 'white',
      left: left,
      top: top,
      animation: 'fallDown 1s'
    }

    let letterObject = (ltr) => {
      return (
        <div className="ltr" style={letterStyle}> {ltr} </div>
      )
    }

    this.setState({
      letterObjects: [...this.state.letterObjects, letterObject(letter)]
    })
  }

  fallingLettersWindow = () => {
    return (
      <div id="FLW">
        {this.state.letterObjects}
      </div>
    )
  }

  render() {
    let accuracy = 0;
    if(this.state.hit === 0 && this.state.miss === 0)
      accuracy = 100
    else
     accuracy = Math.floor((this.state.hit*100)/(this.state.miss+this.state.hit));

    return (
      <div id="gameWindow">
        <this.fallingLettersWindow/>
        <div id="controlPanel">
          <input onChange={this.changeValue} type="text" ref="letter" maxLength="1" value={this.state.text} placeholder="Type here"></input>
          <div id="accuracyCounter">
            <span>Accuracy: {accuracy}%</span>
            <span>Hit: {this.state.hit}</span>
            <span>Missed: {this.state.miss}</span>
          </div>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <Game />
  );
}

export default App;
