import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card"

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [ deck, setDeck ] = useState( null );
    const [ drawn, setDrawn ] = useState([]);
    const [ isShuffling, setIsShuffling ] = useState( false );


    useEffect ( function loadDeckFromAPI () {
       const fetchData = async () => {
            const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
            setDeck(d.data)
       }
       fetchData();
    }, [])

  /** Draw card: change the state & effect will kick in. */

    const draw = async () => {
        try {
            const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`)

            if ( drawRes.data.remaining === 0 ) throw new Error("no cards remaining!");

            const card = drawRes.data.cards[0];

            setDrawn ( d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image,
                },
            ]);
        } catch (e) {
            alert (e);
        }
    } 
    /** Shuffle: change the state & effect will kick in. */

    const startShuffling = async () => {
        setIsShuffling(true);
        try {
            await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
            setDrawn([]);
        }   catch (e) {
            alert (e);
        }   finally {
            setIsShuffling(false);
        }
    }
      /** Return draw button (disabled if shuffling) */
    const renderDrawBtnIfOk = () => {
        if (!deck) return null;

        return (
            <button
                className="Deck-gimme"
                onClick={ draw }
                disabled= { isShuffling }>
                Draw!
                </button>
        );
    }
  /** Return draw button (disabled if shuffling) */
    const renderShuffleBtnIfOk = () => {
        if (!deck) return null;
        
        return (
            <button
                className="Deck-gimme"
                onClick={ startShuffling }
                disabled= { isShuffling }>
                Shuffle Deck!
                </button>
        );
    }

    return (
        <main className="Deck">
            { renderDrawBtnIfOk() }
            { renderShuffleBtnIfOk() }

            <div className="Deck-cardarea"> {
                drawn.map( c => (
                    <Card 
                        key={ c.id }
                        name={ c.name }
                        image={ c.image } 
                    />
                ))}
            </div>
        </main>
    );
}

export default Deck;