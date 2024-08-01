document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const noteTitle = document.getElementById('note-title');
    const noteText = document.getElementById('note-text');
    const noteDate = document.getElementById('note-date');
    const noteCategory = document.getElementById('note-category');
    const notesList = document.getElementById('notes-list');
    const searchInput = document.getElementById('search');
    const filterCategory = document.getElementById('filter-category');

    function loadNotes() {
        notesList.innerHTML = '';
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(note => addNoteToList(note));
    }

    function addNoteToList(note) {
        const li = document.createElement('li');
        li.className = 'note';
        li.setAttribute('data-id', note.id);
        li.innerHTML = `
            <div class="category">${note.category}</div>
            <p>${note.text}</p>
            <div class="date">Data: ${new Date(note.date).toLocaleDateString()}</div>
            <div>
                <button class="edit-button" onclick="editNote(${note.id})">Editar</button>
                <button class="delete-button" onclick="deleteNote(${note.id})">Excluir</button>
            </div>
        `;
        notesList.appendChild(li);
    }

    function saveNotes(notes) {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    noteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = noteTitle.value.trim();
        const text = noteText.value.trim();
        const date = noteDate.value;
        const category = noteCategory.value;

        if (title && text && date && category) {
            const id = Date.now();
            const note = { id, title, text, date, category };

            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push(note);
            saveNotes(notes);
            addNoteToList(note);
            noteForm.reset();
        }
    });

    window.editNote = function (id) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = notes.find(n => n.id === id);
        if (note) {
            const newText = prompt('Editar nota:', note.text);
            if (newText !== null) {
                note.text = newText;
                saveNotes(notes);
                loadNotes();
            }
        }
    };

    window.deleteNote = function (id) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const updatedNotes = notes.filter(note => note.id !== id);
        saveNotes(updatedNotes);
        loadNotes();
    };

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const notes = document.querySelectorAll('#notes-list .note');
        notes.forEach(note => {
            const noteText = note.querySelector('p').textContent.toLowerCase();
            note.style.display = noteText.includes(searchTerm) ? '' : 'none';
        });
    });

    filterCategory.addEventListener('change', () => {
        const selectedCategory = filterCategory.value;
        const notes = document.querySelectorAll('#notes-list .note');
        notes.forEach(note => {
            const noteCategory = note.querySelector('.category').textContent;
            note.style.display = selectedCategory === '' || noteCategory === selectedCategory ? '' : 'none';
        });
    });

    loadNotes();
});
