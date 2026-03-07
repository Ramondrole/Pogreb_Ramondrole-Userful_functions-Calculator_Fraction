document.addEventListener('DOMContentLoaded', function() {
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


    operatorBtns[0].classList.add('active');


    calculateBtn.addEventListener('click', function() {
        const num1 = parseInt(document.getElementById('num1').value) || 0;
        const den1 = parseInt(document.getElementById('den1').value) || 1;
        const num2 = parseInt(document.getElementById('num2').value) || 0;
        const den2 = parseInt(document.getElementById('den2').value) || 1;
        if (den1 === 0 || den2 === 0) {
            showError('Знаменатель не может быть нулем!');
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
                    if (num2 === 0) throw new Error('Деление на ноль!');
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
            <div style="font-size: 24px; color: #00ffff; text-shadow: 0 0 10px #00ffff;">
            ${numerator}
            </div>
            `;
        } else {
            resultDiv.innerHTML = `
            <div style="text-align: center;">
            <div style="font-size: 20px; color: #00ffff;">${numerator}</div>
            <div class="fraction-line" style="margin: 5px auto; width: 50px;"></div>
            <div style="font-size: 20px; color: #00ffff;">${denominator}</div>
            </div>
            `;
        }
    }
    function showError(message) {
        resultDiv.innerHTML = `<div class="error">${message}</div>`;
    }
});