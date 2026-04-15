export class Time {
    private _time: String;
    
    get isoTime(): String {
        return this._time;
    }

    get hmsTime(): String {
        return this._time.slice(0,10);
    }

    constructor(time: Date) {
        this._time = time.toISOString();
    }
}