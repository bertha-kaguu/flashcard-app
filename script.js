const container = document.getElementById("cardsContainer");
const searchInput = document.getElementById("search");
const totalCards = document.getElementById("totalCards");
const scoreDisplay = document.getElementById("score");
const themeToggle = document.getElementById("themeToggle");

const quizModal = document.getElementById("quizModal");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");

let cards = JSON.parse(localStorage.getItem("flashcards")) || [];
let score = 0;

// Spaced repetition: track next review time
cards.forEach(c => c.nextReview = c.nextReview || Date.now());

function save(){
localStorage.setItem("flashcards", JSON.stringify(cards));
}

function updateStats(){
totalCards.textContent = cards.length;
scoreDisplay.textContent = score;
}

function render(){
container.innerHTML = "";
const search = searchInput.value.toLowerCase();
cards
.filter(card => card.question.toLowerCase().includes(search) || card.answer.toLowerCase().includes(search))
.forEach((card,index)=>{
const div = document.createElement("div");
div.className="flashcard";

div.innerHTML=`
<div class="inner">
<div class="front">${card.question}</div>
<div class="back">
<p>${card.answer}</p>
<small>${card.category}</small>
<button class="delete" onclick="deleteCard(${index})">Delete</button>
</div>
</div>
`;

div.addEventListener("click",()=>{div.classList.toggle("flip");});
container.appendChild(div);
});
updateStats();
renderChart();
}

function addCard(){
const question = document.getElementById("question").value;
const answer = document.getElementById("answer").value;
const category = document.getElementById("category").value;
if(!question || !answer){alert("Fill all fields");return;}
cards.push({question,answer,category,nextReview:Date.now(),interval:1});
save();
render();
document.getElementById("question").value="";
document.getElementById("answer").value="";
}

// Delete card
function deleteCard(index){
cards.splice(index,1);
save();
render();
}

// Search
searchInput.addEventListener("input",render);

// Theme toggle
themeToggle.addEventListener("click",()=>{document.body.classList.toggle("dark");});

// ----- QUIZ MODE -----
let quizIndex = 0;
let quizCards = [];

document.getElementById("studyModeBtn").addEventListener("click",startQuiz);

function startQuiz(){
score = 0;
scoreDisplay.textContent = score;
// Sort by next review (spaced repetition)
quizCards = cards.sort((a,b)=>a.nextReview-b.nextReview).slice(0,5);
quizIndex = 0;
showQuestion();
quizModal.style.display="flex";
}

function showQuestion(){
if(quizIndex >= quizCards.length){alert("Quiz completed! Score: "+score);closeQuiz();return;}
const card = quizCards[quizIndex];
quizQuestion.textContent = card.question;
quizAnswers.innerHTML = `
<button onclick="checkAnswer(true)">Show Answer</button>
`;
}

function checkAnswer(show){
const card = quizCards[quizIndex];
if(show){
alert("Answer: "+card.answer);
const correct = confirm("Did you answer correctly?");
if(correct){score++;scoreDisplay.textContent=score;card.interval*=2;} else {card.interval=1;}
card.nextReview = Date.now() + card.interval*24*60*60*1000; // spaced repetition interval in ms
save();
quizIndex++;
showQuestion();
}
}

function nextQuestion(){
quizIndex++;
showQuestion();
}

function closeQuiz(){
quizModal.style.display="none";
render();
}

// ----- PROGRESS CHART -----
function renderChart(){
const ctx = document.getElementById('progressChart').getContext('2d');
const categories = {};
cards.forEach(c => {categories[c.category]=(categories[c.category]||0)+1;});
if(window.myChart) window.myChart.destroy();
window.myChart = new Chart(ctx,{
type:'doughnut',
data:{
labels:Object.keys(categories),
datasets:[{data:Object.values(categories),backgroundColor:['#4a6cf7','#ff7f50','#2ecc71','#f1c40f']}]
}
});
}

// ----- IMPORT/EXPORT -----
function exportCards(){
const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards));
const dlAnchor = document.createElement('a');
dlAnchor.setAttribute("href", dataStr);
dlAnchor.setAttribute("download", "flashcards.json");
dlAnchor.click();
}

function importCards(event){
const file = event.target.files[0];
if(!file) return;
const reader = new FileReader();
reader.onload = e => {
const imported = JSON.parse(e.target.result);
cards = cards.concat(imported);
save();
render();
};
reader.readAsText(file);
}

render();