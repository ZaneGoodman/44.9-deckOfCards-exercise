import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

function DeckOfCards() {
  const [cardImgSrc, setCardImgSrc] = useState("");
  const [cardCount, setCardCount] = useState(0);
  const [startAndStop, setStartAndStop] = useState("stop");

  const deckId = useRef();
  const intervalId = useRef();
  const btn = useRef();
  useEffect(() => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/")
      .then((res) => (deckId.current = res.data.deck_id));
  }, []);
  const handleClick = () => {
    startAndStop === "stop"
      ? setStartAndStop(() => "start")
      : setStartAndStop(() => "stop") && clearInterval(intervalId);
  };

  useEffect(() => {
    intervalId.current = setInterval(() => {
      async function getcards() {
        const res = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`
        );
        setCardCount((cardCount) => cardCount + 1);
        setCardImgSrc((cardImgSrc) => (cardImgSrc = res.data.cards[0].image));
      }
      getcards();
    }, 1000);
  }, [startAndStop]);

  const getCard = async () => {
    if (cardCount === 52) {
      clearInterval(intervalId);
      alert("No cards remaining!");
    } else {
      const res = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`
      );
      setCardCount(() => cardCount + 1);
      setCardImgSrc(() => res.data.cards[0].image);
    }
  };

  return (
    <div>
      <button ref={btn} onClick={handleClick}>
        {startAndStop}
      </button>
      <Card src={cardImgSrc} />
    </div>
  );
}

export default DeckOfCards;
// https://deckofcardsapi.com/api/deck/new/shuffle/ - get a deck
// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/ - draw a card
