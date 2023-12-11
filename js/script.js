'use strict';

const DELAY_AFTER_INPUT = 500; // Задержка перед тем, как окно переключится на другого игрока
const USERS_COUNT = 4; // от 2 до 5 (всего 5 цветов)
const NUMS_COUNT = 1;

document.documentElement.style.setProperty('--grid-columns', NUMS_COUNT + 2);

const digitsPerNum = 4; // askDigitsPerNum();
const users = Array(USERS_COUNT);
initUsers();
let activePlayer = users[0];
const gameElem = User.anchorElem.firstElementChild;

function initUsers() {
    for (let i = 0; i < USERS_COUNT; i++) {
        users[i] = new User({
            id: i + 1,
            numbers: NUMS_COUNT,
            digitsPerNum,
        });

        users[i].button.addEventListener('click', function(e) {
            guessHandler(users[i].input.value);
            users[i].input.value = '';
        });
        users[i].input.addEventListener('keydown', function(e) {
            if (e.code !== 'Enter') return;
        
            guessHandler(this.value);
            this.value = '';
        });
    
        console.log(`user${i + 1}`, users[i].randomNumbers);
    }
}

function askDigitsPerNum() {
    let digitsPerNum;

    do {
        digitsPerNum = prompt('Введите количество цифр (от 2 до 9)', '');

        if (isNaN(digitsPerNum) || digitsPerNum === null) continue;
        if (digitsPerNum >= 2 && digitsPerNum <= 9) break;

        alert('Число должно быть от 2 до 9');
    } while (true);

    return +digitsPerNum;
}

function guessHandler(value) {
    if (!validateGuess(value)) return;

    activePlayer.history.push(value);
    insertDefaultHTML();

    let allNumbersCorrect = true;

    for (let i = 0; i < activePlayer.randomNumbers.length; i++) {
        if (activePlayer.guessedNumbers[i] === 1) {
            insertResult('Вы угадали');
            activePlayer.guessedNumbers[i]++;
            continue;
        } else if (activePlayer.guessedNumbers[i] === 2) {
            insertResult('');
            continue;
        }

        let initialStr = activePlayer.randomNumbers[i].join('');
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
            allNumbersCorrect = false;
            continue;
        }

        activePlayer.guessedNumbers[i] = 1;
    }

    activePlayer.input.disabled = true;
    gameElem.ontransitionend = e => {
        activePlayer.input.disabled = false;
    }

    setTimeout(changeTurn, DELAY_AFTER_INPUT);

    setTimeout(() => {
        if (allNumbersCorrect) winHandler();
    });
}

function changeTurn() {
    let currentPlayerIdx = users.indexOf(activePlayer);
    (currentPlayerIdx === users.length - 1) ? currentPlayerIdx = 0 : currentPlayerIdx++;
    activePlayer = users[currentPlayerIdx];

    gameElem.style.marginLeft = `${-100 * currentPlayerIdx}vw`;
}

function validateGuess(value) {
    if (isNaN(+value)) {
        alert('Введенное значение должно быть числом');
        return;
    }

    if (value.length !== digitsPerNum) {
        alert(`Необходимо ввести ${digitsPerNum} цифр${digitsPerNum >= 2 
            && digitsPerNum <= 4 ? 'ы' : ''}`);
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

    if (activePlayer.history.includes(value)) {
        alert(`Число ${value} уже введено ранее`);
        return;
    }
    
    return true;
}

function insertDefaultHTML() {
    const number = activePlayer.logElem.children.length / (2 + NUMS_COUNT);
    const value = activePlayer.history[activePlayer.history.length - 1];
    const html = `
        <div class="log__num">${number}</div>
        <div class="log__value">${value}</div>
    `;

    activePlayer.logElem.insertAdjacentHTML('beforeend', html);
}

function insertResult(value) {
    const html = `
        <div class="log__result">${value}</div>
    `;

    activePlayer.logElem.insertAdjacentHTML('beforeend', html);
}

function winHandler() {
    alert(`Победа! Игрок ${activePlayer.id} выиграл`);

    location.reload();
}