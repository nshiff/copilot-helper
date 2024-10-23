import "./App.css";
import { ExampleComponent } from "./components/ExampleComponent";
import { Note } from "./components/Note";

function App() {
  const notes = [
    {
      id: 1,
      title: "Example note 1",
      content: "This is an example note.",
    },
    {
      id: 2,
      title: "Example note 2",
      content: "This is also an example note.",
    },
    {
      id: 3,
      title: "Example note 3",
      content: "example note",
    },
  ];

  return (
    <div className="notes">
      {notes.map((note) => (
        <Note key={note.id} title={note.title} content={note.content} />
      ))}
    </div>
  );
}

export default App;
