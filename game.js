//IDEAS
//get players to buy rolls of the odds to write the target book
//reduce chances by letters - (monkeys/keystrokes)
'use strict'

class Upgrade{
    constructor(name, description, field, modifierSign, modifier, cost){
        this.name = name;
        this.description = description;
        this.field = field;
        this.modifierSign = modifierSign
        this.modifier = modifier;
        this.cost = cost;
    }
}

class Player{
    monkeys = 0;
    money = 0;
    wage = 0.5;
    MPS = 0
    DPS = 0
    clickModifier = 1;
    possibleKeystrokes = 88;
    lettersOfHamlet = 130000;
    constructor(){

    }
}

const player = new Player();

//incrementers
var autoClickers = [0,0,0,0,0];
var autoClickersIncreaseValue = [1,5,10,15,20];

var autoClickersBasePrice = [50,500,1000,2000,5000];
var autoClickersPrice = [50,500,1000,2000,5000];

var first_upgrade = new Upgrade("name of upgrade", "this is an upgrade", "clickModifier", "+", 2, 100);

var upgrades = [first_upgrade];

//from https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

function monkeyClick(number){
    player.monkeys += number * player.clickModifier;
};

function autoClickerBuyUpdateFields(tier, id){
    document.getElementById(id).innerHTML = ( id + " " + formatter.format(autoClickersPrice[tier] ));
    document.getElementById(id+"Count").innerHTML = (" count: " + autoClickers[tier]);
}

function autoClickerBuy(tier ,id){
    if (autoClickersPrice[tier] <= player.money){
        player.money -= autoClickersPrice[tier];
        autoClickers[tier] = autoClickers[tier] + 1;
        autoClickersPrice[tier] = Math.round(autoClickersBasePrice[tier] * 1.15**autoClickers[tier]);
        player.MPS += autoClickersIncreaseValue[tier];
    }

    autoClickerBuyUpdateFields(tier, id);
}

function buyUpgrade(upgrade){
    switch(upgrade.modifierSign){
    case "+":
        player[upgrade.field] = player[upgrade.field] + upgrade.modifier;
        break;
    case "*":
        player[upgrade.field] = Math.floor(player[upgrade.field] * upgrade.modifier);
        break;
    case "-":
        player[upgrade.field] = player[upgrade.field] - upgrade.modifier;
        break;
    case "/":
        player[upgrade.field] = Math.floor(player[upgrade.field] / upgrade.modifier);
        break;
    }
}

function monkeyIncrement(){
    for (let i = 0; i < autoClickers.length; i++){
        player.monkeys += (autoClickers[i] * autoClickersIncreaseValue[i]);
    }
}

function moneyIncrement(){
    player.money += (player.monkeys * player.wage);
}

function createUpgradeButton(upgrade){
    //create list index and button
    var li = document.createElement("li")
    var button = document.createElement('button');
    //configure button
    button.type = 'button';
    button.innerHTML = upgrade.name;
    button.title = upgrade.description;

    button.onclick = function(){
        if (player.money >= upgrade.cost){
            player.money -= upgrade.cost
            buyUpgrade(upgrade);
            container.removeChild(li);
        }
    };

    //find container of list
    var container = document.getElementById("upgradeList");
    //append button to list index and list index to list
    li.appendChild(button);   
    container.appendChild(li);
    
}

window.onload = function(){
    createUpgradeButton(first_upgrade);
}

// Game tick 
window.setInterval(function(){
    //saveGame()
    monkeyIncrement();
    moneyIncrement();
    
}, 1000);
//gui update
window.setInterval(function(){

    document.getElementById("monkeys").innerHTML = "Monkeys: " + player.monkeys;
    document.getElementById("MPS").innerHTML = "MPS: " + player.MPS;
    document.getElementById("odds").innerHTML = "Current odds of typing hamlet: " + player.possibleKeystrokes + "<sup>" + player.lettersOfHamlet +"</sup>";
    
    document.getElementById("money").innerHTML = formatter.format(player.money);  
    document.getElementById("DPS").innerHTML = "$PS: " + formatter.format(player.monkeys * player.wage);
    document.getElementById("wage").innerHTML = "wage per monkey: " + player.wage;

    document.getElementById("clickModifier").innerHTML = "click modifier: " + player.clickModifier;
},100)

























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