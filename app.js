//VARIABLES DECLERATION
const resturantSearchButton = document.querySelector('.searchButton')
const resturantSearchByKeyword = document.querySelector('#name')
const mainOutputDiv =  document.querySelector('.main_card_container .content')



//FIRSTLY GATHER THE LATITUDE AND LONGITUDE OF THE DEVICES LOCATION
 navigator.geolocation.getCurrentPosition((position) => {
        let lat =  position.coords.latitude
        let lon = position.coords.longitude

     //USING THE LAT&LON WE SEARCH RESTURANTS BY KEYWORD 

        resturantSearchButton.addEventListener('click', () => {
            mainOutputDiv.innerHTML = ''
            let resturantName = resturantSearchByKeyword.value

            //FETCH API USING KEYWORD SEARCHED
            async function getResturantByWordSearch() {
                const response = await fetch(`https://developers.zomato.com/api/v2.1/search?q=${resturantName}&count=20&lat=${lat}&lon=${lon}&radius=10000
                `,
            
                {
                 method: 'GET',
                 headers: { "user-key": "3a6c2efacf6913e8a031149664ed0e0d" }
                })

                const json = await response.json()
                const returnedResturants = json.restaurants
                console.log(returnedResturants.length)

                //IF SEARCH RETURN NO RESULT NOTIFY THE USER

                if(returnedResturants.length === 0) {
                    mainOutputDiv.innerHTML = `<h3 class="noResultMsg">No Results Found</h3>`
                }
                
                //LOOP OVER THE RETURNED ARRAY
                returnedResturants.forEach((res) => {
                    const html = 
                    `       <div class="resturant">
                            <div class="img">
                            <img src="${res.restaurant.featured_image}">
                            </div>
                            <h5>${res.restaurant.establishment[0]}</h5>
                            <h3><a target="_blank"href="${res.restaurant.events_url}">${res.restaurant.name}</a></h3>
                            <h4>${res.restaurant.user_rating.rating_text}<span class="score" style="background:#${res.restaurant.user_rating.rating_color};">${res.restaurant.user_rating.aggregate_rating}</span>  (${res.restaurant.user_rating.votes} votes)</h4>
                            <h4>${res.restaurant.location.locality}</h4>
                            <h5>${res.restaurant.location.address}</h5>
                            <div class="extra_info">
                            <p>CUISINES:<span>${res.restaurant.cuisines}</span></p>
                            <p>COST FOR TWO:<span class="cost">£${res.restaurant.average_cost_for_two}</span></p>
                            <p>HOURS:<span class="hrs">${res.restaurant.timings}</span></p>
                            </div>
                        </div>
                    `
                    mainOutputDiv.insertAdjacentHTML('beforeend', html)
                   })
            }

            getResturantByWordSearch()

        })
        
    
        //USE LAT&LON TO GET CUISINES SERVED IN THE NEARBY AREA

        async function getCuisines() {
            const response = await fetch(`https://developers.zomato.com/api/v2.1/cuisines?lat=${lat}&lon=${lon} `,
            
           {
            method: 'GET',
            headers: { "user-key": "3a6c2efacf6913e8a031149664ed0e0d" }
           })

           const json = await response.json()
           const cuisines = json.cuisines
           
       
           



           let dropdown = document.querySelector('#SelectCuisines')
           dropdown.addEventListener('change', () => {
            mainOutputDiv.innerHTML = ''
            let i = dropdown.selectedIndex
            let id = dropdown.options[i].id
            let name = dropdown.options[i].value

            //CHANGE TITLE OF PAGE TO REFLECT THE CUISINE CATEGORY

            document.querySelector('.main_card h2').innerHTML = `Nearby ${name} Resturants`
            console.log(id)


            async function getCuisinesInLocalAreaDrop() {
                const response = await fetch(`https://developers.zomato.com/api/v2.1/search?count=20&lat=${lat}&lon=${lon}&radius=10000&cuisines=${id}`,
                 
                 
                 {
                  method: 'GET',
                  headers: { "user-key": "3a6c2efacf6913e8a031149664ed0e0d" }
                 })

                 const json = await response.json()
                 const restaurant = json.restaurants


                 restaurant.forEach((res) => {
                    const html = 
                            `       <div class="resturant">
                                    <div class="img">
                                    <img src="${res.restaurant.featured_image}">
                                    </div>
                                    <h5>${res.restaurant.establishment[0]}</h5>
                                    <h3><a target="_blank"href="${res.restaurant.events_url}">${res.restaurant.name}</a></h3>
                                    <h4>${res.restaurant.user_rating.rating_text}<span class="score"style="background:#${res.restaurant.user_rating.rating_color};">${res.restaurant.user_rating.aggregate_rating}</span>  (${res.restaurant.user_rating.votes} votes)</h4>
                                    <h4>${res.restaurant.location.locality}</h4>
                                    <h5>${res.restaurant.location.address}</h5>
                                    <div class="extra_info">
                                    <p>CUISINES:<span>${res.restaurant.cuisines}</span></p>
                                    <p>COST FOR TWO:<span class="cost">£${res.restaurant.average_cost_for_two}</span></p>
                                    <p>HOURS:<span class="hrs">${res.restaurant.timings}</span></p>
                                    </div>
                                </div>
                            `
                 
                  mainOutputDiv.insertAdjacentHTML('beforeend', html)
                 })
             }
             getCuisinesInLocalAreaDrop()
            
           })
          

        
    
           //LOOP OVER THE RETURNED ARRAY WITH LOCAL CUISINES

           cuisines.forEach((cuisine) => {
             const html = 
                `<ul>
                    <li class="cuisine">${cuisine.cuisine.cuisine_name}</li>
                </ul>`

               const html2 = 
               `
               <option class="cusineOption" id="${cuisine.cuisine.cuisine_id}" value="${cuisine.cuisine.cuisine_name}">${cuisine.cuisine.cuisine_name}</option>
             `
               document.querySelector('form select').insertAdjacentHTML('beforeend', html2)
               document.querySelector('.main_card_container .filter').insertAdjacentHTML('beforeend', html)
            })

           //CREATE THE LIST ITEM OF CUISINES IN THE SIDE BAR
           let listItems = document.querySelectorAll('.cuisine')

           listItems.forEach((li, index) => {
            li.addEventListener('click', () => {
                 let typeOfCuisine = li.textContent
                 let id = cuisines[index].cuisine.cuisine_id
               
               
               mainOutputDiv.innerHTML = ''
               document.querySelector('.main_card h2').innerHTML = `Nearby ${typeOfCuisine} Resturants`

               //fetch
              
               async function getCuisinesInLocalArea() {
                  const response = await fetch(`https://developers.zomato.com/api/v2.1/search?count=20&lat=${lat}&lon=${lon}&radius=10000&cuisines=${id}`,
                   
                    {
                    method: 'GET',
                    headers: { "user-key": "3a6c2efacf6913e8a031149664ed0e0d" }
                   })

                   const json = await response.json()
                   const restaurant = json.restaurants


       //CREATE THE HTML CONTENT FROM THE DATA FETCHED FROM THE API

                   restaurant.forEach((res) => {
                    const html = 
                   `     <div class="resturant">
                             <div class="img">
                                <img src="${res.restaurant.featured_image}">
                             </div>

                            <h5>${res.restaurant.establishment[0]}</h5>
                            <h3><a target="_blank"href="${res.restaurant.events_url}">${res.restaurant.name}</a></h3>
                            <h4>${res.restaurant.user_rating.rating_text}<span class="score" style="background:#${res.restaurant.user_rating.rating_color};">${res.restaurant.user_rating.aggregate_rating}</span>  (${res.restaurant.user_rating.votes} votes)</h4>
                            <h4>${res.restaurant.location.locality}</h4>
                            <h5>${res.restaurant.location.address}</h5>
                            <div class="extra_info">
                            <p>CUISINES:<span>${res.restaurant.cuisines}</span></p>
                            <p>COST FOR TWO:<span class="cost">£${res.restaurant.average_cost_for_two}</span></p>
                            <p>HOURS:<span class="hrs">${res.restaurant.timings}</span></p>
                            </div>
                        </div>
                    `
                    mainOutputDiv.insertAdjacentHTML('beforeend', html)
                   })
               }

               getCuisinesInLocalArea()
            })
         })
          
        }

        getCuisines()



        //GET NEARBY RESTURANTS
        async function getRes() {

            const response = await fetch(` https://developers.zomato.com/api/v2.1/search?count=20&lat=${lat}&lon=${lon}&radius=10000

        `,  {
            method: 'GET',
            headers: { "user-key": "3a6c2efacf6913e8a031149664ed0e0d" }
        })
        
        const json = await response.json()
        const resturants = json.restaurants
        console.log(resturants)

        //CREATE THE HTML CONTENT FROM THE DATA FETCHED FROM THE API

        resturants.forEach((res) => {
            console.log(res.restaurant.name)  
                const html = 
               
                `
                    <div class="resturant">
                        <div class="img">
                        <img src="${res.restaurant.featured_image}">
                        </div>
                        <h5>${res.restaurant.establishment[0]}</h5>
                        <h3><a target="_blank"href="${res.restaurant.events_url}">${res.restaurant.name}</a></h3>
                        <h4>${res.restaurant.user_rating.rating_text} <span class="score"style="background:#${res.restaurant.user_rating.rating_color};"> ${res.restaurant.user_rating.aggregate_rating}</span>  (${res.restaurant.user_rating.votes} Votes)</h4>
                        <h4>${res.restaurant.location.locality}</h4>
                        <h5>${res.restaurant.location.address}</h5>
                        <div class="extra_info">
                        <p>CUISINES:<span>${res.restaurant.cuisines}</span></p>
                        <p>COST FOR TWO:<span class="cost">£${res.restaurant.average_cost_for_two}</span></p>
                        <p>HOURS:<span class="hrs">${res.restaurant.timings}</span></p>
                        </div>
                    </div>

                  
                `
               

                mainOutputDiv.insertAdjacentHTML('beforeend', html)
        })

            
        }
        
        
    getRes()

    //CLICK MOST POPULAR LINK TO GET THE MOST POPULAR RESTURANTS LOCALLY

    let mostPopular = document.querySelector('.mostPopular')
        mostPopular.addEventListener('click', () => {
        mainOutputDiv.innerHTML = ''
        document.querySelector('.main_card h2').innerHTML = 'Nearby Popular Resturants'

        getRes()
    })
      
     })

 
    


     
