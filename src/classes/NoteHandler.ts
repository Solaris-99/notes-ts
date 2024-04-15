import {Note} from "./Note";
import fs from 'fs';

export class NoteHandler {

    private notes : Note[] ;
    private readonly SAVE_FILE = 'data.json';
    private static instance: NoteHandler;

    private constructor(){
        this.notes = [];
        console.log(this.load())
    }

    public static getInstace(): NoteHandler{
        if(NoteHandler.instance === undefined){
            NoteHandler.instance = new NoteHandler()
        }
        return NoteHandler.instance;
    }

    public append(note: Note){
        this.notes.unshift(note);
    }

    public createNote(title:string){
        const note = new Note(title);
        this.append(note);
    }
    
    public getNotes(): Note[]{
        return this.notes;
    }

    public getLastNote(): Note {
        return this.notes[0];
    }

    public updateNoteBody(id:number, body:string){
        const to_update = this.notes.find((e)=>e.id == id);
        to_update.body = body;
        return to_update;
    }

    public removeNote(id:number){
        const to_remove = this.notes.findIndex((e)=>e.id==id);
        if(to_remove>-1){
            this.notes.splice(to_remove,1);
        }
    }

    public save():void{
        const jsonString = JSON.stringify(this.notes);
        fs.writeFileSync(this.SAVE_FILE,jsonString);
    }

    private load(){
        if(!fs.existsSync(this.SAVE_FILE)){
            return;
        }
        const jsonString = fs.readFileSync('data.json','utf-8');
        const jsonNotes = JSON.parse(jsonString);
        for(let jsonNote of jsonNotes){
            const note = new Note(jsonNote.title,jsonNote.body,jsonNote.id);
            this.notes.push(note)
        }
    }

}