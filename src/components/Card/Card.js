import React, { useState } from "react";
import { CheckSquare, Clock, MoreHorizontal, Trash2 } from "react-feather"; // Import Trash2 icon

import Dropdown from "../Dropdown/Dropdown";
import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { id, title, date, tasks, labels } = props.card;

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (!date) return "";

    const months = [
      "Jan", "Feb", "Mar", "Aprl", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const handleDragEnd = () => {
    props.dragEnded(props.boardId, id); // Call dragEnded when drag is complete
  };

  const handleDragEnter = () => {
    props.dragEntered(props.boardId, id); // Update the target card when dragging enters
  };

  // Prevent modal opening if the card is the empty card
  const handleClick = () => {
    if (id !== "empty-card") {
      setShowModal(true);
    }
  };

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      )}
      <div
        className="card"
        draggable
        onDragEnd={handleDragEnd}
        onDragEnter={handleDragEnter}
        onClick={handleClick}  // Only open modal if it's not the empty card
      >
        <div className="card_top">
          {/* Display labels at the top of the card */}
          <div className="card_top_labels">
            {labels?.map((item, index) => (
              <label key={index} style={{ backgroundColor: item.color }}>
                {item.text}
              </label>
            ))}
          </div>

          {/* Conditionally render the dropdown (three dots) only if it's not the empty card */}
          {id !== "empty-card" && (
            <div
              className="card_top_more"
              onClick={(event) => {
                event.stopPropagation();
                setShowDropdown(true);
              }}
            >
              <MoreHorizontal />
              {showDropdown && (
                <Dropdown
                  class="board_dropdown"
                  onClose={() => setShowDropdown(false)}
                >
                  <p onClick={() => props.removeCard(props.boardId, id)}>
                    <Trash2 size={18} /> {/* Use Trash2 icon for delete */}
                  </p>
                </Dropdown>
              )}
            </div>
          )}
        </div>
        <div className="card_title">{title}</div>
        <div className="card_description">
          {props.card.desc && <p>{props.card.desc}</p>}
        </div>

        <div className="card_footer">
          {date && (
            <p className="card_footer_item">
              <Clock className="card_footer_icon" />
              {formatDate(date)}
            </p>
          )}
          {tasks && tasks.length > 0 && (
            <p className="card_footer_item">
              <CheckSquare className="card_footer_icon" />
              {tasks.filter((task) => task.completed).length}/{tasks.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
