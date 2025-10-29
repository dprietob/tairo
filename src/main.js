import './style.css';
// import viteLogo from '/vite.svg'
import { Atomic } from './Render/Atomic';

const buttonA = Atomic.make('button');
buttonA.attribute('class', 'bg-gray-300');
buttonA.content('Test!');

const buttonB = Atomic.make('button');
buttonB.attribute('class', 'bg-red-300');
buttonB.content('Test 2!');
buttonB.event('click', function () {
    buttonA.content(Date.now().toString(36) + Math.random().toString(36).substr(2, 9));
});

document.querySelector('#app').appendChild(buttonA.render());
document.querySelector('#app').appendChild(buttonB.render());
