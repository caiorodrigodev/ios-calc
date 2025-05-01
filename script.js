// Variáveis para controlar o estado da calculadora
let currentInput = '0';
let previousInput = '0';
let operation = null;
let resetInput = false;

// Elementos do DOM
const resultElement = document.getElementById('result');
const historyElement = document.getElementById('history');

// Função para atualizar o display
function updateDisplay() {
    resultElement.textContent = currentInput;
    
    // Atualizar histórico se houver operação
    if (operation) {
        historyElement.textContent = `${previousInput} ${getOperatorSymbol(operation)}`;
    } else {
        historyElement.textContent = '';
    }
}

// Função para obter o símbolo do operador
function getOperatorSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

// Inicialização
updateDisplay();