import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils';
import Display from './';

test('does display screen have proper value at certain point', () => {
    // to increase time limit for long-termed tests
    jest.setTimeout(10000);

    act(() => {
        render(<Display />);
    });

    const temepratureExpected = "38";
    const airPressureExpected = "82";
    const humidityExpected = "N/A";
    const timeout = 4000;

    const temperatureEl = screen.getByTestId("temperature");
    const airPressureEl = screen.getByTestId("airPressure");
    const humidityEl = screen.getByTestId("humidity");

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    }).then(() => {
        expect(temperatureEl).toHaveTextContent(temepratureExpected);
        expect(airPressureEl).toHaveTextContent(airPressureExpected);
        expect(humidityEl).toHaveTextContent(humidityExpected);
    })
});
