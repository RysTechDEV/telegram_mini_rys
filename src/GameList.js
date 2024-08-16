import React, { useState, useEffect } from "react";
import axios from "axios";
import { TonConnect } from "@tonconnect/sdk";
import "./GameList.css"; // Import the CSS file

const tonConnect = new TonConnect();

const GameList = () => {
  const [games, setGames] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    axios
      .get("/api/games")
      .then((response) => setGames(response.data))
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

  const connectWallet = async () => {
    try {
      const connectionResult = await tonConnect.connect();
      setWalletConnected(true);
      console.log("Wallet connected:", connectionResult);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const initiatePayment = (game) => {
    if (!walletConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    const paymentRequest = {
      to: "TON_WALLET_ADDRESS",
      value: game.price,
      message: `Payment for ${game.title}`,
    };

    tonConnect
      .sendTransaction(paymentRequest)
      .then((response) => {
        console.log("Payment successful:", response);
        // Start the game or take further actions
      })
      .catch((error) => {
        console.error("Payment failed:", error);
      });
  };

  return (
    <div className="game-list-container">
      <button onClick={connectWallet}>Connect Wallet</button>
      <h1>Game List</h1>
      <ul className="game-list">
        {games.map((game) => (
          <li className="game-item" key={game.id}>
            <img src={game.photo} alt={game.title} />
            <h2>{game.title}</h2>
            <p>Price: {game.price} TON</p>
            <button onClick={() => initiatePayment(game)}>Play Game</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
