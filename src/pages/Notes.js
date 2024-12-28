import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import './Notes.css';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="editor-menu">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      {/* Add more formatting buttons as needed */}
    </div>
  );
};

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (currentNote) {
        const content = editor.getHTML();
        saveNote(content);
      }
    },
  });

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString()
    };
    setNotes([...notes, newNote]);
    setCurrentNote(newNote);
    setNoteTitle('Untitled Note');
    if (editor) {
      editor.commands.setContent('');
    }
  };

  const saveNote = (content) => {
    if (!currentNote) return;
    
    const updatedNotes = notes.map(note => 
      note.id === currentNote.id 
        ? { ...note, title: noteTitle, content: content }
        : note
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    if (currentNote && currentNote.id === noteId) {
      setCurrentNote(null);
      setNoteTitle('');
      if (editor) {
        editor.commands.setContent('');
      }
    }
  };

  const selectNote = (note) => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    if (editor) {
      editor.commands.setContent(note.content);
    }
  };

  return (
    <div className="notes-container">
      <div className="notes-sidebar">
        <button className="new-note-btn" onClick={createNewNote}>
          New Note
        </button>
        <div className="notes-list">
          {notes.map(note => (
            <div 
              key={note.id} 
              className={`note-item ${currentNote?.id === note.id ? 'active' : ''}`}
              onClick={() => selectNote(note)}
            >
              <div className="note-title">{note.title}</div>
              <button 
                className="delete-note-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="note-editor">
        {currentNote ? (
          <>
            <input
              type="text"
              className="note-title-input"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              onBlur={() => saveNote(editor.getHTML())}
            />
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </>
        ) : (
          <div className="no-note-selected">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;