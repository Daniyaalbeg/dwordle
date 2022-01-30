#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { words, wordOptions } from './words.js';

// Utils
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

//State
const boardState = [[], [], [], [], [], []];

const wordAttempts = [null, null, null, null, null, null];

const attemptText = [
	'first',
	'second',
	'third',
	'fourth',
	'fifth',
	'sixth and final',
];

const welcome = async () => {
	figlet('Welcome to Dwordle', async function (err, data) {
		if (err) {
			console.log('Something went wrong...');
			console.dir(err);
			return 'Error!';
		}

		console.log(gradient.pastel(data));
	});

	await sleep(50);
};

const rules = async () => {
	const ruleText = chalkAnimation.rainbow('Its Wordle in your terminal!');
	ruleText.render();
	await sleep(500);
	ruleText.stop();

	console.log(
		chalk.cyanBright(
			'Literally a clone of wordle (Original Game by Josh Wardle)'
		)
	);

	console.log('Just type in your word and hit enter to begin');
};

var Ha = new Date(2021, 5, 19, 0, 0, 0, 0);
function Na(e, a) {
	var s = new Date(e),
		t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
	return Math.round(t / 864e5);
}
function Da(e) {
	var a,
		s = Ga(e);
	return (a = s % words.length), words[a];
}
function Ga(e) {
	return Na(Ha, e);
}

const validInput = (answer) => {
	if (answer.length !== 5) {
		console.log(chalk.red('Word is the wrong length'));
		return false;
	}
	if (!wordOptions.includes(answer) && !words.includes(answer)) {
		console.log(chalk.red('Not in word list'));
		return false;
	}
	return true;
};

const checkAnswer = async (answer) => {
	const date = new Date();
	const spinner = createSpinner('Checking word...').start();

	await sleep(2000);

	if (Da(date) === answer) {
		spinner.success({ text: 'Correct' });
		return true;
	} else {
		spinner.error({ text: 'Try Again' });
		return false;
	}
};

const generateAnswerGrid = (i) => {
	const date = new Date();
	const correctWord = Da(date);
	for (let j = 0; j < 5; j++) {
		if (wordAttempts[i].split('')[j] === correctWord.split('')[j]) {
			boardState[i][j] = 'correct';
		} else if (correctWord.split('').includes(wordAttempts[i].split('')[j])) {
			boardState[i][j] = 'somewhere';
		} else {
			boardState[i][j] = 'incorrect';
		}
	}
};

const printBoard = () => {
	boardState.forEach((a, firstIndex) => {
		if (!a.length) return;
		console.log();
		a.forEach((b, secondIndex) => {
			if (b === 'correct') {
				process.stdout.write('🟩');
			} else if (b === 'somewhere') {
				process.stdout.write('🟨');
			} else {
				process.stdout.write('⬛');
			}
		});
	});
	console.log();
	boardState.forEach((a, firstIndex) => {
		if (!a.length) return;
		console.log();
		a.forEach((b, secondIndex) => {
			if (b === 'correct') {
				process.stdout.write(
					chalk.black.bold.bgGreenBright(
						' ' + wordAttempts[firstIndex].split('')[secondIndex] + ' '
					)
				);
			} else if (b === 'somewhere') {
				process.stdout.write(
					chalk.black.bold.bgYellowBright(
						' ' + wordAttempts[firstIndex].split('')[secondIndex] + ' '
					)
				);
			} else {
				process.stdout.write(
					chalk.white.bold.bgBlackBright(
						' ' + wordAttempts[firstIndex].split('')[secondIndex] + ' '
					)
				);
			}
		});
	});
	console.log('\n');
};

const gameLoop = async () => {
	let hasWon = false;
	for (let i = 0; i < 6; i++) {
		const answers = await inquirer.prompt({
			name: 'attempt',
			type: 'input',
			message: `Your ${attemptText[i]} attempt`,
		});

		const answer = answers.attempt;

		if (!validInput(answer)) {
			i--;
		} else {
			wordAttempts[i] = answer;

			hasWon = await checkAnswer(answer);

			generateAnswerGrid(i);

			printBoard();

			if (hasWon) {
				figlet('YOU WON!', async function (err, data) {
					if (err) {
						console.log('Something went wrong...');
						console.dir(err);
						return 'Error!';
					}

					console.log(gradient.vice(data));
				});
				break;
			}
		}
	}

	if (!hasWon) {
		const date = new Date();
		const correctWord = Da(date);
		console.log();
		const ruleText = chalkAnimation.pulse(
			'💀 Correct answer was ' + correctWord
		);
		await sleep(1000);
		ruleText.stop();
		figlet('Try Again Tomorrow!', async function (err, data) {
			if (err) {
				console.log('Something went wrong...');
				console.dir(err);
				return 'Error!';
			}

			console.log(gradient.passion(data));
		});
	}
};

const main = async () => {
	console.clear();
	await welcome();
	await rules();
	await gameLoop();
};

await main();
