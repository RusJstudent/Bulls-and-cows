'use strict';

const input = document.querySelector('.game__input');
const button = document.querySelector('.game__button');
const logElem = document.querySelector('.log');
const highScoreElem = document.getElementById('score__high-num');
const currentScoreElem = document.getElementById('score__current-num');

button.addEventListener('click', function(e) {
    guessHandler(input.value);
    input.value = '';
});
input.addEventListener('keydown', function(e) {
    if (e.code !== 'Enter') return;

    guessHandler(this.value);
    this.value = '';
});

// const numOfDigits = askNumOfDigits();
const numOfDigits = 4; // для отладки
const randomDigits = getRandomDigits(numOfDigits);
console.log(randomDigits); // подсказка для отладки

let highScore = localStorage.getItem('highScore') || 0;
let currentScore = numOfDigits * 1000;
showScore();

const history = [];

function askNumOfDigits() {
    let numOfDigits;

    do {
        numOfDigits = prompt('Введите количество цифр (от 2 до 9)', '');

        if (isNaN(numOfDigits) || numOfDigits === null) continue;
        if (numOfDigits >= 2 && numOfDigits <= 9) break;

        alert('Число должно быть от 2 до 9');
    } while (true);

    return +numOfDigits;
}

function getRandomDigits(num) {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const randomDigits = [];

    for (let i = 0; i < num; i++) {
        const randomDigitIdx = Math.floor(Math.random() * digits.length);
        const randomNum = digits.splice(randomDigitIdx, 1)[0];
        randomDigits.push(randomNum);
    }

    return randomDigits;
}

function guessHandler(value) { // менять
    if (!validateGuess(value)) return;
    history.push(value);

    let initialStr = randomDigits.join('');
    let bullsNum = 0; // быки (полное совпадение)
    let cowsNum = 0; // коровы (цифра есть, но не на своем месте)

    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (initialStr[i] === char) {
            bullsNum++;
        } else if (initialStr.includes(char)) {
            cowsNum++;
        }
    }

    insertResult(`${bullsNum}:${cowsNum}`);

    setTimeout(() => {
        initialStr === value ? winHandler() : updateScore();
    });
}

function validateGuess(value) {
    if (isNaN(+value)) {
        alert('Введенное значение должно быть числом');
        return;
    }

    if (value.length !== numOfDigits) {
        alert(`Необходимо ввести ${numOfDigits} цифр${numOfDigits >= 2 
            && numOfDigits <= 4 ? 'ы' : ''}`);
        return;
    }

    if (value.includes('0')) {
        alert('0 не участвует в данной игре');
        return;
    }
    
    for (let i = 0; i < value.length - 1; i++) {
        const char = value[i];
        if (!value.includes(char, i + 1)) continue;

        alert(`Цифра ${char} не должна повторяться`);
        return;
    }

    if (history.includes(value)) {
        alert(`Число ${value} уже введено ранее`);
        return;
    }
    
    return true;
}

function insertResult(value) {
    const log = `
        <div class="log__num">${logElem.children.length / 12}</div>
        <div class="log__value">${history[history.length - 1]}</div>
        <div class="log__result">${value}</div>
    `;
    logElem.insertAdjacentHTML('beforeend', log);
}

function winHandler() {
    if (currentScore > highScore) {
        localStorage.setItem('highScore', currentScore);
    }

    alert(`Победа! Очков набрано: ${currentScore}`);
    location.reload();
}

function showScore() {
    highScoreElem.textContent = highScore;
    currentScoreElem.textContent = currentScore;
}

function updateScore() {
    currentScore -= history.length * 10;

    if (currentScore <= 10) currentScore = 10;
    currentScoreElem.textContent = currentScore;
}