var qList 		= "";
var currQue 	= 0;
var totalQue	= 0;
var totalCorrect	= 0;

function loadJS(FILE_URL, async = true) {
  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);

  document.body.appendChild(scriptEle);

  // success event
  scriptEle.addEventListener("load", () => {
    console.log("File loaded")
  });
   // error event
  scriptEle.addEventListener("error", (ev) => {
    console.log("Error on loading file", ev);
  });
}

function setNextQuestion(e) {
	e.preventDefault();
	currQue = (currQue == totalQue) ? 1 : (currQue+1);
	processQuestion(qList.questions[currQue-1], currQue);
}

function setPrevQuestion(e) {
	e.preventDefault();
	currQue = (currQue == 1) ? totalQue : (currQue-1);
	processQuestion(qList.questions[currQue-1], currQue);
}


function readQuestion(event) {

	//var data = require('questions_js/science.json');
	//console.log("apple");

  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _ => {
    // you can use this method to get file and perform respective operations
            // let files =   Array.from(input.files);
			let file = input.files[0];
			let reader = new FileReader();
			reader.readAsText(file);

			reader.onload = function() {
				qList = JSON.parse(reader.result);
				// console.log(reader.result);
				processQueList(qList);
				//loadJS("questions_js/index.js", false);
			};

			reader.onerror = function() {
				console.log(reader.error);
			};
            //console.log(files);
        };
  input.click();

}

function processQueList(qList) {
	var q1 = qList.questions[0];
	totalQue = qList.questions.length;

	document.getElementById("quizForm").style.display = "block";
	currQue = 1;
	processQuestion(qList.questions[currQue-1], currQue);

}

function processQuestion(que, num){
	setQuestion(que.question , num);
	unMarkOption(1); unMarkOption(2); unMarkOption(3); unMarkOption(4);unSetFill();
	hideOption(1); hideOption(2); hideOption(3); hideOption(4);hideFill();
	if(que.answers === undefined){
		showFill();
		if (qList.questions[currQue-1].choice === undefined) {
		}
		else {
			setFill(qList.questions[currQue-1].choice);
		}
	}
	else{
		que.answers.map(processAnswers);
		if (qList.questions[currQue-1].choice === undefined) {
			qList.questions[currQue-1].choice = 0;
		}
		else if(qList.questions[currQue-1].choice > 0){
			markOption(qList.questions[currQue-1].choice)
		}
	}
}

function processAnswers(val, index, arr){
	setOption(val, index+1);
}

function makeChoice(event){

	qList.questions[currQue-1].choice= event.target.value;
	//console.log(event.target.value);
}

function setQuestion(q, n) {
	questionElement = document.getElementById("question");
	questionElement.innerText = q;

	questionElement = document.getElementById("qid");
	questionElement.innerText = n;
	questionElement.innerText = questionElement.innerText + "."
}

function markOption(num){
	var ansID = "r"+num;
	document.getElementById(ansID).checked = true;
}

function unMarkOption(num){
	var ansID = "r"+num;
	document.getElementById(ansID).checked = false;
}

function hideFill() {
	document.getElementById("fill").style.display = "none";
}

function showFill() {
	document.getElementById("fill").style.display = "block";
}

function setFill(val ) {
	document.getElementById("fill").value = val;
	showFill();
}

function unSetFill(){
	document.getElementById("fill").value="";
}

function hideOption(num) {
	var ansID = "o"+num;
	document.getElementById(ansID).style.display = "none";
}

function showOption(num) {
	var ansID = "o"+num;
	document.getElementById(ansID).style.display = "block";
}

function setOption(option, num ) {
	var ansID = "o"+num+"val";
	document.getElementById(ansID).innerText = option;
	showOption(num);
}

function showResult(e){

	// document.getElementById("quizForm").style.display = "none";

	qList.questions.map(displayCorrectChoice)

	const parentDiv = document.getElementById("res-header");
	parentDiv.innerText = "Total Score is : " + totalCorrect + "/" + totalQue;
}

function displayCorrectChoice(que, index, array){

	const parentDiv = document.getElementById("result");

	const queDiv = document.createElement("div");
	queDiv.setAttribute("class", "result-question");
	queDiv.innerText = "Q " + (index+1) +". "+ que.question;
	parentDiv.appendChild(queDiv);


	const correctDiv = document.createElement("div");
	var str = "" ;

	if(que.answers === undefined){
		str = str + "Correct Answer is : " + que.correct_answer ;
		if(que.correct_answer != que.choice)
		{
			str = str + " &nbsp; &nbsp; &nbsp; (you marked - " + que.choice + ")"
		}
	}else{
		str = str + "Correct Answer is : " + que.answers[que.correct_answer -1] ;
		if(que.correct_answer != que.choice)
		{
			str = str + " &nbsp; &nbsp; &nbsp; (you marked - " + que.answers[que.choice -1] + ")"
		}
	}
	correctDiv.innerHTML = str;
	parentDiv.appendChild(correctDiv);

	const icon = document.createElement("i");
	icon.setAttribute("class", "fa fa-remove c-wrong");
	if(que.correct_answer == que.choice)
	{
		icon.setAttribute("class", "fa fa-check c-correct");
		totalCorrect = totalCorrect + 1;
	}
	queDiv.appendChild(icon);

	const hr = document.createElement("hr");
	parentDiv.appendChild(hr);

}

//loadJS("questions_js/index.js", false);
