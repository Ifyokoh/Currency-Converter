
function loadCurrencies(){
    const from = document.getElementById("from");
    const to = document.getElementById("to");
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
    fetch(url)
       .then((response) => response.json()) 
       .then(data => {
           let currencies = data.results;
                let output = "";
                for(currency in currencies) {
                    output += `<option>${currencies[currency].id}</option>`;
                }
                from.innerHTML = output;
                to.innerHTML = output;
       }).catch(err =>{
        console.log(JSON.stringify(err));
    });
   }

   function convertCurrency() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const amount = document.getElementById("amount").value;
    const result = document.getElementById("result");
    const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`;
    if (from.length>0 && to.length>0 && amount.length>0){
        fetch(url)
       .then((response) => response.json()) 
       .then(data => {
            for(let rate in data){
                console.log(data[rate]); 
                let value = data[rate]; 
                console.log(value);
                result.innerHTML = parseFloat(value * amount)
            }
       }).catch(err =>{
        console.log(JSON.stringify(err));
    });
    } 
}

//the service worker
if('serviceWorker' in navigator){
    navigator.serviceWorker
        .register('./sw.js')
        .then(function(){
            console.log('Service Worker Registered');
        });
}
