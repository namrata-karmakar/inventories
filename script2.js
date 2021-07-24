class FinalBill {
    constructor(name, date, bill, inrbill, currency, foreignbill){
        this.name = name;
        this.date = date;
        this.billdetails = bill;
        this.inrbill = inrbill;
        this.currency = currency;
        this.foreignbill = foreignbill;
    }
}
class Items{
    constructor (item, name, unit, quantity, quant){
        this.item = item;
        this.name = name;
        // if(item != 'Snacks'){
        this.unit = unit;
        // } else{
        //     this.unit = 'Full';
        // }
        this.quantity = quantity;
        this.gst = '18%';
        this.price = calcPrice (item, name,unit);

        function calcPrice(item, name, unit){
            let val;
            const data = Store.getInventories();
            const value =  data.filter(e => (e.id === item && e.name === name));
            if(item != 'Snacks'){
             val = value[0].price[unit];     
             return val;
            } else {
                val = value[0].mainPrice;
                return val;
            }

        }
        this.total = (quantity * this.price) + (quantity * this.price * 0.18);
    }
}
class Store{
    static getInventories(){
        let invent;      

        if(localStorage.getItem('invent') === null){
            invent = [];
        }  else {
            invent = JSON.parse(localStorage.getItem('invent'));           
         
        }
        return invent;
    }
    static getbills(){
        let orders;   
        if(localStorage.getItem('orders') === null){
            orders = [];
        }  else {
            orders = JSON.parse(localStorage.getItem('orders'));
            orders =[];
            localStorage.setItem('orders', JSON.stringify(orders));
        }
        return orders;
    }
    static addbills(finalorder){
        const orders = Store.getbills();
        orders.push(finalorder);
        localStorage.setItem('orders', JSON.stringify(orders) );

    }

}
class Display{
    static displayItems(order){
        const listItem = document.querySelector('.items_details');
        listItem.innerHTML = '';
        let no = 0;
        order.forEach( item => {
            const addItem = document.createElement('div');
             no += 1;
            addItem.innerHTML = `
            <div>${no}</div>
            <div>${item.item}</div>
            <div>${item.name}</div>
            <div>${item.unit}</div>
            <div>${item.price}</div>
            <div>${item.quantity}</div>
            <div>${item.gst}</div>
            <div>${item.total}</div>
           `;
            listItem.appendChild(addItem);
        });

    }
    static clear(){
    document.querySelector('#details').reset();
    }
}


const bill = [];
let orderParticular = [];

document.querySelector('#date').innerHTML = new Date().toDateString();
const item = document.querySelector('#invent');
const invent = Store.getInventories();
const itemName = document.querySelector('#invent_name');
const form = document.querySelector('#details');
const item_quantity = document.querySelector('#quantity');
const quantity = document.createElement('select');
quantity.setAttribute('id', 'quant');
const unique = invent.map(e => e.id)
                     .map((e, i, final) => final.indexOf(e) === i && i)
                     .filter(e => invent[e])
                     .map(e => invent[e]);   
unique.forEach(e => {
        const listItem = document.createElement('option');
        listItem.text = `${e.id}`;
        item.add(listItem);
});


item.addEventListener('change', el => {
    itemName.innerHTML = '';
    invent.forEach(e =>{
        if(e.id === el.target.value){
            const listItem = document.createElement('option');
            listItem.text = `${e.name}`;
            itemName.add(listItem);
        }
       });
       
        quantity.innerHTML='';
         unique.forEach(e => {
        if(e.id === el.target.value){          
            if(e.id == 'Snacks'){
                quantity.remove();
            } else{
            form.insertBefore(quantity, item_quantity);       
            for(key of Object.keys(e.price)){

                const listItem = document.createElement('option');
                listItem.text = `${key}`;
                quantity.add(listItem);
            }
            }
        }
    });
});
const inventory = Store.getInventories();
let stockValidated = false;

form.addEventListener('submit', e => {
    e.preventDefault();
    const invent = document.querySelector('#invent').value;
    const invent_name = document.querySelector('#invent_name').value;
    let quant;
    if(invent != 'Snacks'){
    quant = document.querySelector('#quant').value;
    }
    const quantity = document.querySelector('#quantity').value;

    let valid = [quant + quantity].map(unit => {const part = unit.split('ml') 
                                        .map(part => parseFloat(part))
                                        return part[0] * part[1]; 
                                    });
    console.log (valid);
    console.log(stockValidated);
    
    if(valid[0] >= 0 && invent != 'Snacks'){
        for(let e of inventory) {
            if (invent_name == e.name){
                if(valid[0] >= e.quantity){
                //  alert (`Not Enough ${invent_name}`);
                stockValidated = true;
                    break;
                 }  else {
                    for(let e of inventory){
                        if(invent_name == e.name){
                            e.quantity = e.quantity - valid[0];
                            break;
                        }
                    }
                 }     

            }            
        }
    }
    
    // console.log(inventory);
    //  console.log(stockValidated);
    
    if(invent == 'Select'){
        alert ('Please select Item');
    } else if(quantity == '' || quantity == 0){
        alert ('Provide quantity');
    } else if(stockValidated == true){
        alert (`Not Enough ${invent_name}`);
        stockValidated = false;
    }
     else{
        if(invent == 'Snacks'){
            let quant = 'Full';
            const order = new Items(invent, invent_name, quant, quantity);
            bill.push(order);
            Display.displayItems(bill);
            total(bill);
            Display.clear();
        } else{
            const order = new Items(invent, invent_name, quant, quantity);
            bill.push(order);
            Display.displayItems(bill);
            total(bill);
            Display.clear();
        }

    }
    
});
function total(bill){
const totalBill = document.querySelector('#total_amount');
const amount = bill.reduce((tot=0, e) => tot += e.total, 0 );
totalBill.innerHTML = amount ;

}

function convertCurrency(amount) {
    let converted;
     converted = {
      INR: amount * 1,
      USD: amount * 0.013,
      GPB: amount * 0.009,
      AUD: amount * 0.017,
      CAD: amount * 0.016,
      EUR: amount * 0.011,
    }
     
    return converted;
  }

const currency = document.querySelector('#currency');
currency.addEventListener('change', e => {
    const value = e.target.value;
    const billAmount = document.querySelector('#total_amount').innerHTML;
    const { ...currencymain } = convertCurrency(billAmount);
    document.querySelector('#curr').innerHTML = `${value}`;
    document.querySelector('#finalbill').innerHTML = `${currencymain[value].toFixed(2)}`;

});

function updateInventory(bill){
   const unit = bill.map(e => e.unit + e.quantity )                      
                                .map(unit => {const part = unit.split('ml') 
                                .map(part => parseFloat(part)); 
                                return part[0] * part[1]; 
                                }) ;
        let i = 0;
        bill.forEach( sub => {
            invent.forEach(main => {    
           if(sub.name == main.name){
               main.quantity = main.quantity - `${unit[i]}`;
               i++;     
            }        
        });        
    });   

    console.log(invent); 
    localStorage.setItem('invent', JSON.stringify(invent));


}

document.querySelector('#main_submit').addEventListener('click', e=> {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const date = document.querySelector('#date').innerText;
    const inrbill = document.querySelector('#total_amount').innerText;
    const currency = document.querySelector('#currency').value;
    const foreignbill = document.querySelector('#finalbill').innerText; 
    if(name == ''){
        alert ('Please provide name');
    } else if(currency == 'Select'){
        alert('Please Select currency');
    } 
    else {
    const finalbill = new FinalBill (name, date, bill, inrbill, currency, foreignbill);
    console.log(finalbill);
    updateInventory(bill);
    Store.addbills(finalbill);    
    location.reload();
    }
});

  
 
