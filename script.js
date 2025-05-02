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

// Prevent zoom on iOS devices
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});
document.addEventListener('touchmove', function (e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });

// Format number with thousand separators and comma as decimal separator for display
function formatNumberForDisplay(number) {
    // Check for error messages
    if (typeof number === 'string' && 
        (number === 'Undefined' || number === 'Indeterminate' || 
         number === 'Error' || number === 'Overflow')) {
        return number;
    }
    
    // Check for scientific notation (e.g., 1e10)
    if (typeof number === 'string' && number.includes('e')) {
        return number.replace('e', 'e');
    }
    
    // Check if the number has a decimal part
    if (String(number).includes(INTERNAL_DECIMAL_SEPARATOR)) {
        const parts = String(number).split(INTERNAL_DECIMAL_SEPARATOR);
        // Format the integer part with thousand separators
        const integerPart = parseFloat(parts[0]).toLocaleString(LOCALE, {
            useGrouping: true,
            maximumFractionDigits: 0
        });
        // Return integer part with decimal part using comma
        return `${integerPart}${DECIMAL_SEPARATOR}${parts[1]}`;
    } else {
        // Format integer with thousand separators
        return parseFloat(number).toLocaleString(LOCALE, {
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
    // Don't allow input if we're showing an error message
    if (currentInput === 'Undefined' || currentInput === 'Indeterminate' || 
        currentInput === 'Error' || currentInput === 'Overflow') {
        clearAll();
    }
    
    // Convert comma to dot for internal calculations
    if (number === ',') {
        // If decimal point is first input or after reset, ensure it's prepended with zero
        if (currentInput === '0' || resetInput) {
            currentInput = '0.';
            resetInput = false;
        } else {
            currentInput += '.';
        }
    } else {
        if (currentInput === '0' || resetInput) {
            currentInput = number;
            resetInput = false;
        } else {
            currentInput += number;
        }
    }
    
    // Prevent multiple decimal points
    if (number === ',' && currentInput.split('.').length > 2) {
        currentInput = currentInput.slice(0, -1);
    }
    
    // Change to "C" when starting to type
    allClear = false;
    
    updateDisplay();
}

function operator(op) {
    // Don't allow operations if we're showing an error message
    if (currentInput === 'Undefined' || currentInput === 'Indeterminate' || 
        currentInput === 'Error' || currentInput === 'Overflow') {
        clearAll();
        return;
    }
    
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
    
    // Handle division by zero
    if (operation === '/' && current === 0) {
        if (prev === 0) {
            currentInput = 'Indeterminate'; // 0/0 is indeterminate
        } else {
            currentInput = 'Undefined'; // x/0 is undefined
        }
        operation = null;
        resetInput = true;
        allClear = true;
        updateDisplay();
        return;
    }
    
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
    
    // Check for other calculation errors or overflows
    if (!isFinite(result)) {
        currentInput = 'Error';
        operation = null;
        resetInput = true;
        allClear = true;
        updateDisplay();
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
    
    // Use scientific notation for very large numbers (10 billion or more)
    if (Math.abs(result) >= 1e10) {
        // Convert to scientific notation (e.g., 1e10)
        currentInput = result.toExponential(0);
    } else {
        // Normal formatting
        currentInput = result.toString();
    }
    
    operation = null;
    resetInput = true;
    allClear = true;  // After calculation, go back to AC
    updateDisplay();
}

function toggleSign() {
    // Don't toggle sign if we're showing an error message
    if (currentInput === 'Undefined' || currentInput === 'Indeterminate' || 
        currentInput === 'Error' || currentInput === 'Overflow') {
        return;
    }
    
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// Percentage function
function percentage() {
    // Don't calculate percentage if we're showing an error message
    if (currentInput === 'Undefined' || currentInput === 'Indeterminate' || 
        currentInput === 'Error' || currentInput === 'Overflow') {
        return;
    }
    
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