class User {
    static anchorElem = document.querySelector('.wrapper');
    static colors = ['rgb(189, 45, 45)', 'rgb(50, 50, 104)', '#873ebb', '#c58753', '#1d8271'];

    constructor({id, numbers, digitsPerNum}) {
        this.id = id;
        this.history = [];
        this.randomNumbers = this.getSetOfRandomNumbers(numbers, digitsPerNum);
        this.guessedNumbers = Array(numbers);

        this.generateHTML(numbers);

        const currentGame = User.anchorElem.querySelector(`[data-id="${this.id}"]`);
        this.input = currentGame.querySelector('.game__input');
        this.button = currentGame.querySelector('.game__button');
        this.logElem = currentGame.querySelector('.game__log');
    }

    generateHTML(numsCount) {
        let color = User.colors.shift();

        let nums = '';
        for (let i = 0; i < numsCount; i++) {
            nums += `<div>Число ${i + 1}</div>`;
        }
        if (numsCount === 1) nums = '<div>Число</div>';

        const html = `
            <div data-id="${this.id}" class="game">
                <div style="background: ${color}" class="game__container">
                    <div class="game__player">Игрок ${this.id}</div>
                    <div class="game__inputs">
                        <input type="text" class="game__input">
                        <button class="game__button">Отправить</button>
                    </div>
                    <div class="game__log">
                        <div>Номер</div>
                        <div>Введено</div>
                        ${nums}
                    </div>
                </div>
            </div>
        `;

        User.anchorElem.insertAdjacentHTML('beforeend', html);
    }

    getSetOfRandomNumbers(nums, digitsCount) {
        const result = [];
    
        for (let i = 0; i < nums; i++) {
            const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const randomNumber = [];
        
            for (let i = 0; i < digitsCount; i++) {
                const randomDigitIdx = Math.floor(Math.random() * digits.length);
                const randomDigit = digits.splice(randomDigitIdx, 1)[0];
                randomNumber.push(randomDigit);
            }
    
            result.push(randomNumber);
        }
    
        return result;
    }
}