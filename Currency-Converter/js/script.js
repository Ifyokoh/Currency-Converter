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
        let query = `${from}_${to}`;
        let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`
        if (from.length>0 && to.length>0 && amount.length>0){
            fetch(url)
            .then((response) => response.json()) 
            .then(data => {
                var dbPromise = idb.open('currencies', 1, function(upgradeDb){
                    upgradeDb.createObjectStore('rates', {keyPath: 'query'})
                });
                dbPromise.then(function(db){
                    var tx = db.transaction('rates', 'readwrite');
                    var store = tx.objectStore('rates');
                    store.put({
                        query: query,
                        rates: data[query]
                    });
                    console.log(data[query])
                    return tx.complete;
                });
                console.log(data[query]); 
                let value = data[query]; 
                console.log(value);
                result.innerHTML = parseFloat(value * amount)

                }).catch((error) => {
                    var dbPromise = idb.open('currencies', 1, function(upgradeDb){
                            upgradeDb.createObjectStore('rates', {keyPath: 'query'})
                        });
                    dbPromise.then(db => {
                        let tx = db.transaction('rates');
                        let store = tx.objectStore('rates');
                        return store.getAll(query);
                    }).then(rates => {
                        if(rates.length === 0){
                            alert('Try Again');
                        }else{
                            for (rate in rates){
                                let value = rates[rate].rates; 
                                console.log(value);
                                result.innerHTML = parseFloat(value * amount)
                            }
                        }
                    })

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