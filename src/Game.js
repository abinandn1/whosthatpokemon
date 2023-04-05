import React, { useState, useEffect } from "react";
import axios from "axios";
import "./mainGame.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

function WhosThatPokemon() {

  // setup game variables that can be updated throughout the game and functions to update the states
  const [pokemon, setPokemon] = useState(null);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [numGuesses, setNumGuesses] = useState(0);
  const [score, setScore] = useState(0);

  function getPokemon() {
    // Generate number of pokemon (up to gen6)
    const number = Math.ceil(Math.random() * 721); // ceil to make sure its not 0
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${number}/`).then((response) => response.data);
  }

  // Gets Pokemon data needed for game variables, updates the states of game variables whenever component is updated
  useEffect(() => {
    getPokemon().then((data) => {
      setPokemon(data);
      setNumGuesses(0);
      setResult("");
      setGuess("");
    });
  }, []);

  // handles new user guesses, changes the state to the user input 
  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  // handles user guess
  const userGuess = () => {
    if (guess.toLowerCase() === pokemon.name) {
      setResult(`Correct! It's ${pokemon.name.toUpperCase()} !`);
      // increment score if correct guess
      setScore(score + 1);
      // get image and reveal it if correct guess
      const image = document.querySelector("#pokemon-image");
      image.classList.toggle("revealed");
      // allow for some time after reveal before going to next pokemon
      setTimeout(() => {
        nextPokemon(); //need to figure out how to allow for next pokemon button click upon correct answer
      }, 1000);
    } 
    else {
      setNumGuesses(numGuesses + 1);
      // user only gets 3 guesses 
      if (numGuesses >= 3) {
        setResult(`Sorry, the Pokemon was ${pokemon.name.toUpperCase()}.`);
        const image = document.querySelector("#pokemon-image");
        image.classList.toggle("revealed");
      } 
      else {
        setResult(`Incorrect. Try again! You have ${3 - numGuesses} guesses left.`);
      }
    };
  };

  // handle if user clicks the give up button, moves onto the next Pokemon
  const giveUp = () => {
    setResult(`The Pokemon was ${pokemon.name.toUpperCase()}.`);
    const image = document.querySelector("#pokemon-image");
    image.classList.toggle("revealed");
    if (numGuesses < 4) {
      setNumGuesses(4);
    }
  };
 // handles the next pokemon, if either uses guesses correctly on current Pokemon, or gives up, or runs out of guesses
  const nextPokemon = () => {
    getPokemon().then((data) => {
      setPokemon(data);
      setNumGuesses(0);
      setResult("");
      setGuess("");
      const image = document.querySelector("#pokemon-image");
      image.classList.toggle("revealed");
    });
  };

  // Return main game page 
  return (
  <div className="bg-red">
    <div className="row justify-content-center">
      {/* constrain text input box */}
      <div className="col-12 col-md-8 col-lg-6"> 
        <div className="fixed-bottom text-center">
        </div>
        {/* if we get a pokemon successfully, run the game  */}
        {pokemon ? (
          // center everything
          <div className="text-center">
            {/* Load blurred Pokemon sprite */}
            <img src={pokemon.sprites.front_default} alt={pokemon.name} id="pokemon-image" className="img-fluid blurred mb-4" style={{height:"200px",width:"200px"}} />
            <h2 className="text-white text-pokemon mb-3">Who's that Pokémon?</h2>
            {/* allow for user input */}
            <input type="text" value={guess} onChange={handleGuessChange} className="form-control mb-2" />
            {/* Submit Guess button */}
            <Button variant="primary" onClick={userGuess} className="mx-2 mb-2 text-pokemon">Guess</Button>
            {/* Give up button */}
            <Button variant="danger" onClick={giveUp} className="mx-2 mb-2 text-pokemon">Give Up</Button>
            <p className="text-white text-pokemon mb-3">{result}</p>
            {/* Only give option to go to next pokemon if user gives up, runs out of guesses or guesses the right Pokemon */}
            {numGuesses >= 4 && (
              // Next Pokemon Button
              <Button variant="success" onClick={nextPokemon} className="mx-2 mb-2 text-pokemon">
                Next Pokémon
              </Button>
            )}
            <div className="score">
              {/* Display score */}
              <p className="text-black text-pokemon mb-3">{`Score: ${score}`}</p>
            </div>
          </div>
        ) : (
          // load next pokemon text while grabbing the next pokemon aka when pokemon is null 
          <p className="text-black text-pokemon mb-3 text-center ">Loading Next Pokemon...</p>
        )}
      </div>
    </div>
  </div>
);
}

export default WhosThatPokemon;
