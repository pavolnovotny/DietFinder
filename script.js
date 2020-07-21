const lookFor = document.querySelector('#lookFor')
const submitForm= document.querySelector('.inputData')
const food = document.querySelector('#food')
const outputData = document.querySelector('#outputData')
const singleDish = document.querySelector('.dish')

// listeners
submitForm.addEventListener('submit', submitFun)


// fetch API

function submitFun(e){
    e.preventDefault()

    // clear single meal
    singleDish.innerHTML=""
    categoryDiv.innerHTML=""

    // input value

    let inputVal= lookFor.value
    
    if(inputVal===""){
        alert('Value is required') 
        
    } else{
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputVal}`)
        .then(res=> res.json())
        .then(data=> {
        outputData.innerHTML=`<h3>Results for '${inputVal}</h3>':`

        if(data.meals===null){
            outputData.innerHTML=`Oops something went wrong. Try again !`
        }  else{
            outputData.innerHTML= data.meals.map(item=>`
            <div class="menu"><img class="menu__pic" src="${item.strMealThumb}" alt="${item.strMeal}" />
            <div class="menu__name" data-dishID=${item.idMeal}>
            <h3>${item.strMeal}</h3></div>
            </div>`).join('')

           
        }  


        })
        
    }
    lookFor.value="" 
}

// event listener for getting id and name
outputData.addEventListener('click', e=>{
    const details=e.path.find(item=>{
     if(item.classList){
         return item.classList.contains('menu__name')
     } else{
         return false
     }
    })
    if(details){
        const dishID= details.getAttribute('data-dishid')
        getDish(dishID)
    }
})

// fetch single dish

function getDish( dishID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dishID}`)
    .then(res => res.json())
    .then(data => {
      const dish = data.meals[0] 
        console.log(dish)
      addMealDOM(dish)
    }) 
}

// add to DOM

function addMealDOM(food){
    const ing =[]
    for(let i = 1; i<=20; i++){
        if(food[`strIngredient${i}`]){
            ing.push(`${food[`strIngredient${i}`]} - ${food[`strMeasure${i}`]}`)
        } else{
            break
        }
    }
    console.log(food)
    singleDish.innerHTML=`
      
    <div class="recipe">
    <div class="recipe__top">    
    <img class="recipe__top--pic" src="${food.strMealThumb}" alt="${food.strMeal}"/>
    
         
    <div class="recipe__top--right"> 

    <h2 class="recipe__top--heading">${food.strMeal}</h2>  
    <h3 class="recipe__top--origin"> Origin : ${food.strArea}</h3>            
    <h3 class="recipe__top--category">Category : ${food.strCategory}</h3> 
    <h3 class="recipe__top--tags"> Tags : ${food.strTags}</h3>

    </div>
    </div>

    <div class="recipe__middle"> 
        <ul class="recipe__middle--list">
    ${ing.map(item=> `<li class="recipe__middle--item">${item}</li>`).join('')}
        </ul>
    </div>
    
    <div class="recipe__bottom"> 
    ${food.strInstructions}
    </div>
    
    </div>
             
    `
 }



    const catBtn= document.querySelector('.category')
    const categoryDiv= document.querySelector('.categoryDiv')
    const categoryDetails= document.querySelector('.categoryDetails')

    

    catBtn.addEventListener('click', (e)=>{
    outputData.innerHTML=''
    singleDish.innerHTML=""
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(res=> res.json())
    .then(data => {
        
        
        categoryDiv.innerHTML= data.categories.map(item=>
                
            
            {
                return `<div class="categ"><img class="categ__pic" src="${item.strCategoryThumb}" alt="${item.strCategory}" />
            <div class="categ__name" >
            <h3>${item.strCategory}</h3></div>
            <div><p class="categ__desc"> ${item.strCategoryDescription}</p></div>
            </div>
            `
            }
            ).join('')
                  
                                    
         })     
                           
                           
        categoryDiv.classList.toggle('active')
         
         console.log(categoryDiv)

        })
         
         
 



    