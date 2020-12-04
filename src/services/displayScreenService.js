import {BehaviorSubject, combineLatest, timer} from "rxjs";
import {map, skipWhile, withLatestFrom} from 'rxjs/operators';

class DisplayScreenService {

    timeWhenDataConsideredToBeRelavant = 1000;
    timeStepToUpdateScreen = 100;

    provideTime(observable$) {
       return observable$.pipe(map(val => {
           const date = new Date();
           return {
               val,
               dateTime: date,
           }
       }))
    }

    addTimer(observable$) {
        const observableWithTime$ = this.provideTime(observable$);
        const timerWithTime$ = this.provideTime(timer(0,this.timeWhenDataConsideredToBeRelavant));
        return combineLatest([observableWithTime$, timerWithTime$]).pipe(map(([source, timer]) => {
            return {
                value: source.val,
                wasPushed: source.dateTime,
                lastTick: timer.dateTime,
            }
        }))
    }

    provideFresh(observable$) {
        return observable$.pipe(map((source) => {
            const diffTime = Math.abs(source.wasPushed - source.lastTick);
            if (diffTime > this.timeWhenDataConsideredToBeRelavant) {
                return 'N/A';
            } else {
                return source.value;
            }
        }))
    }

    constructor() {

        this._temperature$ = new BehaviorSubject();
        this._airPressure$ = new BehaviorSubject();
        this._humidity$ = new BehaviorSubject();

        this.temperature$ = this._temperature$.asObservable();
        this.airPressure$ = this._airPressure$.asObservable();
        this.humidity$ = this._humidity$.asObservable();

        this.temperatureWithTimer$ = this.addTimer(this.temperature$);
        this.airPressureWithTimer$ = this.addTimer(this.airPressure$);
        this.humidityWithTimer$ = this.addTimer(this.humidity$);

        this.temperatureFresh$ = this.provideFresh(this.temperatureWithTimer$);
        this.airPressureFresh$ = this.provideFresh(this.airPressureWithTimer$);
        this.humidityFresh$ = this.provideFresh(this.humidityWithTimer$);

        this.displayObjectNotEmpty$ = combineLatest([this.temperatureFresh$, this.airPressureFresh$, this.humidityFresh$]).pipe(skipWhile(params => {
            return params.indexOf(undefined) !== -1;
        }));

        this.displayObject$ = this.displayObjectNotEmpty$.pipe(map(([temperature, airPressure, humidity]) => {
            return {
                temperature,
                airPressure,
                humidity,
            };
        }));

        this.displayObjectStepped$ = timer(0, this.timeStepToUpdateScreen).pipe(
            withLatestFrom(this.displayObject$),
            map(([timer, displayObject]) => displayObject));
    }

    setTemperature(value) {
        this._temperature$.next(value);
    }

    settAirPressure(value) {
        this._airPressure$.next(value);
    }

    setHumidity(value) {
        this._humidity$.next(value);
    }

}

export const displayScreenService = new DisplayScreenService();
