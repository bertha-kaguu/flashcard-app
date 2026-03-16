const container = document.getElementById("cardsContainer");
const searchInput = document.getElementById("search");
const totalCards = document.getElementById("totalCards");

let cards = JSON.parse(localStorage.getItem("flashcards")) || [];

let correct = 0;
let wrong = 0;

function save(){
localStorage.setItem("flashcards", JSON.stringify(cards));
}

function updateStats(){
totalCards.textContent = cards.length;
document.getElementById("correct").textContent = correct;
document.getElementById("wrong").textContent = wrong;

updateChart();
}

function render(){

container.innerHTML="";

const search = searchInput.value.toLowerCase();

cards
.filter(card => 
card.question.toLowerCase().includes(search) ||
card.answer.toLowerCase().includes(search)
)
.forEach((card,index)=>{

const div = document.createElement("div");
div.className="flashcard";

div.innerHTML=`

<div class="inner">

<div class="front">
${card.question}
</div>

<div class="back">
<p>${card.answer}</p>
<small>${card.category}</small>
<button class="delete" onclick="deleteCard(${index})">Delete</button>
</div>

</div>

`;

div.addEventListener("click",()=>{
div.classList.toggle("flip");
});

container.appendChild(div);

});

updateStats();

}

function addCard(){

const question = document.getElementById("question").value;
const answer = document.getElementById("answer").value;
const category = document.getElementById("category").value;

if(!question || !answer){
alert("Fill all fields");
return;
}

cards.push({
question:question,
answer:answer,
category:caategory,
interval:1,
nextReview:Date.now()
});

save();
render();

document.getElementById("question").value="";
document.getElementById("answer").value="";
}

function deleteCard(index){

cards.splice(index,1);
save();
render();

}

searchInput.addEventListener("input",render);

render();

const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

});