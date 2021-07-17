var urlList =[
      "s1",
      "s2",
      "s3",
      "s4",
      "s5",
      "s6",
      "s7",
      "s8",
      "s9",
      "s10",
      "s11",
      "s12",
      "s13",
      "s14",
      "s15",
      "s16",
      "s17",
      "s18",
      "s19"
];
const mainDiv = $('.main');
const mainItems = document.querySelector(".main").children;
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const page = document.querySelector(".page-num");
const maxItem = 4;
let index = 1;
let children ='';
let pagination;


function allItems(){
   for(let i=0; i<urlList.length; i++){
      children ='<div class="col-sm-6  border">'+urlList[i]+'</div>';
      mainDiv.append(children);
      
      showItems();
      
   }
    
      
}




prev.addEventListener('click', function(){
   index--;
   check();
   showItems();
});
next.addEventListener('click', function(){
   index++;
   check();
   showItems();
});

function check(){
   console.log(index==pagination)
   if(index==pagination){
      $('.floating-btn').show();
      next.classList.add("disabled");
   }else{
      next.classList.remove("disabled");
   }
   if(index==1){
      prev.classList.add("disabled");
   }else{
      prev.classList.remove("disabled");
   }
}

function showItems(){
   
   for(let i=0; i<mainItems.length;i++){
      mainItems[i].setAttribute('style','display:none');
      if(i>=(index*maxItem)-maxItem && i<index*maxItem){
         mainItems[i].setAttribute('style','display:block');
         pagination = Math.ceil(mainItems.length/maxItem);
      }  
      
      page.innerHTML= index;
   }
    
}

window.onload= function(){
   allItems();
   check();
   $('.floating-btn').click(function(){
      mainDiv.toggle();
   });
}




