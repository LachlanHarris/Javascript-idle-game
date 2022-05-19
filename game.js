'use strict'

//info
var monkeys = 0;
var money = 0;
var wage = 0.5;
var MPS = 0
var DPS = 0
var clickModifier = 1;
var possibleKeystrokes = 88;
var lettersOfHamlet = 130000;

//incrementers
var autoClickers = [0,0,0,0,0]
var autoClickersIncreaseValue = [1,5,10,15,20]

var autoClickersBasePrice = [50,500,1000,2000,5000]
var autoClickersPrice = [50,500,1000,2000,5000]


// SAVE WORKS EXCEPT FOR
// - AUTO CLICKERS DO NOT LOAD?
// - AUTO CLICKERS BUTTON AND COUNTS DONT UPDATE BECAUSE THEY ARE ONLY CALLED WHEN CLICKEd

// function saveGame(){
//     var save = {
//         monkeys: monkeys,
//         money: money,
//         wage: wage,
//         MPS: MPS,
//         DPS: DPS,
//         clickModifier: clickModifier, 
//         possibleKeystrokes: possibleKeystrokes,
//         autoClicker: autoClickers,
//         autoClickersIncreaseValue: autoClickersIncreaseValue,
//         autoClickersPrice: autoClickersPrice,
//         autoClickersBasePrice: autoClickersBasePrice
//     }

//     localStorage.setItem("save",JSON.stringify(save)); 
// }

// window.onload = function loadGame(){
//     var savegame = JSON.parse(localStorage.getItem("save")); 
//     for(const element in savegame){
//         if (typeof savegame[element] !== "undefined") window[element] = savegame[element]
//     }
// }

//from https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

function monkeyClick(number){
    monkeys += number*clickModifier;
    document.getElementById("monkeys").innerHTML = "Monkeys: " + monkeys;
};

function autoClickerBuyUpdateFields(tier, id){
    document.getElementById("money").innerHTML = formatter.format(money);
    document.getElementById("MPS").innerHTML = "MPS: " + MPS
    document.getElementById(id).innerHTML = ( id + " $" + autoClickersPrice[tier] );
    document.getElementById(id+"Count").innerHTML = (" count: " + autoClickers[tier]);
}

function autoClickerBuy(tier ,id){
    if (autoClickersPrice[tier] < money){
        money -= autoClickersPrice[tier]
        autoClickers[tier] = autoClickers[tier] + 1
        autoClickersPrice[tier] = Math.round(autoClickersBasePrice[tier] * 1.15**autoClickers[tier])
        MPS += autoClickersIncreaseValue[tier]
    }

    autoClickerBuyUpdateFields(tier, id)
}

function buyUpgrade(){
    
}

function monkeyIncrement(){
    for (let i = 0; i < autoClickers.length; i++){
        monkeys += (autoClickers[i] * autoClickersIncreaseValue[i])
    }
}

function moneyIncrement(){
    money += (monkeys * wage)
}

// Game tick 
window.setInterval(function(){
    //saveGame()
    
    monkeyIncrement()
    moneyIncrement()

    document.getElementById("monkeys").innerHTML = "Monkeys: " + monkeys;
    document.getElementById("MPS").innerHTML = "MPS: " + MPS
    
    document.getElementById("money").innerHTML = formatter.format(money);  
    document.getElementById("DPS").innerHTML = "$PS: " + monkeys*wage
    document.getElementById("wage").innerHTML = "wage per monkey: " + wage
}, 1000);