import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./styles.css"; // Import your CSS file

const tasks = [
  { id: "1", content: "Learn React" },
  { id: "2", content: "Build a drag-and-drop app" },
  { id: "3", content: "Deploy the app" },
];

const columns = [
  { id: "todo", title: "To Do", taskIds: ["1", "2", "3"] },
  { id: "inprogress", title: "In Progress", taskIds: [] },
  { id: "done", title: "Done", taskIds: [] },
];

const App = () => {
  const [state, setState] = useState({ tasks, columns });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return; // No change
    }

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = state.columns.find((col) => col.id === source.droppableId);
      const newTaskIds = Array.from(column.taskIds);
      const [removed] = newTaskIds.splice(result.source.index, 1);
      newTaskIds.splice(result.destination.index, 0, removed);

      const newColumns = state.columns.map((col) =>
        col.id === source.droppableId ? { ...col, taskIds: newTaskIds } : col
      );

      setState({ ...state, columns: newColumns });
    } else {
      // Moving between columns
      const sourceColumn = state.columns.find(
        (col) => col.id === source.droppableId
      );
      const destColumn = state.columns.find(
        (col) => col.id === destination.droppableId
      );

      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const destTaskIds = Array.from(destColumn.taskIds);

      const [removed] = sourceTaskIds.splice(result.source.index, 1);
      destTaskIds.splice(result.destination.index, 0, removed);

      const newColumns = state.columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, taskIds: sourceTaskIds };
        } else if (col.id === destination.droppableId) {
          return { ...col, taskIds: destTaskIds };
        } else {
          return col;
        }
      });

      setState({ ...state, columns: newColumns });
    }
  };

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {state.columns.map((column) => (
          <div key={column.id} className="kanban-column">
            <h3>{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {column.taskIds.map((taskId, index) => {
                    const task = state.tasks.find((t) => t.id === taskId);
                    return (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="kanban-task"
                          >
                            {task.content}
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default App;
