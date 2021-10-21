let task={};
var active=false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0; 


document.addEventListener("DOMContentLoaded",
                           function(){
                                                    
                            	    task.message=document.querySelector(".message");
                            		task.input=document.querySelector("input");
                                    task.category=document.querySelector("#cat");
                                    task.othcategory=document.querySelector("#othcat");
                            		task.addtaskbtn=document.querySelector(".addtask");
                                    task.delbtn=document.querySelector(".del");                                
                            		task.addtaskbtn.addEventListener("click",taskadd);
									task.delbtn.addEventListener("click",delinput);	
                                    init();
                                    renderTaskBoard();
                                                    
                                    /*Make divs draggable*/
                                    container = document.querySelector(".taskboard");
                                    container.addEventListener("touchstart", dragStart, false);
                                    container.addEventListener("mousedown", dragStart, false);                                               

                                    }
                            );

                            
function init(){
 	message("Enter Task description and Category", "white");   
 }

function clearTaskBoard(){
	
    var elements= document.getElementsByClassName('catcard');
  
    while(elements.length >0){
        elements[0].parentNode.removeChild(elements[0]);
    }
 
}


function renderTaskBoard(){
	  
  clearTaskBoard();
	
  for(var i=0; i < localStorage.length;i++){        //Read every category from localStorage
    
  	let boardCat= localStorage.key(i).trim();
    if (!(boardCat.startsWith("pos-"))){            //only get task related data
        let taskArray1=  JSON.parse(localStorage.getItem(boardCat));
        
        var catCard= document.createElement('div');  
        catCard.contentEditable="true";
        catCard.classList.add("catcard");
        catCard.innerHTML= `<div class="header"><h3> ${boardCat} </h3><button class="delcat" onClick="delcat()" > </button></div><ul></ul>`;
        
        
        for(var j=0; j < taskArray1.length; j++ ){    
            catCard.querySelector('ul').innerHTML+= `<li><input type="checkbox" name="check" id="check"></input><span>${taskArray1[j]} </span><button id="btn" class="delitem" onClick="delitem()" > </button></li>`;     

        }
        
        catCard.style.backgroundColor=getCatColor(boardCat)||"orange";   
        document.querySelector('.taskboard').appendChild(catCard); 
        let catPosArray= JSON.parse(localStorage.getItem("pos- "+boardCat+" "));    //get last saved position of category card
        if(catPosArray){
            setTranslate(catPosArray[0], catPosArray[1], catCard);
        }  
    }   
  }
 	
}


function dragStart(e) {

   
    
    /* If mousedown is on a category card, save it as dragItem. 
    If it is on one of child elements of category card, keep searching parent till category card is found*/
    
    
    dragItem = e.target;
    if(!e.target.classList.contains("catcard")){       
    
        if(e.target.tagName != "BODY" &&  e.target.tagName != "SECTION"){
        
            dragItem=e.target;
            while (!(dragItem.classList.contains("catcard"))){
                dragItem = dragItem.parentNode;
            }
        }
        
    }

    
    if(dragItem.classList.contains("catcard")){

        container.addEventListener("touchmove", drag, false);
        container.addEventListener("mousemove", drag, false);
        window.addEventListener("mouseup", dragEnd, false);
        window.addEventListener("touchend", dragEnd, false);
    
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        active=true;
    }
   
  }

function drag(e) {

    
   
    e.preventDefault();
      
    if(active){
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;
      
      
      setTranslate(currentX, currentY, dragItem);
      let dragItemCat= "pos-" + dragItem.querySelector('h3').textContent;
      let dragItemPosArray= [currentX,currentY];
      localStorage.setItem(dragItemCat,JSON.stringify(dragItemPosArray));  //Save the last position of category card to localStorage
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
    
function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    active=false; 
    
    container.removeEventListener("touchmove", drag, false);
    container.removeEventListener("mousemove", drag, false);
    window.removeEventListener("mouseup", dragEnd, false);
    window.removeEventListener("touchend", dragEnd, false);
}

 

function delinput(){
    task.input.value=" ";
   	task.category.value=" ";  
    task.othcategory.value=" ";
}

/*Add a new task*/
function taskadd(){

    console.log('Adding task');
	
    let tempTask= task.input.value.trim();
    let tempCat= task.category.value.trim();
    let tempothCat= task.othcategory.value.trim();
    
    task.input.style.backgroundColor="cyan";            /*Initialize bg color to cyan just in case if it became red due to an error earlier*/
    task.category.style.backgroundColor="cyan";
    task.othcategory.style.backgroundColor ="white";


    if (tempothCat && (tempCat !== "Other") ){                                    /*Other category desc should be given only when category chosen as Other*/
            message('The category should be Other to enter Other Category Description', 'red');
            task.category.style.backgroundColor = "red";    
            task.othcategory.style.backgroundColor ="red"; 
    }
   
    else{
        /*Check if task description or category empty and throw an error*/
        if(tempTask.length == 0){
            message('Please enter Task description', 'red');
            task.input.style.backgroundColor="red";    
        }
        else if(tempCat == "Default" || tempCat.length == 0 ){
            message('Please enter Task category','red');
            task.category.style.backgroundColor="red";
        }

        else{

            if (tempothCat){
                tempCat = tempothCat;
            }
            var index;
            
            /*Check if any task has been added alreday for this category. else start index=0*/
            
            
            let taskArray=JSON.parse(localStorage.getItem(tempCat));
            
            if(taskArray){
                index = taskArray.length ;
                taskArray[index]=tempTask;
                localStorage.setItem(tempCat, JSON.stringify(taskArray)); /*Update array for the category and store to localStorage*/
        
            }
            else{
                index=0;
                taskArray=[];
                taskArray[index]=tempTask;
                localStorage.setItem(tempCat, JSON.stringify(taskArray)); /* Save array for category for first time*/
                
            }
            
            delinput(); /*Initialize task desc and category in input fields after adding the task*/
            renderTaskBoard(); /*Render Task board*/
            message("Task added to board!! Add another task", "green");
            
        }
    }
  	
}
    

function delitem() {
	
  window.event.target.classList.add('active');
  let headerdiv= document.querySelector(".active").parentNode.parentNode.parentNode;
  let catdel= headerdiv.querySelector("h3").textContent.trim();
  let taskd= document.querySelector(".active"). parentNode.querySelector("span").textContent.trim();
  
  let array=JSON.parse(localStorage.getItem(catdel));
  
  for(let i=0;i<array.length;i++){
  	if (array[i].trim()==taskd){
    	array.splice(i,1);
    }
  }
  
  localStorage.setItem(catdel, JSON.stringify(array));   //Update category array in localStorage after removing task*/
  renderTaskBoard();
      
}

function delcat() {
	
  window.event.target.classList.add('activecat');
  let headerdiv= document.querySelector(".activecat").parentNode;
  let catdel= headerdiv.querySelector("h3").textContent.trim();
  localStorage.removeItem(catdel);
  localStorage.removeItem("pos- "+catdel+" ");          //Remove entry of category (taskdetails as well as position) from LocalStorage when category card deleted
  renderTaskBoard();  
  
}


function getCatColor(cat){

	switch(cat){
  	case "Work":
    	return "#5DADE2";
    case "School":
    	return "#F7DC6F";
    case "Learning":
    	return "#E8DAEF";
    case "Health":
    	return "#2ECC71";
    case "Home":
    	return "#E59866"; 
  
  }
    
}

function message(mess,clr){
	
	task.message.innerText = mess;
    task.message.style.color= clr||"black";


}