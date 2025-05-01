// Variables to control calculator state
let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetInput = false;

// DOM Elements
const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');

// Function to update the display
function updateDisplay() {
    resultElement.textContent = currentInput;
    
    // Update history if there's an operation
    if (operation) {
        historyElement.textContent = `${previousInput} ${getOperatorSymbol(operation)}`;
    } else {
        historyElement.textContent = '';
    }
}

// Function to get the operator symbol
function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

// Function to append a number to the input
function appendNumber(number) {
    if (currentInput === '0' || resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput += number;
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentInput.includes('.')) {
        currentInput = currentInput.slice(0, -1);
    }
    
    updateDisplay();
}

// Add event listeners to number buttons
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});

// Function to handle operators
function handleOperator(op) {
    // If there's already a pending operation, calculate first
    if (operation && !resetInput) {
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    resetInput = true;
    updateDisplay();
}

// Function to calculate the result
function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
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
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operation = null;
    resetInput = true;
    updateDisplay();
}

// Add event listeners to operator buttons
document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        const operatorText = button.textContent;
        if (operatorText === '=') {
            calculate();
        } else {
            // Map symbols to operators
            let op;
            switch (operatorText) {
                case '+': op = '+'; break;
                case '−': op = '-'; break;
                case '×': op = '*'; break;
                case '÷': op = '/'; break;
                default: op = operatorText;
            }
            handleOperator(op);
        }
    });
});

// Initialize display
updateDisplay();