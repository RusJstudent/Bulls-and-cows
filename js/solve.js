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