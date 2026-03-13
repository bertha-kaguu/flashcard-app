const container = document.getElementById("cards-container");

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

function saveCards(){
localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function displayCards(){

container.innerHTML = "";

flashcards.forEach((card,index)=>{

const flashcard = document.createElement("div");
flashcard.className="flashcard";

flashcard.innerHTML=`
<div class="card-inner">
<div class="card-front">
${card.question}
</div>

<div class="card-back">
<div>
<p>${card.answer}</p>
<button class="delete-btn" onclick="deleteCard(${index})">Delete</button>
</div>
</div>
</div>
`;

flashcard.addEventListener("click",()=>{
flashcard.classList.toggle("flipped");
});

container.appendChild(flashcard);

});
}

function addFlashcard(){

const question = document.getElementById("question").value;
const answer = document.getElementById("answer").value;

if(question==="" || answer===""){
alert("Please fill both fields");
return;
}

flashcards.push({question,answer});

saveCards();
displayCards();

document.getElementById("question").value="";
document.getElementById("answer").value="";
}

function deleteCard(index){

flashcards.splice(index,1);

saveCards();
displayCards();
}

displayCards();