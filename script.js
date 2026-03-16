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

/* SPACED REPETITION */

function schedule(card,success){

    if(success){
    card.interval *=2;
    }else{
    card.interval=1;
    }
    
    card.nextReview=Date.now()+card.interval*86400000;
    
    save();
    
    }
    
    
    
    /* QUIZ MODE */
    
    function startQuiz(){
    
    const dueCards = cards.filter(card => card.nextReview <= Date.now());
    
    if(dueCards.length===0){
    alert("No cards due for review");
    return;
    }
    
    let current=0;
    
    showQuestion();
    
    function showQuestion(){
    
    const card = dueCards[current];
    
    document.getElementById("quizContainer").innerHTML=`
    
    <h2>${card.question}</h2>
    
    <button onclick="showAnswer()">Show Answer</button>
    
    `;
    
    window.showAnswer=()=>{
    
    document.getElementById("quizContainer").innerHTML+=`
    
    <p>${card.answer}</p>
    
    <button onclick="correctAnswer()">Correct</button>
    <button onclick="wrongAnswer()">Wrong</button>
    
    `;
    
    };
    
    window.correctAnswer=()=>{
    
    correct++;
    schedule(card,true);
    next();
    
    };
    
    window.wrongAnswer=()=>{
    
    wrong++;
    schedule(card,false);
    next();
    
    };
    
    function next(){
    
    current++;
    
    if(current<dueCards.length){
    showQuestion();
    }else{
    document.getElementById("quizContainer").innerHTML="<h3>Quiz finished!</h3>";
    updateStats();
    }
    
    }
    
    }
    
    }
    
    
    
    /* PROGRESS CHART */
    
    let chart;
    
    function updateChart(){
    
    const ctx=document.getElementById("progressChart");
    
    if(chart) chart.destroy();
    
    chart=new Chart(ctx,{
    type:"doughnut",
    data:{
    labels:["Correct","Wrong"],
    datasets:[{
    data:[correct,wrong]
    }]
    }
    });
    
    }
    
    
    
    /* EXPORT */
    
    function exportCards(){
    
    const dataStr = JSON.stringify(cards);
    
    const blob = new Blob([dataStr],{type:"application/json"});
    
    const a=document.createElement("a");
    
    a.href=URL.createObjectURL(blob);
    a.download="flashcards.json";
    
    a.click();
    
    }
    
    
    
    /* IMPORT */
    
    document.getElementById("importFile").addEventListener("change",function(){
    
    const file=this.files[0];
    
    const reader=new FileReader();
    
    reader.onload=function(e){
    
    cards=JSON.parse(e.target.result);
    
    save();
    render();
    
    };
    
    reader.readAsText(file);
    
    });
    
    
    
    /* AI FLASHCARD GENERATOR */
    
    function generateAI(){
    
    const topic = prompt("Enter topic");
    
    if(!topic) return;
    
    cards.push(
    {
    question:`What is ${topic}?`,
    answer:`${topic} is an important concept related to ${topic}.`,
    category:"AI",
    interval:1,
    nextReview:Date.now()
    });
    
    cards.push(
    {
    question:`Why is ${topic} important?`,
    answer:`It helps understand deeper ideas about ${topic}.`,
    category:"AI",
    interval:1,
    nextReview:Date.now()
    });
    
    save();
    render();
    
    }