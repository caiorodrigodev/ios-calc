let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetInput = false;
let allClear = true;

const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const clearButton = document.getElementById('clear-button');

// Initialize the clear button and add its event
clearButton.addEventListener('click', handleClear);

function updateDisplay() {
    // Show comma as decimal separator to the user
    resultElement.textContent = currentInput.replace('.', ',');

    // Adjust font size based on the length of the number
    if (currentInput.length > 9) {
        resultElement.classList.add('result-small');
        resultElement.classList.remove('result-smaller');
    } else if (currentInput.length > 12) {
        resultElement.classList.add('result-smaller');
        resultElement.classList.remove('result-small');
    } else {
        resultElement.classList.remove('result-small');
        resultElement.classList.remove('result-smaller');
    }

    if (operation) {
        // Also show comma in the history
        historyElement.textContent = `${previousInput.replace('.', ',')} ${getOperatorSymbol(operation)}`;
    } else {
        historyElement.textContent = '';
    }

    updateClearButtonText();
}

function updateClearButtonText() {
    clearButton.textContent = allClear ? 'AC' : 'C';
}

function handleClear() {
    if (allClear) {
        clearAll();
    } else {
        clearEntry();
    }
}

function clearAll() {
    currentInput = '0';
    previousInput = '0';
    operation = null;
    resetInput = false;
    allClear = true;

    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    resetInput = false;
    allClear = true;
    updateDisplay();
}

function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function appendNumber(number) {
    // If user types dot, convert to comma
    if (number === '.') number = ',';

    // Allow only one comma as decimal separator
    if (number === ',' && currentInput.includes(',')) {
        return;
    }

    // Prevent leading zeros
    if (currentInput === '0' && number !== ',') {
        currentInput = number;
    } else if (resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput += number;
    }

    allClear = false;
    updateDisplay();
}

function operator(op) {
    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    if (operation && !resetInput) {
        calculate();
    }

    previousInput = currentInput;
    operation = op;
    resetInput = true;
    updateDisplay();
}

function calculate() {
    // Always convert comma to dot before calculation
    const prev = parseFloat(previousInput.replace(',', '.'));
    const current = parseFloat(currentInput.replace(',', '.'));

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current === 0 ? 'Error' : prev / current;
            break;
        default:
            return;
    }

    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    // If result is error, show as is. Otherwise, convert to string with comma
    currentInput = result === 'Error' ? 'Error' : result.toString().replace('.', ',');
    operation = null;
    resetInput = true;
    allClear = true;
    updateDisplay();
}

function toggleSign() {
    if (currentInput === '0' || currentInput === 'Error') return;
    let num = parseFloat(currentInput.replace(',', '.'));
    num *= -1;
    currentInput = num.toString().replace('.', ',');
    updateDisplay();
}

function percentage() {
    const current = parseFloat(currentInput.replace(',', '.'));

    if (isNaN(current)) return;

    if (!operation) {
        currentInput = (current / 100).toString().replace('.', ',');
    } else {
        const prev = parseFloat(previousInput.replace(',', '.'));

        switch (operation) {
            case '+':
            case '-':
                currentInput = ((prev * current) / 100).toString().replace('.', ',');
                break;
            case '*':
            case '/':
                currentInput = (current / 100).toString().replace('.', ',');
                break;
        }
    }

    updateDisplay();
}

// Initialize display
updateDisplay();

// Keyboard support: accept both dot and comma as decimal separator
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.' || e.key === ',') appendNumber(',');
    else if (e.key === '+') operator('+');
    else if (e.key === '-') operator('-');
    else if (e.key === '*') operator('*');
    else if (e.key === '/') operator('/');
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clearAll();
    else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (allClear) clearAll();
        else clearEntry();
    }
    else if (e.key === '%') percentage();
});
