// button.onclick, input.onclick
// динамическая генерация html

class User {
    constructor({id, numbers, digitsPerNum}) {
        this.id = id;
        this.history = [];
        this.randomNumbers = this.getSetOfRandomNumbers(numbers, digitsPerNum);
        this.guessedNumbers = Array(numbers);
        this.logElem = document.querySelectorAll('.log')[id - 1];
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