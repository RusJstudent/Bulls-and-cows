'use strict';

const DELAY_AFTER_INPUT = 1500; // Задержка перед тем, как окно переключится на другого игрока

const container = document.querySelector('.container');
const input = document.querySelector('.game__input');
const input2 = document.querySelectorAll('.game__input')[1];
const button = document.querySelector('.game__button');
const button2 = document.querySelectorAll('.game__button')[1];
const logElem = document.querySelector('.log');
const logElem2 = document.querySelectorAll('.log')[1];

button.addEventListener('click', function(e) {
    guessHandler(input.value);
    input.value = '';
});
input.addEventListener('keydown', function(e) {
    if (e.code !== 'Enter') return;

    guessHandler(this.value);
    this.value = '';
});

button2.addEventListener('click', function(e) {
    guessHandler(input2.value);
    input2.value = '';
});
input2.addEventListener('keydown', function(e) {
    if (e.code !== 'Enter') return;

    guessHandler(this.value);
    this.value = '';
});

const numOfDigits = askNumOfDigits();
const randomDigitsArr = getRandomDigits(numOfDigits);
const solvedDigits = Array(randomDigitsArr.length);
const solvedDigits2 = Array(randomDigitsArr.length);

let isPlayer1Turn = true;

const history = [];
const history2 = [];

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

    if (isPlayer1Turn) {
        history.push(value);
    } else {
        history2.push(value);
    }
    insertDefaultHTML();

    let gameIsCompleted = true;

    for (let i = 0; i < randomDigitsArr.length; i++) {
        if (isPlayer1Turn) {
            if (solvedDigits[i] === 1) {
                insertResult('Вы угадали');
                solvedDigits[i]++;
                continue;
            } else if (solvedDigits[i] === 2) {
                insertResult('');
                continue;
            }
        } else {
            if (solvedDigits2[i] === 1) {
                insertResult('Вы угадали');
                solvedDigits2[i]++;
                continue;
            } else if (solvedDigits2[i] === 2) {
                insertResult('');
                continue;
            }
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

        if (initialStr !== value) {
            gameIsCompleted = false;
            continue;
        }

        isPlayer1Turn ? solvedDigits[i] = 1 : solvedDigits2[i] = 1;
    }

    input.disabled = true;
    input2.disabled = true;
    setTimeout(() => {
        input.disabled = false;
        input2.disabled = false;
    }, DELAY_AFTER_INPUT + 300);

    setTimeout(() => {
        isPlayer1Turn = !isPlayer1Turn;
        container.classList.toggle('shift');
    }, DELAY_AFTER_INPUT);

    setTimeout(() => {
        if (gameIsCompleted) winHandler();
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

    if (isPlayer1Turn) {
        if (history.includes(value)) {
            alert(`Число ${value} уже введено ранее`);
            return;
        }
    } else {
        if (history2.includes(value)) {
            alert(`Число ${value} уже введено ранее`);
            return;
        }
    }
    
    return true;
}

function insertDefaultHTML() {
    let index = logElem.children.length / 12;
    if (!isPlayer1Turn) index = logElem2.children.length / 12;

    let number = history[history.length - 1];
    if (!isPlayer1Turn) number = history2[history2.length - 1];

    const html = `
        <div class="log__num">${index}</div>
        <div class="log__value">${number}</div>
    `;

    if (isPlayer1Turn) {
        logElem.insertAdjacentHTML('beforeend', html);
    } else {
        logElem2.insertAdjacentHTML('beforeend', html);
    }
}

function insertResult(value) {
    const html = `
        <div class="log__result">${value}</div>
    `;

    if (isPlayer1Turn) {
        logElem.insertAdjacentHTML('beforeend', html);
    } else {
        logElem2.insertAdjacentHTML('beforeend', html);
    }
}

function winHandler() {
    let player = 1;
    if (!isPlayer1Turn) player = 2;
    alert(`Победа! Игрок ${player} выиграл`);

    location.reload();
}

function solve() {
    // Функция для удобства разработки, вызывать только когда ничего не отгадано
    const delay = (DELAY_AFTER_INPUT + 300 + 10) * 2;

    let range = {
        from: 0,
        to: randomDigitsArr.length - 1,
      
        async *[Symbol.asyncIterator]() {
            for(let value = this.from; value <= this.to; value++) {
                await new Promise(resolve => setTimeout(resolve, delay));
                yield value;
            }
        }
    };
      
    (async () => {
        for await (let idx of range) {
            const str = randomDigitsArr[idx].join('');
            input.value = str;
            button.click();
            setTimeout(() => {
                input2.value = str.split('').reverse().join('');
                button2.click();
            }, delay / 2);
        }
    })();
}