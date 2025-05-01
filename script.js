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
    resultElement.textContent = currentInput;

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
        historyElement.textContent = `${previousInput} ${getOperatorSymbol(operation)}`;
    } else {
        historyElement.textContent = '';
    }

    // Update the clear button text
    updateClearButtonText();
}

function updateClearButtonText() {
    clearButton.textContent = allClear ? 'AC' : 'C';
}

function handleClear() {
    if (allClear) {
        // AC - Clear all
        clearAll();
    } else {
        // C - Clear only current input
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
        case '-': return '−'; // Correct minus symbol
        case '*': return '×'; // Correct multiplication symbol
        case '/': return '÷'; // Correct division symbol
        default: return op;
    }
}

function appendNumber(number) {
    // Prevent multiple decimals
    if (number === '.' && currentInput.includes('.')) {
        return;
    }
    if (currentInput === '0' || resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput += number;
    }

    // Switch to "C" when typing starts
    allClear = false;

    updateDisplay();
}

function operator(op) {
    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    // Optionally, set the active class for the clicked operator if using event delegation

    if (operation && !resetInput) {
        calculate();
    }

    previousInput = currentInput;
    operation = op;
    resetInput = true;
    updateDisplay();
}

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

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
            // Handle division by zero
            result = current === 0 ? 'Error' : prev / current;
            break;
        default:
            return;
    }

    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });

    currentInput = result.toString();
    operation = null;
    resetInput = true;
    allClear = true;  // After calculation, revert to AC
    updateDisplay();
}

function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// PERCENTAGE FUNCTION (corrected for context)
function percentage() {
    const current = parseFloat(currentInput);

    if (isNaN(current)) return;

    // If there's no previous operation, just divide by 100
    if (!operation) {
        currentInput = (current / 100).toString();
    } 
    // If there is a pending operation, calculate the percentage based on the previous value
    else {
        const prev = parseFloat(previousInput);

        switch (operation) {
            case '+':
            case '-':
                // For addition and subtraction, calculate X% of Y
                currentInput = ((prev * current) / 100).toString();
                break;
            case '*':
            case '/':
                // For multiplication/division, divide the percentage by 100
                currentInput = (current / 100).toString();
                break;
        }
    }

    updateDisplay();
}

// Initialize display
updateDisplay();

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    else if (e.key === '.') appendNumber('.');
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
