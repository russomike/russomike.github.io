function getRand(min, max) {
	const randomValue = Math.random() * (max - min) + min;
	console.log(randomValue); 
	return randomValue;
}

const branchingFactor = getRand(0.01, 0.08);
const noiseFactor = getRand(2, 7);
let strokeSize = 1; 
const agentArray = [];
const agentSpeed = 666;
let world;

const colors = [ '#522258', '#8C3061', '#C63C51', '#8C0D34', '#7B105C', ]; 
let currentColor = colors[0]; 


function setup() {
	init();
	changeStrokeColor(); 
}

function init() {
	let windowWidth = document.getElementById('main').offsetHeight;
	let windowHeight = document.getElementById('main').offsetWidth;
	createCanvas(windowWidth, windowHeight);

	noiseSeed();
	stroke(currentColor); // Use the current color for stroke
	background("BLACK");
	noFill();

	world = array2d();
	agentArray.length = 0;
	agentArray.push(agent());
}

mouseClicked = () => init();

function draw() {
	for (let i = 0; i < agentSpeed; i++) {
		agentArray.forEach((agent) => agent.next());
	}
}

function* agent() {
	const x = random(width);
	const y = random(height);
	const heading = 0;
	const stack = [{ x, y, heading }];
	world.set(x, y);

	while (stack.length) {
		let { x, y, heading } = stack.pop();

		const num = random() < branchingFactor ? 2 : 1;
		for (let i = 0; i < num; i++, heading += PI / 2) {
			let newX = x;
			let newY = y;
			do {
				n = noise(newX / width, newY / height) * noiseFactor;
				newX = (newX + cos(heading + n) + width) % width;
				newY = (newY + sin(heading + n) + height) % height;
			} while (floor(newX) === floor(x) && floor(newY) === floor(y));
			if (!world.canMoveTo(newX, newY)) continue;
			stack.push({ x: newX, y: newY, heading });
			world.set(newX, newY);
			yield;
		}
	}
}

function array2d() {
	const array = Array.from({ length: width }, () => Array(height).fill(false));

	return {
		canMoveTo: (x, y) => {
			return array[floor(x)][floor(y)] === false;
		},
		set: (x, y) => {
			array[floor(x)][floor(y)] = true;
			stroke(currentColor); // Apply the current stroke color
			rect(x, y, strokeSize, strokeSize); // Use the strokeSize constant
		},
	};
}

function changeStrokeColor() {
	const randomInterval = random(400, 2400); // Random interval between 500ms and 2000ms
	setInterval(() => {
		currentColor = random(colors); // Randomly pick a color from the array
		let strokeSize = getRand(0.03, 1.8);
	}, randomInterval);
}

