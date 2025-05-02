let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetInput = false;
let allClear = true;

// Set the locale for Brazil formatting
const LOCALE = 'pt-BR';
const DECIMAL_SEPARATOR = ',';
const INTERNAL_DECIMAL_SEPARATOR = '.';

const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');
const clearButton = document.getElementById('clear-button');

// Initialize the clear button and add event
clearButton.addEventListener('click', handleClear);

// Format number with thousand separators and comma as decimal separator for display
function formatNumberForDisplay(number) {
    // Check if the number has a decimal part
    if (number.includes('.')) {
        const parts = number.split('.');
        // Format the integer part with thousand separators
        const integerPart = parseFloat(parts[0]).toLocaleString('pt-BR', {
            useGrouping: true,
            maximumFractionDigits: 0
        });
        // Return integer part with decimal part using comma
        return `${integerPart},${parts[1]}`;
    } else {
        // Format integer with thousand separators
        return parseFloat(number).toLocaleString('pt-BR', {
            useGrouping: true,
            maximumFractionDigits: 0
        });
    }
}

function updateDisplay() {
    // Format the number for display with thousand separators
    resultElement.textContent = formatNumberForDisplay(currentInput);
    
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
    
    if (operation) {
        historyElement.textContent = `${formatNumberForDisplay(previousInput)} ${getOperatorSymbol(operation)}`;
    } else {
        historyElement.textContent = '';
    }
    
    // Update clear button text
    updateClearButtonText();
}

function updateClearButtonText() {
    clearButton.textContent = allClear ? 'AC' : 'C';
}

function handleClear() {
    if (allClear) {
        // AC - Clear everything
        clearAll();
    } else {
        // C - Clear only current entry
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
    // Convert comma to dot for internal calculations
    if (number === ',') {
        number = '.';
    }
    
    if (currentInput === '0' || resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput += number;
    }
    
    // Prevent multiple decimal points
    if (number === '.' && currentInput.split('.').length > 2) {
        currentInput = currentInput.slice(0, -1);
    }
    
    // Change to "C" when starting to type
    allClear = false;
    
    updateDisplay();
}

function operator(op) {
    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked operator (if using event.target)
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (operation && !resetInput) {
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    resetInput = true;
    updateDisplay();
}

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
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Convert to string with proper precision
    // Avoid scientific notation and limit to reasonable decimal places
    if (Math.abs(result) < 1e-10) {
        // Handle very small numbers close to zero
        result = 0;
    }
    
    // Handle result formatting
    currentInput = result.toString();
    
    operation = null;
    resetInput = true;
    allClear = true;  // After calculation, go back to AC
    updateDisplay();
}

function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// FIXED FUNCTION FOR PERCENTAGE
function percentage() {
    const current = parseFloat(currentInput);
    
    if (isNaN(current)) return;
    
    // If there's no previous operation, simply divide by 100
    if (!operation) {
        currentInput = (current / 100).toString();
    } 
    // If there's a pending operation, calculate percentage based on previous value
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

// Initialize display
updateDisplay();

// Add keyboard support
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