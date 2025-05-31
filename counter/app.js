let count = document.getElementById('count')
let decCount = document.getElementById('decCount')
let incCount = document.getElementById('incCount')

let c = 0;
let ci = 0;
let cd = 0;
function inc() {
    c++;
    if (ci >= 10) {
        ci = 0
    }
    else {
        ci++
    }

    update()
}

function dec() {

    if (c > 0) {
        c--
    }
    else {
        c = 0
    }

    if (cd >= 10) {
        cd = 0
    }
    else {
        cd++
    }
    update()
}

function update() {
    count.textContent = c;
    incCount.textContent = ci
    decCount.textContent = cd
}