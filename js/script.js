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
const randomDigitsArr = getRandomDigits(numOfDigits);
console.log(randomDigitsArr); // подсказка для отладки
const solvedDigits = Array(randomDigitsArr.length);

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
    const result = [];

    for (let i = 0; i < 10; i++) {
        const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const randomDigits = [];
    
        for (let i = 0; i < num; i++) {
            const randomDigitIdx = Math.floor(Math.random() * digits.length);
            const randomNum = digits.splice(randomDigitIdx, 1)[0];
            randomDigits.push(randomNum);
        }

        result.push(randomDigits);
    }

    return result;
}

function guessHandler(value) {
    if (!validateGuess(value)) return;
    history.push(value);
    insertDefaultHTML();

    let gameIsCompleted = true;

    for (let i = 0; i < randomDigitsArr.length; i++) {
        if (solvedDigits[i] === 1) {
            insertResult('');
            continue;
        }

        let initialStr = randomDigitsArr[i].join('');
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

        initialStr === value ? solvedDigits[i] = 1 : gameIsCompleted = false;
    }

    setTimeout(() => {
        gameIsCompleted ? winHandler() : updateScore();
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

function insertDefaultHTML() {
    const html = `
        <div class="log__num">${logElem.children.length / 12}</div>
        <div class="log__value">${history[history.length - 1]}</div>
    `;

    logElem.insertAdjacentHTML('beforeend', html);
}

function insertResult(value) {
    const html = `
        <div class="log__result">${value}</div>
    `;
    logElem.insertAdjacentHTML('beforeend', html);
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

function solve(ms = 500) {
    // Функция для удобства разработки, вызывать только когда ничего не отгадано

    let range = {
        from: 0,
        to: randomDigitsArr.length - 1,
      
        async *[Symbol.asyncIterator]() {
            for(let value = this.from; value <= this.to; value++) {
                await new Promise(resolve => setTimeout(resolve, ms));
                yield value;
            }
        }
    };
      
    (async () => {
        for await (let idx of range) {
            const str = randomDigitsArr[idx].join('');
            input.value = str;
            button.click();
        }
    })();
}