//IDEAS
//get players to buy rolls of the odds to write the target book
//reduce chances by letters - (monkeys/keystrokes) --> this doesnt make sense btw
'use strict'

//this is a disgusting class but im not sure how else to implement this without reading from a file?
class Upgrade{
    constructor(name, description, field, modifierSign, modifier, cost, unlockField, unlockThreshold, unlocked ){
        this.name = name;
        this.description = description;
        this.field = field;

        this.modifierSign = modifierSign
        this.modifier = modifier;
        this.cost = cost;

        this.unlockField = unlockField;
        this.unlockThreshold = unlockThreshold;
        this.unlocked = unlocked;

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

class Incrementer{
    constructor(name, description, count, increaseValue, basePrice, currentPrice, unlockThreshold, unlocked){
        this.name = name;
        this.description = description;
        this.count = count;
        this.increaseValue = increaseValue;
        this.basePrice = basePrice;
        this.currentPrice = currentPrice;

        this.unlockThreshold = unlockThreshold;
        this.unlocked = unlocked;
    }
}

const player = new Player();

var firstIncrementer = new Incrementer("1", "description", 0, 1, 500, 500, 25, false);
var secondIncrementer = new Incrementer("2", "description", 0, 5, 2000, 2000, 200, false);
var thirdIncrementer = new Incrementer("3", "description", 0, 10, 5000, 5000, 500, false);
var fourthIncrementer = new Incrementer("4", "description", 0, 15, 10000, 10000, 1000, false);
var fifthIncrementer = new Incrementer("5", "description", 0, 20, 20000, 20000, 2000, false);
var incrementers = [firstIncrementer,secondIncrementer,thirdIncrementer,fourthIncrementer,fifthIncrementer];

var firstUpgrade = new Upgrade("name of upgrade", "this is an upgrade", "clickModifier", "+", 2, 100, "monkeys", 50, false);

var upgrades = [firstUpgrade];

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

function monkeyIncrement(){
    for (let i = 0; i < incrementers.length; i++){
        player.monkeys += (incrementers[i].count * incrementers[i].increaseValue);
    }
}

function moneyIncrement(){
    player.money += (player.monkeys * player.wage);
}

//incrementer functions
function updateIncrementerButton(incrementer){
    var id = incrementer.name;
    document.getElementById(id).innerHTML = ( id + " " + formatter.format(incrementer.currentPrice ));
    document.getElementById(id + "Count").innerHTML = (" count: " + incrementer.count);

}

function checkUnlockIncrementers(incrementers){
    for (let x in incrementers){
        var incrementer = incrementers[x]

        if (incrementer.unlocked == false){
            if (player.monkeys >=  incrementer.unlockThreshold){
                createIncrementerButton(incrementer);                
                incrementers[x].unlocked = true;
            }
        }
    }
}

function createIncrementerButton(incrementer){
    var li = document.createElement("li")
    var button = document.createElement('button');
    var span = document.createElement("span")
    //configure button
    button.id = incrementer.name;
    button.type = 'button';
    button.innerHTML = incrementer.name + " $" + incrementer.currentPrice;
    button.title = incrementer.description;

    button.onclick = function(){
        if (player.money >= incrementer.currentPrice){
            player.money -= incrementer.currentPrice;
            incrementer.currentPrice = Math.round(incrementer.currentPrice*1.15);
            incrementer.count += 1;
            player.MPS += incrementer.increaseValue;
            updateIncrementerButton(incrementer);
        }
    };

    span.id = incrementer.name + "Count"
    span.innerHTML = " count: " + incrementer.count;
    //find container of list
    var container = document.getElementById("incrementersList");
    //append button to list index and list index to list
    li.appendChild(button);   
    li.appendChild(span);
    container.appendChild(li);
}

//upgrade functions
function checkUnlockUpgrades(upgrades){
    for (let x in upgrades){
        var upgrade = upgrades[x]

        if (upgrade.unlocked == false){
            if (player[upgrade.unlockField] >=  upgrade.unlockThreshold){
                createUpgradeButton(upgrade);                
                upgrades[x].unlocked = true;
            }
        }
    }
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

function createUpgradeButton(upgrade){
    //create list index and button
    var li = document.createElement("li")
    var button = document.createElement('button');
    //configure button
    button.type = 'button';
    button.innerHTML = upgrade.name + " $" + upgrade.cost;
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
}

// Game tick 
window.setInterval(function(){
    //saveGame()
    monkeyIncrement();
    moneyIncrement();
    checkUnlockUpgrades(upgrades);
    checkUnlockIncrementers(incrementers)
    
}, 1000);

//gui update
window.setInterval(function(){

    document.getElementById("monkeys").innerHTML = "Monkeys: " + player.monkeys;
    document.getElementById("MPS").innerHTML = "MPS: " + player.MPS;
    document.getElementById("odds").innerHTML = "Base odds of typing hamlet: " + player.possibleKeystrokes + "<sup>" + player.lettersOfHamlet +"</sup>";
    //this doesnt actually work out mathematically i was just having a senior moments
    document.getElementById("currentOdds").innerHTML = "Current odds of typing hamlet: " + player.possibleKeystrokes + "<sup>" + (player.lettersOfHamlet - Math.floor(player.monkeys/player.possibleKeystrokes)) +"</sup>";
    
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