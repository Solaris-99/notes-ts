export class Note{
    private static counter = 0;
    public id: number;
    public title: string;
    public body: string;
    

    public constructor(title:string);
    public constructor(title:string, body?:string, id?:number){
        this.title = title;
        if(body !== undefined && id !== undefined){
            this.body = body;
            this.id = id;    
        }
        else{
            this.body = '';
            this.id = Note.counter;
        }
        Note.counter++
    }



}