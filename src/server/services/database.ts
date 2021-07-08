const fs = require("fs");

interface DatabaseInterface {
    open: (filename: string) => void;
    get: (id: string, parameter?: string) => Promise<string>;
    set: (id: string, parameter: any, value?: any) => void;
    create: (id: string, parameters: Array<string>) => void;
    getByNumberId: (id: number) => Promise<string>;
}

class Database implements DatabaseInterface {
    filename: string;
    idsCount: number;

    constructor() {
        this.filename = "";
        this.idsCount = 0;
    }

    open(filename: string): void {
        this.filename = filename;

        fs.readFile(this.filename, (err: any, data: any) => {
            if(err) console.error(err)
            else this.idsCount = Object.keys(JSON.parse(data)).length;
        })
    }

    get(id: string, parameter?: string): Promise<any> {
        return new Promise((res, rej) => {
            fs.readFile(this.filename, (err: any, data: any) => {
                if(err) rej(err);

                let row = JSON.parse(data)[id];

                if(parameter) {
                    res(row[parameter]); // Always string
                } else if(row) {
                    res(row); // Always object
                } else {
                    res("");
                }
            });
        });
    }

    getByNumberId(id: number): Promise<any> {
        return new Promise((res, rej) => {
            fs.readFile(this.filename, (err: any, data: any) => {
                if(err) rej(err);

                let rows = JSON.parse(data);

                res({id: Object.keys(rows)[id], data: rows[Object.keys(rows)[id]]});
            });
        });
    }

    set(id: string, parameter: any, value?: any): Promise<void> {
        return new Promise((res, rej) => {
            fs.readFile(this.filename, (err: any, data: any) => {
                if(err) {
                    console.error(err);
                    rej(err);
                }
    
                let rows = JSON.parse(data);
    
                if(!rows[id]) {
                    rows[id] = {};
                }
    
                if(value) {
                    rows[id][parameter] = value;
                } else {
                    rows[id] = parameter;
                }
    
                fs.writeFile(this.filename, JSON.stringify(rows), (err: any) => {
                    if(err) {
                        console.error(err);
                        rej(err);
                    } else {
                        res();
                    }
                });
            });

        });
    }

    create(id: string, parameters: any): void {
        fs.readFile(this.filename, (err: any, data: any) => {
            if(err) console.error(err);

            let rows = JSON.parse(data);

            if(!rows[id]) {
                this.idsCount++;
            }

            rows[id] = parameters;

            fs.writeFile(this.filename, JSON.stringify(rows), (err: any) => {
                if(err) console.error(err);
            });
        });
    }
}

export { Database };