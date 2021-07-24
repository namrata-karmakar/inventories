class Inventory{
    constructor(name, quantity, price,id){
        this.name = name;
        this.quantity = quantity;
        this.id = id;
        this.mainPrice = price;
        this.price = calc(price, id);

        function calc(price, id){
            let converted;
            if(id === 'Whisky'){
            converted = {
                '60ml'  : 60 * price,
                '90ml'  : 90 * price,
                '120ml' : 120 * price,
                '180ml' : 180 * price,
                '360 ml': 360 * price
            }
         } else if(id === 'Beer'){
            converted = {
                '330ml'  : 330 * price,
                '650ml'  : 650 * price,
                '1000ml' : 1000 * price,
                '2000ml' : 2000 * price,
                '3000ml' : 3000 * price
            } 
        } else {
            converted = price;
        }

            return converted;
        }
    }
}

class Store{
    static getInventories(){
        let invent;      

        if(localStorage.getItem('invent') === null){
            invent = [];
        }  else {
            invent = JSON.parse(localStorage.getItem('invent'));
            // invent =[];
            // localStorage.setItem('invent', JSON.stringify(invent));
         
        }
        return invent;
    }

    static addInventories(produ){
    
        const invent = Store.getInventories();
        invent.push(produ);        
        localStorage.setItem('invent', JSON.stringify(invent));

    }

    
}
class UI{ 
    static displayInventories(value){
        const invent = Store.getInventories();
                
        const items = invent.filter( items => items.id == `${value}`);
        UI.addInvetoriesToList(items);
        
    }
    static addInvetoriesToList(items){
        const listItem = document.querySelector('.inventoryList');
        listItem.innerHTML = '';
        let no = 0;
        items.forEach( item => {
            const addItem = document.createElement('div');
            addItem.classList.add('item');
             no += 1;
            addItem.innerHTML = `
            <div class="srno">${no}</div>
            <div>${item.name}</div>
            <div>${item.quantity}</div>
            <div>${item.mainPrice}</div>
            `;
            listItem.appendChild(addItem);
            
            });
         
    }
    static addToList(item){
        const listItem = document.querySelector('.inventoryList');
        const listItem1 = Array.from(document.querySelectorAll('.srno'));
        const no = listItem1.length;
        const addItem = document.createElement('div');
            addItem.classList.add('item');
            addItem.innerHTML = `
            <div class="srno">${no + 1}</div>
            <div>${item.name}</div>
            <div>${item.quantity}</div>
            <div>${item.mainPrice}</div>
            `;
        listItem.appendChild(addItem);
    }
    static clear(){
        document.querySelector('#inventory_item').reset();
    }
    
}
document.addEventListener('domContenLoaded', UI.displayInventories('Beer'));
const inventroy_type = document.querySelector('.inventroy_type');
const beer = document.querySelector('#beer');
const whisky = document.querySelector('#whisky');
const snacks = document.querySelector('#snacks');

inventroy_type.addEventListener('click', e => {
    const addInventory = document.querySelector('.add_inventories');
    addInventory.setAttribute('id', `${e.target.value}`);
    const inventory_item = document.querySelector('#inventory_item');
    inventory_item.innerHTML = '';
    const newLabel = document.createElement('label'); 
    newLabel.innerHTML= `Name of ${e.target.value}:`;
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'text');
    newInput.setAttribute('placeholder', 'Name');
    newInput.setAttribute('id', 'name');
    const newLabel2 = document.createElement('label') ;
    newLabel2.innerHTML= 'Quantity:';
    const newInput2 = document.createElement('input');
    newInput2.setAttribute('type', 'text');
    if(e.target.value === 'Beer' || e.target.value === 'Whisky'){
    newInput2.setAttribute('placeholder', 'Quantity in ml');
    } else {
    newInput2.setAttribute('value', 'Not Required');
    newInput2.readOnly = true ;
    newInput2.disabled = true ;
    }
    newInput2.setAttribute('id', 'quantity');    
    const newLabel3 = document.createElement('label') ;
    newLabel3.innerHTML= 'Price:';
    const newInput3 = document.createElement('input');
    newInput3.setAttribute('type', 'text');
    if(e.target.value != 'Snacks'){
    newInput3.setAttribute('placeholder', 'In Rs for 1 ml');
    } else {
    newInput3.setAttribute('placeholder', 'In Rs');
    }
    newInput3.setAttribute('id', 'price');
    const newButton = document.createElement('input');
    newButton.setAttribute('type', 'submit' );
    newButton.setAttribute('value', `Add ${e.target.value}`);
    inventory_item.appendChild(newLabel);
    inventory_item.appendChild(newInput);
    inventory_item.appendChild(newLabel2);
    inventory_item.appendChild(newInput2);
    inventory_item.appendChild(newLabel3);
    inventory_item.appendChild(newInput3);  
    inventory_item.appendChild(newButton);    
});
inventroy_type.addEventListener('click', e => {
    UI.displayInventories(e.target.value);
});


document.querySelector('#inventory_item').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#name').value.toUpperCase();
    const quantity = document.querySelector('#quantity').value;
    const price = document.querySelector('#price').value;

    if(name == ''){
        alert('Provide the name');
    }
    else if(quantity == '') {
        alert('Provide the quantity');
    }
    else if(price == ''){
        alert('Provide the Price');
    } 
    else {
        if(document.querySelector('#Beer')){
            const beer = new Inventory(name, quantity,price, id = 'Beer');
            console.log(beer);
            Store.addInventories(beer);
            UI.addToList(beer);
            UI.clear();
        } else if(document.querySelector('#Whisky')){
            const whisky = new Inventory(name, quantity,price, id = 'Whisky');
            console.log(whisky);
            Store.addInventories(whisky);
            UI.addToList(whisky);
            UI.clear();
        }
        else {
                const quantity = 0;
            const snacks = new Inventory(name, quantity, price, id = 'Snacks');
            console.log(snacks);
            Store.addInventories(snacks);
            UI.addToList(snacks);
            UI.clear();
        }


    }
});

