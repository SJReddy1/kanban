import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Type,
  Trash,
} from "react-feather";

import Editable from "../../Editables/Editable";
import Modal from "../../Modal/Modal";
import "./CardInfo.css";

function CardInfo({ card, boardId, updateCard, onClose }) {
  const colors = ["#a8193d", "#4fcc25", "#1ebffa", "#8da377", "#9975bd", "#cf61a1", "#240959"];
  const [values, setValues] = useState({ ...card });
  const [initialValues] = useState({ ...card }); // Store initial state to handle cancel

  const [labelText, setLabelText] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (updateCard) {
      updateCard(boardId, values.id, values);
    }
  }, [values]);

  const updateTitle = (value) => setValues({ ...values, title: value });
  const updateDesc = (value) => setValues({ ...values, desc: value });
  const updateDate = (date) => setValues({ ...values, date });

  const addLabel = () => {
    if (labelText && selectedColor) {
      const newLabel = { text: labelText, color: selectedColor };
      if (!values.labels.some((item) => item.text === newLabel.text)) {
        setValues({ ...values, labels: [...values.labels, newLabel] });
      }
      setLabelText("");
      setSelectedColor("");
    }
  };

  const handleSaveChanges = () => {
    if (updateCard) {
      updateCard(boardId, values.id, values);
    }
    onClose(); // Close modal after saving changes
  };

  const handleCancelChanges = () => {
    setValues({ ...initialValues }); // Reset values to original state
    onClose(); // Close modal without saving changes
  };

  const calculatePercent = () =>
    values.tasks.length
      ? (values.tasks.filter((task) => task.completed).length / values.tasks.length) * 100
      : 0;

  return (
    <Modal onClose={onClose}>
      <div className="cardinfo">
        {/* Title */}
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            <p>Title</p>
          </div>
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"
            onSubmit={updateTitle}
          />
        </div>

        {/* Description */}
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            <p>Description</p>
          </div>
          <Editable
            defaultValue={values.desc}
            text={values.desc || "Add a description"}
            placeholder="Enter Description"
            onSubmit={updateDesc}
          />
          {values.desc && (
            <Trash onClick={() => setValues({ ...values, desc: "" })} />
          )}
        </div>

        {/* Date */}
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            <p>Date</p>
          </div>
          <input
            type="date"
            defaultValue={values.date}
            onChange={(e) => updateDate(e.target.value)}
          />
        </div>

        {/* Tasks */}
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          <div className="cardinfo_box_progress-bar">
            <div
              className="cardinfo_box_progress"
              style={{
                width: `${calculatePercent()}%`,
                backgroundColor: calculatePercent() === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <div className="cardinfo_box_tasks">
            {values.tasks?.map((task) => (
              <div key={task.id} className="cardinfo_box_task">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => setValues({
                    ...values,
                    tasks: values.tasks.map((t) =>
                      t.id === task.id ? { ...t, completed: e.target.checked } : t
                    ),
                  })}
                />
                <p>{task.text}</p>
                <Trash onClick={() =>
                  setValues({
                    ...values,
                    tasks: values.tasks.filter((t) => t.id !== task.id),
                  })
                }
                />
              </div>
            ))}
          </div>
          <Editable
            text="Add a task"
            placeholder="Enter Task"
            onSubmit={(taskText) => {
              const task = { id: Date.now(), text: taskText, completed: false };
              setValues({
                ...values,
                tasks: [...values.tasks, task],
              });
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="cardinfo_buttons">
          <button className="save-button" onClick={handleSaveChanges}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={handleCancelChanges}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
