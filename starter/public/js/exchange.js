// 获取换算按钮和其他元素
const convertButton = document.getElementById('convert');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const resultDiv = document.getElementById('result');

// 获取控制显示转换器的按钮
const showConverterButton = document.getElementById('show-converter');
const currencyConverter = document.querySelector('.currency-converter');

// 显示或隐藏货币转换器的函数
showConverterButton.addEventListener('click', function() {
    if (currencyConverter.style.display === 'none' || currencyConverter.style.display === '') {
        currencyConverter.style.display = 'block';
        showConverterButton.textContent = 'Close Currency Converter'; 
    } else {
        currencyConverter.style.display = 'none';
        showConverterButton.textContent = 'Show Currency Converter';
    }
});

// 汇率换算函数
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
        resultDiv.textContent = `${convertedAmount} ${toCurrency}`;
    } catch (error) {
        resultDiv.textContent = 'Error in conversion.';
    }
}

// 为转换按钮添加事件监听器
convertButton.addEventListener('click', () => {
    const amount = amountInput.value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    convertCurrency(amount, fromCurrency, toCurrency);
});
