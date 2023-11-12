import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

function DeckOfCards() {
  const [cardImgSrc, setCardImgSrc] = useState("");
  const [autoDraw, setAutoDraw] = useState(false);
  const [remaing, setRemaining] = useState("");

  const deckId = useRef();
  const intervalId = useRef(null);

  useEffect(() => {
    axios
      .get("https://deckofcardsapi.com/api/deck/new/shuffle/")
      .then((res) => (deckId.current = res.data.deck_id));
  }, []);
  const toggleAutoDraw = () => {
    setAutoDraw((auto) => !auto);
  };

  useEffect(() => {
    async function getCard() {
      try {
        if (remaing === 0) {
          throw new Error("No cards remaining!");
        } else {
          const res = await axios.get(
            `https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`
          );

          setRemaining((_remaing) => (_remaing = res.data.remaining));
          setCardImgSrc((_src) => (_src = res.data.cards[0].image));
        }
      } catch (e) {
        alert(e);
      }
    }
    if (autoDraw && !intervalId.current) {
      intervalId.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(intervalId.current);
      intervalId.current = null;
    };
  }, [autoDraw, setAutoDraw, remaing]);

  return (
    <div>
      <button onClick={toggleAutoDraw}>
        {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
      </button>
      <Card src={cardImgSrc} />
    </div>
  );
}

export default DeckOfCards;
// https://deckofcardsapi.com/api/deck/new/shuffle/ - get a deck
// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/ - draw a card
