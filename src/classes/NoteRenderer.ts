import {Note} from "./Note";
import { NoteHandlerRender } from "./NoteHandlerRender";

export class NoteRenderer {

    private readonly noteContainerId = 'notes';
    private readonly noteTextAreaId = 'note-body';
    private readonly noteActiveId = 'active-note';
    public static currentNoteId = -1;
    
private constructHTMLElement(note : Note){
    const topContainer = window.document.createElement('div');
    const headerRow = window.document.createElement('div');
    const header = window.document.createElement('h3');
    const delButton = window.document.createElement('button');
    const extract = window.document.createElement('p');
    topContainer.setAttribute('id',`@NOTE-${note.id}`);
    topContainer.className = 'note-item';
    headerRow.className = 'note-header';
    header.className = 'note-title';
    delButton.className = 'note-del-btn';
    extract.className = 'note-extract';
    header.innerHTML = note.title;
    delButton.innerHTML = 'x';

    if(note.body != ''){
        extract.innerHTML = note.body;
    }
    else{
        extract.innerHTML = 'Nota vacía...';
    }

    delButton.addEventListener('click',async ()=>{
        const noteElement = window.document.getElementById(`@NOTE-${note.id}`);
        noteElement.parentElement.removeChild(noteElement);
        window.IPC.send('note-deleted',note.id);
        NoteHandlerRender.notes = await window.IPC.invoke('retrieve-notes');
        console.log('render-side notes')
        console.log(NoteHandlerRender.notes)
        if(note.id == NoteRenderer.currentNoteId){
            window.document.getElementById(this.noteActiveId).innerHTML = 'Abre una nota...'
            window.document.getElementById(this.noteTextAreaId).innerHTML = '';
            NoteRenderer.currentNoteId = -1;
        }

    });

    headerRow.appendChild(header);
    headerRow.appendChild(delButton);
    topContainer.appendChild(headerRow);
    topContainer.appendChild(extract);

    topContainer.addEventListener('click', (e)=>{
        // clicking the note
        const textarea = window.document.getElementById(this.noteTextAreaId);
        textarea.value = note.body;
        window.document.getElementById(this.noteActiveId).innerHTML = note.title;
        textarea.focus();

    })


    return topContainer;
}


public drawNote(note : Note){
    const container = window.document.getElementById(this.noteContainerId);
    const noteElement = this.constructHTMLElement(note);
    //chequear si existe! -> updatear;
    NoteRenderer.currentNoteId = note.id;
    container.prepend(noteElement);
}

public updateNote(note :Note){
    const noteElement = window.document.getElementById(`@NOTE-${note.id}`);
    const extract = noteElement.children[1];
    extract.innerHTML= note.body;
    noteElement.addEventListener('click', (e)=>{
        window.document.getElementById(this.noteTextAreaId).value = note.body;
        window.document.getElementById(this.noteActiveId).innerHTML = note.title;
        NoteRenderer.currentNoteId = note.id;
    })
}

}