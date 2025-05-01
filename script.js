// Variables to control calculator state
let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetInput = false;
let allClear = true;

// DOM Elements
const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const clearButton = document.getElementById('clear-button');

// Function to update the display
function updateDisplay() {
    resultElement.textContent = currentInput;
    
    // Adjust font size based on number length
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
    // Remove active class from all operator buttons
    document.querySelectorAll('.operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked operator (if using event.target)
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
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
    
    // Remove active class from all operator buttons
    document.querySelectorAll('.operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
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

// Functions for special buttons
function clearAll() {
    currentInput = '0';
    previousInput = '0';
    operation = null;
    resetInput = false;
    allClear = true;
    clearButton.textContent = 'AC';
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    resetInput = false;
    allClear = true;
    clearButton.textContent = 'AC';
    updateDisplay();
}

function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// CORRECTED FUNCTION - Fixed percentage calculation
function percentage() {
    const current = parseFloat(currentInput);
    
    if (isNaN(current)) return;
    
    // If there's no previous operation, simply divide by 100
    if (!operation) {
        currentInput = (current / 100).toString();
    } 
    // If there's a pending operation, calculate percentage based on the previous value
    else {
        const prev = parseFloat(previousInput);
        
        switch (operation) {
            case '+':
                // For addition, calculate X% of Y and add to Y
                currentInput = ((prev * current) / 100).toString();
                break;
            case '-':
                // For subtraction, calculate X% of Y and subtract from Y
                currentInput = ((prev * current) / 100).toString();
                break;
            case '*':
                // For multiplication, divide percentage by 100
                currentInput = (current / 100).toString();
                break;
            case '/':
                // For division, divide percentage by 100
                currentInput = (current / 100).toString();
                break;
        }
    }
    
    updateDisplay();
}

// Add event listeners to function buttons
clearButton.addEventListener('click', () => {
    if (allClear) {
        clearAll();
    } else {
        clearEntry();
    }
});

document.querySelector('.function:nth-of-type(2)').addEventListener('click', toggleSign);
document.querySelector('.function:nth-of-type(3)').addEventListener('click', percentage);

// Update the AC/C button
function updateClearButtonText() {
    clearButton.textContent = allClear ? 'AC' : 'C';
}

// Update the appendNumber function to change AC to C
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
    
    // Change to "C" when starting to type
    allClear = false;
    updateClearButtonText();
    
    updateDisplay();
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+') {
        handleOperator('+');
    } else if (e.key === '-') {
        handleOperator('-');
    } else if (e.key === '*') {
        handleOperator('*');
    } else if (e.key === '/') {
        handleOperator('/');
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (allClear) {
            clearAll();
        } else {
            clearEntry();
        }
    } else if (e.key === '%') {
        percentage();
    }
});

// Initialize display
updateDisplay();