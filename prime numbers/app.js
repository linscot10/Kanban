function cprime() {
    let input = parseInt(document.getElementById('input').value)
    let result = document.getElementById('result')


    if (isNaN(input) || input <= 1) {
        result.textContent = "Please Enter A number Greater than 1"
        result.style.color = 'red'
        return;
    }

    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(input); i++) {
        if (input % i === 0) {
            isPrime = false
            break;
        }
    }

    if (isPrime) {
        result.textContent = `${input} is a Prime Number.`;
        result.style.color = `green`;
    } else {
        res.textContent = `${input} is a Non-Prime Number.`;
        res.style.color = "blue";
    }

}