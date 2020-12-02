import './Display.stylesheet.css';
import { useState, useEffect } from "react";
import {displayScreenService} from "../../services/displayScreenService";

export default function Display(props) {
    const [displayScreen, updateDisplayScreen] = useState({
        temperature: '--',
        airPressure: '--',
        humidity: '--',
    });


    useEffect(() => {
        // subscriptions
        displayScreenService.displayObjectStepped$.subscribe(displayObject => {
            updateDisplayScreen(displayObject);
        });
        // \subscriptions

        // trigger events
        // temprature update
        displayScreenService.setTemperature('36');
        setTimeout(() => {
            displayScreenService.setTemperature('82');
        }, 4000);
        setTimeout(() => {
            displayScreenService.setTemperature('36');
        }, 4500);
        setTimeout(() => {
            displayScreenService.setTemperature('72');
        }, 4800);

        // airPressure update
        setTimeout(() => {
            displayScreenService.settAirPressure('82');
        }, 3300);

        // humidity update
        setTimeout(() => {
            displayScreenService.setHumidity('12');
        }, 2000);
        // \trigger events
    }, []);

    return (
        <div className="display">
            <div className="displayScreen">
                <div className="displayScreen__params">
                    <div className="displayScreen__param displayScreen__temperatureParam">
                        <div className="displayScreen__paramLabel">
                            Temperature
                        </div>
                        <div className="displayScreen__paramValue">
                            {displayScreen.temperature}
                        </div>
                    </div>
                    <div className="displayScreen__param displayScreen__airPressureParam">
                        <div className="displayScreen__paramLabel">
                            Air pressure
                        </div>
                        <div className="displayScreen__paramValue">
                            {displayScreen.airPressure}
                        </div>
                    </div>
                    <div className="displayScreen__param displayScreen__humidityParam">
                        <div className="displayScreen__paramLabel">
                            Humidity
                        </div>
                        <div className="displayScreen__paramValue">
                            {displayScreen.humidity}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
