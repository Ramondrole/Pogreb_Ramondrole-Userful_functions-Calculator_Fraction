const fractionTranslations = {
    ru: {
        title: "Калькулятор дробей",
        subtitle: "от Ramondrole",
        calculateBtn: "ВЫЧИСЛИТЬ",
        numeratorPlaceholder: "Числитель",
        denominatorPlaceholder: "Знаменатель",
        resultPlaceholder: "Результат появится здесь...",
        errorZeroDenominator: "Знаменатель не может быть нулем!",
        errorDivisionByZero: "Деление на ноль!",
        about: "Обо мне",
        games: "Наши игры",
        functions: "Полезные функции"
    },
    en: {
        title: "Fraction Calculator",
        subtitle: "by Ramondrole",
        calculateBtn: "CALCULATE",
        numeratorPlaceholder: "Numerator",
        denominatorPlaceholder: "Denominator",
        resultPlaceholder: "Result will appear here...",
        errorZeroDenominator: "Denominator cannot be zero!",
        errorDivisionByZero: "Division by zero!",
        about: "About me",
        games: "Our games",
        functions: "Useful functions"
    },
    de: {
        title: "Bruchrechner",
        subtitle: "von Ramondrole",
        calculateBtn: "BERECHNEN",
        numeratorPlaceholder: "Zähler",
        denominatorPlaceholder: "Nenner",
        resultPlaceholder: "Ergebnis erscheint hier...",
        errorZeroDenominator: "Nenner darf nicht null sein!",
        errorDivisionByZero: "Division durch null!",
        about: "Über mich",
        games: "Unsere Spiele",
        functions: "Nützliche Funktionen"
    }
};

let currentLang = localStorage.getItem('fraction_language') || 'ru';

function t(key) {
    return fractionTranslations[currentLang]?.[key] || fractionTranslations.ru[key];
}

function updateFractionUILanguage() {
    const elements = ['title', 'subtitle', 'calculateBtn'];
    elements.forEach(key => {
        const el = document.querySelector(`[data-key="${key}"]`);
        if (el) el.textContent = t(key);
    });
    
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const den1Input = document.getElementById('den1');
    const den2Input = document.getElementById('den2');
    
    if (num1Input) num1Input.placeholder = t('numeratorPlaceholder');
    if (num2Input) num2Input.placeholder = t('numeratorPlaceholder');
    if (den1Input) den1Input.placeholder = t('denominatorPlaceholder');
    if (den2Input) den2Input.placeholder = t('denominatorPlaceholder');
    
    const resultDiv = document.getElementById('result');
    if (resultDiv && !resultDiv.innerHTML.includes('fraction')) {
        resultDiv.innerHTML = t('resultPlaceholder');
    }
    
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const flags = { ru: '🌐 RU', en: '🌐 EN', de: '🌐 DE' };
        langBtn.innerHTML = flags[currentLang];
    }
    
    document.querySelectorAll('.nav-links a').forEach((link, idx) => {
        const keys = ['about', 'games', 'functions'];
        if (idx < keys.length) link.textContent = t(keys[idx]);
    });
}

const operatorBtns = document.querySelectorAll('.operator-btn');
const calculateBtn = document.querySelector('.calculate-btn');
const resultDiv = document.getElementById('result');
let currentOperator = '+';

operatorBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        operatorBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentOperator = this.dataset.op;
    });
});

if (operatorBtns.length > 0) {
    operatorBtns[0].classList.add('active');
}

function simplifyFraction(numerator, denominator) {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
    let num = numerator / divisor;
    let den = denominator / divisor;
    if (den < 0) {
        num = -num;
        den = -den;
    }
    return { num, den };
}

function displayResult(numerator, denominator) {
    resultDiv.innerHTML = '';
    if (denominator === 1) {
        resultDiv.innerHTML = `
            <div style="font-size: 28px; color: #ffffff; font-weight: bold; font-family: 'Impact','Arial Black',sans-serif;">
                ${numerator}
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 24px; color: #ffffff; font-weight: bold; font-family: 'Impact','Arial Black',sans-serif;">${numerator}</div>
                <div class="fraction-line" style="margin: 8px auto; width: 60px; height: 2px; background: #b31b1b;"></div>
                <div style="font-size: 24px; color: #ffffff; font-weight: bold; font-family: 'Impact','Arial Black',sans-serif;">${denominator}</div>
            </div>
        `;
    }
}

function showError(message) {
    resultDiv.innerHTML = `<div class="error" style="color: #ff4444;">${message}</div>`;
}

calculateBtn.addEventListener('click', function() {
    const num1 = parseInt(document.getElementById('num1').value) || 0;
    const den1 = parseInt(document.getElementById('den1').value) || 1;
    const num2 = parseInt(document.getElementById('num2').value) || 0;
    const den2 = parseInt(document.getElementById('den2').value) || 1;
    
    if (den1 === 0 || den2 === 0) {
        showError(t('errorZeroDenominator'));
        return;
    }
    
    let resultNum, resultDen;
    
    try {
        switch(currentOperator) {
            case '+':
                resultNum = num1 * den2 + num2 * den1;
                resultDen = den1 * den2;
                break;
            case '-':
                resultNum = num1 * den2 - num2 * den1;
                resultDen = den1 * den2;
                break;
            case '*':
                resultNum = num1 * num2;
                resultDen = den1 * den2;
                break;
            case '/':
                if (num2 === 0) throw new Error(t('errorDivisionByZero'));
                resultNum = num1 * den2;
                resultDen = den1 * num2;
                break;
        }
        
        const simplified = simplifyFraction(resultNum, resultDen);
        displayResult(simplified.num, simplified.den);
    } catch (error) {
        showError(error.message);
    }
});

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('fraction_language', lang);
    updateFractionUILanguage();
}

document.querySelectorAll('.lang-dropdown a').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = item.getAttribute('data-lang');
        if (lang) changeLanguage(lang);
    });
});

updateFractionUILanguage();