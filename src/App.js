import React, { useState, useEffect } from "react";
import Board from "./components/Board/Board";
import "./App.css";

function App() {
  const defaultBoards = [
    { id: 1, title: "To Do", cards: [] },
    { id: 2, title: "In Progress", cards: [] },
    { id: 3, title: "Peer Review", cards: [] },
    { id: 4, title: "Done", cards: [] },
  ];

  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("prac-kanban")) || defaultBoards
  );

  const [targetCard, setTargetCard] = useState({ bid: "", cid: "" });
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search input
  const [filteredBoards, setFilteredBoards] = useState(boards); // State to hold filtered boards/cards

  // Function to filter cards based on search term
  const filterCards = (searchTerm) => {
    const filtered = boards.map((board) => {
      // Filter cards that match the search term
      const filteredCards = board.cards.filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...board, cards: filteredCards };
    });

    setFilteredBoards(filtered);
  };

  // Whenever searchTerm changes, filter cards
  useEffect(() => {
    filterCards(searchTerm);
  }, [searchTerm, boards]);

  const addCardHandler = (id, title) => {
    const boardIndex = boards.findIndex((board) => board.id === id);
    if (boardIndex < 0) return;
  
    const updatedBoards = [...boards];
    updatedBoards[boardIndex].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
      desc: "", // Initialize the description
    });
    setBoards(updatedBoards);
  };
  

  const updateCardHandler = (bid, cid, updatedCard) => {
    const boardIndex = boards.findIndex((board) => board.id === bid);
    if (boardIndex < 0) return;
  
    const updatedBoards = [...boards];
    const cardIndex = updatedBoards[boardIndex].cards.findIndex((card) => card.id === cid);
    if (cardIndex < 0) return;
  
    updatedBoards[boardIndex].cards[cardIndex] = updatedCard;
    setBoards(updatedBoards);
  };

  const removeCard = (bid, cid) => {
    const boardIndex = boards.findIndex((board) => board.id === bid);
    if (boardIndex < 0) return;

    const updatedBoards = [...boards];
    updatedBoards[boardIndex].cards = updatedBoards[boardIndex].cards.filter(
      (card) => card.id !== cid
    );
    setBoards(updatedBoards);
  };

  const dragEnded = (bid, cid) => {
    const sourceBoardIndex = boards.findIndex((board) => board.id === bid);
    if (sourceBoardIndex < 0) return;

    const sourceCardIndex = boards[sourceBoardIndex].cards.findIndex(
      (card) => card.id === cid
    );
    if (sourceCardIndex < 0) return;

    const targetBoardIndex = boards.findIndex(
      (board) => board.id === targetCard.bid
    );
    if (targetBoardIndex < 0) return;

    const updatedBoards = [...boards];
    const [movedCard] = updatedBoards[sourceBoardIndex].cards.splice(
      sourceCardIndex,
      1
    );

    if (updatedBoards[targetBoardIndex].cards.length === 0) {
      updatedBoards[targetBoardIndex].cards.push(movedCard);
    } else {
      const targetCardIndex = updatedBoards[targetBoardIndex].cards.findIndex(
        (card) => card.id === targetCard.cid
      );
      updatedBoards[targetBoardIndex].cards.splice(targetCardIndex, 0, movedCard);
    }

    setBoards(updatedBoards);
    setTargetCard({ bid: "", cid: "" });
  };

  const dragEntered = (bid, cid) => {
    setTargetCard({ bid, cid });
  };

  useEffect(() => {
    localStorage.setItem("prac-kanban", JSON.stringify(boards));
  }, [boards]);

  return (
    <div className="app">
      <div className="app_nav">
        <h1>Kanban Board</h1>
        {/* Search bar component */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {filteredBoards.map(
            (board) => (
              <Board
    key={board.id}
    board={board}
    addCard={addCardHandler}
    removeCard={removeCard}
    dragEnded={dragEnded}
    dragEntered={dragEntered}
    updateCard={updateCardHandler}
  />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
