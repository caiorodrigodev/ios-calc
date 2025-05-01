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
    resultElement.textContent = currentInput;
    
    // Adjusts the font size based on the length of the number
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
        historyElement.textContent = `${previousInput} ${getOperatorSymbol(operation)}`;
    } else {
        historyElement.textContent = '';
    }
    
    // Updates the text of the clear button
    updateClearButtonText();
}

function updateClearButtonText() {
    clearButton.textContent = allClear ? 'AC' : 'C';
}

function handleClear() {
    if (allClear) {
        // AC - Clears everything
        clearAll();
    } else {
        // C - Clears only the current entry
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
    if (currentInput === '0' || resetInput) {
        currentInput = number;
        resetInput = false;
    } else {
        currentInput += number;
    }
    
    // Prevent multiple decimal points
    if (number === ',' && currentInput.includes(',')) {
        currentInput = currentInput.slice(0, -1);
    }
    
    // Mudamos para "C" ao começar a digitar
    allClear = false;
    
    updateDisplay();
}

function operator(op) {
    // Remove active class from all operator buttons
    document.querySelectorAll('.button-operator').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked operator (se estiver usando event.target)
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
    
    currentInput = result.toString();
    operation = null;
    resetInput = true;
    allClear = true;  // Depois de calcular, voltamos para AC
    updateDisplay();
}

function toggleSign() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// FUNÇÃO CORRIGIDA PARA PORCENTAGEM
function percentage() {
    const current = parseFloat(currentInput);
    
    if (isNaN(current)) return;
    
    // Se não houver operação anterior, simplesmente divide por 100
    if (!operation) {
        currentInput = (current / 100).toString();
    } 
    // Se houver uma operação pendente, calcule a porcentagem com base no valor anterior
    else {
        const prev = parseFloat(previousInput);
        
        switch (operation) {
            case '+':
                // Para adição, calculamos X% de Y e somamos a Y
                currentInput = ((prev * current) / 100).toString();
                break;
            case '-':
                // Para subtração, calculamos X% de Y e subtraímos de Y
                currentInput = ((prev * current) / 100).toString();
                break;
            case '*':
                // Para multiplicação, dividimos o percentual por 100
                currentInput = (current / 100).toString();
                break;
            case '/':
                // Para divisão, dividimos o percentual por 100
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
    else if (e.key === ',') appendNumber(',');
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
