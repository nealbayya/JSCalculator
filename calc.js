// GLOBAL VARIABLES

let ans = 0; // previously computed answer
let expr = []; // array for numbers and symbols
let numButtons = []; //numbered buttons (indices 0-9 correspond to buttons 0-9)
let operators = [];
let numbers = [];

// OPERATIONS
function add(a, b) { return a + b;}
function subtract(a, b) { return a - b;}
function multiply(a, b) { return a * b;}
function divide(a, b) { return a / b;}

function comparePrecedence(newOper, stackTopOper) {
    if (stackTopOper === '(') {
        return 1;
    }
    let lowerPrec = ['add', 'subtract'];
    let higherPrec = ['multiply', 'divide'];
    let newOperName = newOper.name;
    let stackTopName = stackTopOper.name;
    if (higherPrec.includes(newOperName) && lowerPrec.includes(stackTopName)) {
        return 1;
    } else if (lowerPrec.includes(newOperName) && higherPrec.includes(stackTopName)) {
        return -1;
    }
    return 0;
}

function prepareEvalArray() {
    let exprPrepared = [];
    let i = 0;
    while (i < expr.length) {
        if (typeof expr[i] == "function" || expr[i] === "(" || expr[i] === ")") {
            exprPrepared.push(expr[i]);
            i++;
        } else {
            let strNum = "";
            while (typeof expr[i] == "number" || expr[i] === '.') {
                strNum = strNum.concat(`${expr[i]}`);
                i++;
            }
            exprPrepared.push(Number(strNum));
        }
    }
    return exprPrepared;
}

function processOperator() {
    let operator = operators.pop();
    let numB = numbers.pop();
    let numA = numbers.pop();
    numbers.push(operator(numA, numB)); 
}

function evaluate() {
    let exprPrepared = prepareEvalArray();
    operators = [];
    numbers = [];
    console.log(exprPrepared);
    for (let i = 0; i < exprPrepared.length; i++) {
        item = exprPrepared[i];
        if (typeof item == "number") {
            numbers.push(item);
        } else if (typeof item == "function") {
            if (operators.length == 0 || comparePrecedence(item, operators[operators.length - 1]) == 1) {
                operators.push(item);
            } else {
                while (operators.length > 0 && comparePrecedence(item, operators[operators.length - 1]) !== 1) {
                    processOperator();
                }
                operators.push(item);
            }
        } else if (item === '(') {
            operators.push(item);
        } else if (item === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                processOperator();
            }
            if (operators.length > 0 && operators[operators.length - 1] === '(') {
                operators.pop();
            }
        }
    }   
    while (operators.length > 0) {
        processOperator();
    }
    expr = []; //clear memory
    let retValue = numbers.pop();
    ans = retValue;
    console.log(retValue);
    return retValue; 
}

function display(output) {

}

// BIND NUMBERED BUTTONS
function bindNumbers() {
    let idx2str = {0:"zero", 1:"one", 2:"two", 3:"three", 4:"four", 5:"five", 6:"six", 7:"seven", 8:"eight", 9:"nine"};
    for (let i = 0; i < 10; i++) {
        let strid = `#${idx2str[i]}`;
        let bi = document.querySelector(strid);
        numButtons.push(bi);
        bi.addEventListener('click', ()=>expr.push(i));
    }
}

// BIND OPERATORS
function bindOperators() {
    let eval = document.querySelector('#return');
    let ansBtn = document.querySelector('#ans');
    let plus = document.querySelector('#plus');
    let minus = document.querySelector('#minus');
    let multiplyBtn = document.querySelector('#multiply');
    let divideBtn = document.querySelector('#divide');
    let leftparen = document.querySelector("#leftp");
    let rightparen = document.querySelector('#rightp');
    let decimal = document.querySelector("#decimal")

    eval.addEventListener('click', () => {
        let output = evaluate();
        display(output);
    });
    ansBtn.addEventListener('click', () => expr.push(ans));
    plus.addEventListener('click', () => expr.push(add));
    minus.addEventListener('click', () => expr.push(subtract));
    multiplyBtn.addEventListener('click', () => expr.push(multiply));
    divideBtn.addEventListener('click', () => expr.push(divide));
    leftparen.addEventListener('click', () => expr.push('('));
    rightparen.addEventListener('click', () => expr.push(')'));
    decimal.addEventListener('click', () => expr.push('.'));
}

bindNumbers();
bindOperators();