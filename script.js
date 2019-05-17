class LightsOutGameManster {
	constructor() {
		this.startMenu = new StartMenu();
		this.resetMenu = new ResetMenu();
		this.startNumber = this.createRandomString();
		this.score = new Score(this.startNumber.split("").filter(c => c === "0").length);

		this.setStartButtonEvent();
		this.setResetButtonEvent();
		this.startGame(this.startNumber);
		this.clickCount = 0;
	}

	setStartButtonEvent(){
		this.startMenu.setStartButtonEvent(this.callStartEvent.bind(this));
	}

	setResetButtonEvent(){
		this.resetMenu.setResetButtonEvent(this.resetGame.bind(this));
	}

	onClick(event) {
		this.score.update();
		this.game.onClick(event.srcElement);
		const isFinished = this.game.isFinished();
		if(isFinished)
			setTimeout(() => alert("clear!"), 500);
		console.log(this.game.playingArray.map(pannel => pannel.isLighted));
	}

	callStartEvent(){
		this.startGame(this.createRandomString());
	}

	startGame(startNumber){
		console.log(startNumber);
		this.startNumber = startNumber;
		this.score.reset(startNumber.split("").filter(c => c === "0").length);
		this.clickCount = 0;
		let number = this.startMenu.getNumber();
		const oldGame = this.game;
		this.game = new LightsOutGame(number, this.onClick.bind(this), startNumber);
		if(oldGame !== undefined)
			oldGame.destroy();
	}

	resetGame(){
		this.startGame(this.startNumber);
	}

	createRandomString(){
		let stringNumber = "";
		const num = this.startMenu.getNumber();
		for(let i = 0; i < num * num; i++)
			stringNumber += this.random(0, 2);
		if(stringNumber.split("").filter(c => c === "0").length == 0)
			stringNumber = stringNumber.replace("1", "0");
		return stringNumber;
	}

	random(begin, end) {
		const result = Math.floor(Math.random() * (end - begin)) + begin;
		return result;
	}
}

class LightsOutGame{

	constructor(num, onClick, startStringNumber){
		const boardSize = 77 - (num+1);
		this.panelSize = boardSize / num;
		this.number = num;
		this.startStringNumber = startStringNumber;
		this.gameBoard = document.getElementsByClassName("board").item(0);
		this.playingArray = this.createStartArray(onClick, this.startStringNumber);
	}

	createRandomString(){
		let stringNumber = "";
		for(let i = 0; i < this.number * this.number; i++)
			stringNumber += this.random();
		return stringNumber;
	}


	createStartArray(onClick, stringNumber){
		let array = [];
		for(let i = 0; i < this.number * this.number; i++)
			array.push(new LightPanel(this.panelSize));
		for(let i = 0; i < stringNumber.length; i++)
			if(stringNumber.charAt(i) === "1")
				this.changeSwitch(i, array);
		array.forEach(element => {
			element.element.addEventListener("click", onClick);
			this.gameBoard.appendChild(element.element);
		});
		return array;
	}

	isFinished() {
		let isFinished = true;
		for(let i = 0; i < this.playingArray.length; i++){
			if(!(isFinished = isFinished && !this.playingArray[i].isLighted))
				break;
		}
		return isFinished;
	}

	changeSwitch(clickedNum, array){
		const isTop = Math.floor(clickedNum / this.number) === 0;
		const isBottom = Math.floor(clickedNum / this.number) === this.number -1;
		const isLeft = Math.floor(clickedNum % this.number) === 0;
		const isRight = Math.floor(clickedNum % this.number) === this.number -1;
		if(!isTop)
			array[clickedNum - this.number].update();
		if(!isBottom)
			array[clickedNum + this.number].update();
		if(!isLeft)
			array[clickedNum - 1].update();
		if(!isRight)
			array[clickedNum + 1].update();
		array[clickedNum].update();
	}

	onClick(element){
		this.clickCount++;
		let i = 0;
		for(; i < this.playingArray.length; i++){
			if(this.playingArray[i].element === element)
				break;
		}
		this.changeSwitch(i, this.playingArray);
	}

	destroy(){
		for(let i = 0; i < this.playingArray.length; i++){
			const child = this.playingArray[i];
			this.gameBoard.removeChild(child.element);
		}
	}
}

class LightPanel{
	constructor(elementSize){
		this.classNames = ["switch"];
		this.isLighted = false;
		this.classNames.push(this.isLighted ? "on" : "off");
		this.element = this.createPannel();
		this.element.style.width = elementSize + "vmin";
		this.element.style.height = elementSize + "vmin";
		this.update();
	}

	createPannel(){
		let element = document.createElement("div");
		return element;
	}

	update(){
		this.isLighted = !this.isLighted;
		this.classNames.pop();
		this.classNames.push(this.isLighted ? "on" : "off");
		const content = this.classNames.join(" ");
		this.element.setAttribute("class", content);
	}
}

class StartMenu{
	constructor(){
		this.startMenu = document.getElementsByClassName("startMenu").item(0);
		this.min = "2";
		this.max = "20";
		this.startMenu.getElementsByTagName("input").item(0).addEventListener("blur", this.checkNumber.bind(this));
	}

	getNumber(){
		let panelNum = Number.parseInt(this.startMenu.getElementsByTagName("input").startNumber.value);
		return panelNum;
	}

	checkNumber(){
		const number = this.startMenu.getElementsByTagName("input").startNumber;
		let panelNum = Number.parseInt(number.value);
		panelNum = Math.min(this.max, panelNum);
		panelNum = Math.max(this.min, panelNum);
		number.value = panelNum;
	}

	setStartButtonEvent(onClick){
		this.startMenu.getElementsByTagName("button").item(0).addEventListener("click", onClick);
	}
}

class ResetMenu{
	constructor(onClick){
		this.resetMenu = document.getElementsByClassName("resetMenu").item(0);

	}

	setResetButtonEvent(onClick){
		this.resetMenu.getElementsByTagName("button").item(0).addEventListener("click", onClick);
	}
}

class Score{
	constructor(answer){
		this.scoreElement = document.getElementsByClassName("score").item(0).getElementsByTagName("p").item(0);
		this.clickCount = -1;
		this.answerClickCount = answer;
	}

	reset(answer){
		this.clickCount = -1;
		this.answerClickCount = answer;		
		this.update();
	}

	update(){
		this.clickCount++;
		this.scoreElement.innerText = "score : " + this.clickCount + " / " + this.answerClickCount; 
	}
}

let lightOut = new LightsOutGameManster();