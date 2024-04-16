/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { Note } from './classes/Note';
import { NoteRenderer } from './classes/NoteRenderer';
import { NoteHandlerRender } from './classes/NoteHandlerRender';

let notes = NoteHandlerRender.notes;
const renderer = new NoteRenderer();

async function updateNotes(draw: boolean): void {
    notes = await window.IPC.invoke('retrieve-notes');
    if (notes.length == 0) {
        return;
    }
    for (let i = notes.length - 1; i >= 0; i--) {

        if (draw) { renderer.drawNote(notes[i]) }
        renderer.updateNote(notes[i])
    }
    if(NoteRenderer.currentNoteId >= 0){
        document.getElementById('active-note').innerHTML = notes.find((e)=>e.id==NoteRenderer.currentNoteId).title;
        document.getElementById('note-body').value = notes.find((e)=>e.id==NoteRenderer.currentNoteId).body;
    }
}
updateNotes(true)

const drawPlaceholder = function(){
    if(!window.document.getElementById('notes').hasChildNodes()){
        window.document.getElementById('notes').innerHTML = "<p id='notes-placeholder'>Aquí apareceran tus tareas</p>";
    }
}
drawPlaceholder();

const addNote = async function (e: Event) {
    e.preventDefault();
    if(window.document.getElementById('notes-placeholder')){
        window.document.getElementById('notes').removeChild(window.document.getElementById('notes-placeholder'))
    }
    const entryForm = document.getElementById('note-entry');
    if (entryForm.value == '') { return }
    const title: string = entryForm.value;
    window.IPC.send('note-created', title);
    entryForm.value = '';
    const note: Note = await window.IPC.invoke('retrieve-lastNote');
    notes.unshift(note)
    renderer.drawNote(notes[0])
    document.getElementById(`@NOTE-${note.id}`).click();
    
}


const updateBody = function (e: Event) {
    const bodyForm = document.getElementById('note-body');
    const currentId = NoteRenderer.currentNoteId;
    if(currentId <0){return}
    const formValue = bodyForm.value;
    window.IPC.send('note-body-updated', {
        body: formValue,
        id: currentId
    });
    const noteElement = window.document.getElementById(`@NOTE-${currentId}`);
    const extract = noteElement.children[1];
    extract.innerHTML = formValue;
    notes.find((e) => e.id == currentId).body = formValue;
    updateNotes(false)
}



document.getElementById('note-body').addEventListener('input', updateBody);

const formAdd = document.getElementById("note-add");
formAdd.addEventListener('submit', addNote);

console.log('👋 This message is being logged by "renderer.ts", included via Vite');
