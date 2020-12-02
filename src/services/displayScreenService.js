import {BehaviorSubject, combineLatest, timer} from "rxjs";
import {map, pairwise, withLatestFrom, skip} from 'rxjs/operators';

class DisplayScreenService {
    provideIndexes(observable) {
        return observable.pipe(map((value, index) => {
            return {
                value,
                index,
            }
        }));
    }

    provideFresh(indexedObservable) {
        return combineLatest([indexedObservable, timer( 1000, 1000).pipe(map((value, index) => {
                return {
                    timerValue: value,
                    timerIndex: index,
                }
            }))]
        ).pipe(
            map(([valueIndexed, timerIndexed]) => {
                return {
                    valueIndexed,
                    timerIndexed,
                }
            }),
            pairwise(),
            map(([prev, curr]) => {
                // if timer instance is changed (one second passed) but value instance stays the same
                if ((curr.timerIndexed.timerIndex !== prev.timerIndexed.timerIndex) && (curr.valueIndexed.index === prev.valueIndexed.index)) {
                    return 'N/A';
                } else {
                    return curr.valueIndexed.value;
                }
            })
        );
    }

    constructor() {
        this._temperature$ = new BehaviorSubject('');
        this._airPressure$ = new BehaviorSubject('');
        this._humidity$ = new BehaviorSubject('');

        // to skip empty (initial) values
        this.temperature$ = this._temperature$.asObservable().pipe(skip(0));
        this.airPressure$ = this._airPressure$.asObservable().pipe(skip(0));
        this.humidity$ = this._humidity$.asObservable().pipe(skip(0));

        this.temperatureWithIndexes$ = this.provideIndexes(this.temperature$);
        this.airPressureWithIndexes$ = this.provideIndexes(this.airPressure$);
        this.humidityWithIndexes$ = this.provideIndexes(this.humidity$);

        this.temperatureFresh$ = this.provideFresh(this.temperatureWithIndexes$);
        this.airPressureFresh$ = this.provideFresh(this.airPressureWithIndexes$);
        this.humidityFresh$ = this.provideFresh(this.humidityWithIndexes$);

        this.displayObject$ = combineLatest([this.temperatureFresh$, this.airPressureFresh$, this.humidityFresh$]).pipe(map(([temperature, airPressure, humidity]) => {
            return {
                temperature,
                airPressure,
                humidity,
            };
        }));

        this.displayObjectStepped$ = timer(100, 100).pipe(
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
