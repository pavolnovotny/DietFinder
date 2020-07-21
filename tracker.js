// 
// UI CTRL
// 
const UIController=(()=>{
    const querySelectors= {
        listItem:'#item-list',
        AllListItems:'#item-list li',
        addButton: '#addItem',
        nameInput: '#addFood',
        caloriesInput: '#addCalories',
        totalCalories: '.totalCalories',
        updItem: '#updItem',
        delItem: '#delItem',
        back: '#back',
        containerButtons: '.container__buttons',
        containerBottom:'.container__bottom',
        clearAll: '.clearAll'
    }

   return{
    settleData: (data)=>{
       let  listItem=""
       data.forEach(item=>{
        listItem += `<li class="item" id="item-${item.id}" >
         <strong>${item.name}: </strong> ${item.calories} calories <a class="item__link" href="#"><i class="change-item far fa-edit"></i></a>
       </li>`  
       })

       document.querySelector(querySelectors.listItem).innerHTML= listItem
    },

    getListeners: ()=>{
        return querySelectors
    },
    getInput: ()=>{
        return {
            name: document.querySelector(querySelectors.nameInput).value,
            calories:document.querySelector(querySelectors.caloriesInput).value
        }
    },
    showList:(newItem)=>{
        // create li element
        let li= document.createElement('li')
        li.setAttribute('class', 'item')
        li.setAttribute('id', `item-${newItem.id}`)
        li.innerHTML=`<strong>${newItem.name}: </strong> ${newItem.calories} calories <a class="item__link" href="#"><i class="change-item far fa-edit"></i></a>`
        
        document.querySelector(querySelectors.listItem).appendChild(li)
    },
    clearInput: ()=>{
        document.querySelector(querySelectors.nameInput).value=""
        document.querySelector(querySelectors.caloriesInput).value=""
    },
    showTotalCal:(calories)=>{
        document.querySelector(querySelectors.totalCalories).textContent= calories
    },
    clearEditState:()=>{
        // clearInput()
        document.querySelector(querySelectors.nameInput).value=""
        document.querySelector(querySelectors.caloriesInput).value=""
        document.querySelector(querySelectors.addButton).style.visibility='visible'
        // document.querySelector(querySelectors.containerButtons).style.display='none'
        // document.querySelector(querySelectors.containerBottom).style.borderTop='none'

        // document.querySelector(querySelectors.addButton).style.marginTop ='5rem'
        document.querySelector(querySelectors.updItem).style.visibility='hidden'
        document.querySelector(querySelectors.delItem).style.visibility='hidden'
        document.querySelector(querySelectors.back).style.visibility='hidden'
        
    },
    populateForm: ()=>{
        document.querySelector(querySelectors.nameInput).value= ItemController.getCurrItem().name
        document.querySelector(querySelectors.caloriesInput).value = ItemController.getCurrItem().calories
        
        UIController.showEditItem()
    },
    showEditItem: ()=>{

        document.querySelector(querySelectors.updItem).style.visibility='visible'
        document.querySelector(querySelectors.delItem).style.visibility='visible'
        document.querySelector(querySelectors.back).style.visibility='visible'
       
        
        document.querySelector(querySelectors.addButton).style.visibility='hidden'
        
    },
    updateUIList: (updItem)=>{
        let listItems = document.querySelectorAll(querySelectors.AllListItems)
        listItems= Array.from(listItems)
        listItems.forEach(item=>{
            const itemID= item.getAttribute('id')
            if(itemID===`item-${updItem.id}`){
                document.querySelector(`#${itemID}`).innerHTML=`<strong>${updItem.name}: </strong> ${updItem.calories} calories <a class="item__link" href="#"><i class="change-item far fa-edit"></i></a>`
            }
        })
    },
    deleteItemUI:(id)=>{
         const itemID=`#item-${id}`
         const item= document.querySelector(itemID)  
         item.remove()  
    },
    clearUI:()=>{
        let items= document.querySelectorAll(querySelectors.AllListItems)

        items= Array.from(items)
        items.forEach(item=>{
            item.remove()
        })
    }
   }
})()



// 
// ITEM CTRL
// 
const ItemController=(()=>{
   
 // function contructor
 class Item {
     constructor(name, calories, id){
         this.name=name,
         this.calories=calories,
         this.id=id
     }
 }

 //  State
const state={
    items:[],
    currItem: null,
    totalCal:0
}

return{
    getData:()=>{
        return state.items
    },
    testing: ()=>{
        return state
    },
    addItem: (name, calories)=>{
        
        // creating ID 
        let ID

        if (state.items.length>0) {
            ID= state.items[state.items.length-1].id +1
        } else{
            ID=0
        }

        // change from string to number
        calories= parseInt(calories)
        // create new item
        newItem= new Item(name, calories, ID)

        state.items.push(newItem)

        return newItem
    },
    calcTotalCal: ()=>{
        let total=0
        state.items.forEach(item=>{
            total += item.calories
        })

        state.totalCal=total

        return state.totalCal
    },
    getListID:(id)=>{
        let match= null
        state.items.forEach(item=>{
            if(item.id=== id){
                match= item
            }
        })

        return match
    },
    setCurrItem: (item)=>{
        state.currItem = item
    },

    getCurrItem: ()=>{
        return state.currItem
    },
    updateItem: (name, calories)=>{
        calories= parseInt(calories)
        let match= null

        state.items.forEach(item=>{
            if(item.id=== state.currItem.id){
                item.name=name
                item.calories=calories
                match=item
            }
        })
        return match        
    },
    deleteItem:(id)=>{
        // get ids
        const ids=state.items.map(item=>{
            return item.id
        })
        // get index
        const index= ids.indexOf(id)
        // delete item
        state.items.splice(index,1)
    },
    clearState: ()=>{
       state.items=[] 
    }
}

})()

// 
// TRACKER 
// 
const Tracker=((ItemCtrl, UICtrl)=>{
    const eventListeners= ()=>{
        const selectors= UICtrl.getListeners()

        document.querySelector(selectors.addButton).addEventListener('click', addItem)

        document.querySelector(selectors.listItem).addEventListener('click', itemUpdate)

        // update button
        document.querySelector(selectors.updItem).addEventListener('click', updateBtnSubmit)

        // delete button
        document.querySelector(selectors.delItem).addEventListener('click', deleteBtnSubmit)

        // back button
        document.querySelector(selectors.back).addEventListener('click', ()=>{
          UICtrl.clearEditState()  
        })

        // clear All button
        
        document.querySelector(selectors.clearAll).addEventListener('click', clearAllSubmit)

        // disable enter
        document.addEventListener('keypress', (e)=>{
            if(e.key=== 'Enter'){
                e.preventDefault()
                return false
            }
            
        })

    }
    
    const addItem = (e)=>{
        // get input value from form
        const getFormInput = UICtrl.getInput()
        
        
       
        // check
        if(getFormInput.name ==="" && getFormInput.calories ==="" ){
            alert("Value is required")
        } else{
            // new item from constructor
            const newItem= ItemCtrl.addItem(getFormInput.name,getFormInput.calories )
            // show new item to UI
            UICtrl.showList(newItem)

            // calculate total calories
            const totalCalories= ItemCtrl.calcTotalCal()
            // show total to UI
            UICtrl.showTotalCal(totalCalories)

            // clear input
            UICtrl.clearInput()
        }

        e.preventDefault()
    }

    const itemUpdate= (e)=>{
        
        if(e.target.classList.contains('change-item')){
            const IDlist= e.target.parentElement.parentElement.id           
            // split ID
            const IDarr= IDlist.split('-')            

            const id=parseInt(IDarr[1])
            // get item
            const itemEdit= ItemCtrl.getListID(id)
            // set curr item
            ItemCtrl.setCurrItem(itemEdit)
            // add item to form
            UICtrl.populateForm()
            
            

        }
        e.preventDefault(e)
    }

    // update btn click

    const updateBtnSubmit= (e)=>{
        // get input
        const input= UICtrl.getInput()
        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateUIList(updatedItem)

        // calculate total calories
        const totalCalories= ItemCtrl.calcTotalCal()
        // show total to UI
        UICtrl.showTotalCal(totalCalories)
        UICtrl.clearEditState()


        e.preventDefault()
    }


    const deleteBtnSubmit= (e)=>{
        // get curr item
        const currentItem= ItemCtrl.getCurrItem()
        // delete from state
        ItemCtrl.deleteItem(currentItem)
        // delete from UI
        UICtrl.deleteItemUI(currentItem.id)


        // calculate total calories
        const totalCalories= ItemCtrl.calcTotalCal()
        // show total to UI
        UICtrl.showTotalCal(totalCalories)
        UICtrl.clearEditState()
        e.preventDefault()
        
    }

    const clearAllSubmit= ()=>{
        // clear state
         ItemCtrl.clearState()
        // clear UI
        UICtrl.clearUI() 

         // calculate total calories
         const totalCalories= ItemCtrl.calcTotalCal()
         // show total to UI
         UICtrl.showTotalCal(totalCalories)
    }

    return{

        
        init: ()=>{
            // clear edit state
            UIController.clearEditState()

            // get data from state
            const data= ItemCtrl.getData()
            
            // settle list items
            UICtrl.settleData(data)

            // load listeners
            eventListeners()


        }
    }
})(ItemController,UIController)

// init
Tracker.init()