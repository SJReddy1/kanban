import React, { useState } from "react";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editables/Editable";
import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    if (cardId) {
      props.dragEnded(props.board.id, cardId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isBoardEmpty = props.board?.cards?.length === 0;

  return (
    <div
      className="board"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title}
          <span>{props.board?.cards?.length || 0}</span>
        </p>
        {/* Removed the dots entirely */}
        <div
          className="board_header_title_more"
          onClick={() => setShowDropdown(true)}
        >
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <p onClick={() => props.removeBoard()}>Delete Board</p>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {isBoardEmpty && (
          <Card
            key="empty-card"
            card={{ id: "empty-card", title: "Drop a card here" }}
            boardId={props.board.id}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            removeCard={() => {}}
          />
        )}

        {props.board?.cards?.map((item) => (
          <Card
            key={item.id}
            card={item}
            boardId={props.board.id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
          />
        ))}

        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?.id, value)}
        />
      </div>
    </div>
  );
}

export default Board;
