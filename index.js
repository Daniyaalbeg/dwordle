#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { words, wordOptions } from './words.js';
import { writeFileSync, readFileSync, readFile } from 'fs';
import { exit } from 'process';
import yargs from 'yargs';
import checkForUpdate from 'update-check';

// Utils
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

//State
const boardState = [[], [], [], [], [], []];

const wordAttempts = [null, null, null, null, null, null];

const attemptedLetters = {
	a: 0,
	b: 0,
	c: 0,
	d: 0,
	e: 0,
	f: 0,
	g: 0,
	h: 0,
	i: 0,
	j: 0,
	k: 0,
	l: 0,
	m: 0,
	n: 0,
	o: 0,
	p: 0,
	q: 0,
	r: 0,
	s: 0,
	t: 0,
	u: 0,
	v: 0,
	w: 0,
	x: 0,
	y: 0,
	z: 0,
};

const attemptText = [
	'first',
	'second',
	'third',
	'fourth',
	'fifth',
	'sixth and final',
];

let showEmojiBoard = false;

const today = new Date();

const checkIfUpdate = () => {
	let update = null;

	try {
		readFile('./package.json', async (err, data) => {
			update = await checkForUpdate(JSON.parse(data));
		});
	} catch (err) {
		console.error(`Failed to check for updates: ${err}`);
	}

	if (update) {
		console.log(`The latest version is ${update.latest}. Please update!`);
	}
};

const initialCheck = async () => {
	var argv = yargs(process.argv.slice(2)).default('e', false).argv;
	showEmojiBoard = argv.e;

	try {
		const fileData = readFileSync('./data.json', { encoding: 'utf8' });
		const d = JSON.parse(fileData);
		if (today.getDate() === new Date(d.date).getDate()) {
			console.log(
				chalk.red(
					`You have already attemped this puzzle today and ${
						d.hasWon ? 'won' : 'lost'
					}. The word for today was ${Da(today)}. Next puzzle is available in ${
						24 - today.getHours()
					} hours.`
				)
			);
			exit();
		}
	} catch {
		// Do nothing i guess
	}
};

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
	const spinner = createSpinner('Checking word...').start();

	await sleep(2000);

	if (Da(today) === answer) {
		spinner.success({ text: 'Correct' });
		return true;
	} else {
		spinner.error({ text: 'Try Again' });
		return false;
	}
};

const changeItem = (arr, item) => {
	const index = arr.indexOf(item);
	if (index > -1) {
		arr[index] = 0; // 2nd parameter means remove one item only
	}
};

const generateAnswerGrid = (i) => {
	const correctWord = Da(today);
	const lettersUsed = correctWord.split('');
	for (let j = 0; j < 5; j++) {
		if (wordAttempts[i].split('')[j] === lettersUsed[j]) {
			attemptedLetters[wordAttempts[i].split('')[j]] = 'correct';
			boardState[i][j] = 'correct';
			changeItem(lettersUsed, wordAttempts[i].split('')[j]);
		} else if (lettersUsed.includes(wordAttempts[i].split('')[j])) {
			if (attemptedLetters[wordAttempts[i].split('')[j]] !== 'correct') {
				attemptedLetters[wordAttempts[i].split('')[j]] = 'somewhere';
			}
			boardState[i][j] = 'somewhere';
			changeItem(lettersUsed, wordAttempts[i].split('')[j]);
		} else {
			if (attemptedLetters[wordAttempts[i].split('')[j]] === 0) {
				attemptedLetters[wordAttempts[i].split('')[j]] = 'incorrect';
			}
			boardState[i][j] = 'incorrect';
		}
	}
	// console.log(attemptedLetters);
};

const printUsedLetters = () => {
	const letters = 'abcdefghijklmonpqrstuvwxyz'.split('');
	letters.forEach((l) => {
		if (attemptedLetters[l] === 'correct') {
			process.stdout.write(chalk.white.bold.bgGreen(' ' + l + ' '));
		} else if (attemptedLetters[l] === 'somewhere') {
			process.stdout.write(chalk.black.bold.bgYellowBright(' ' + l + ' '));
		} else if (attemptedLetters[l] === 'incorrect') {
			process.stdout.write(chalk.white.bold.bgBlack(' ' + l + ' '));
		} else {
			process.stdout.write(chalk.white.bold.bgGray(' ' + l + ' '));
		}
	});
	console.log('\n');
};

const printBoard = () => {
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

const printEmojiBoard = () => {
	boardState.forEach((a) => {
		if (!a.length) return;
		console.log();
		a.forEach((b) => {
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

			if (showEmojiBoard) printEmojiBoard();

			printBoard();

			printUsedLetters();

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
		const correctWord = Da(today);
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

	try {
		writeFileSync(
			'./data.json',
			JSON.stringify({
				hasWon: hasWon,
				date: today,
			})
		);
	} catch (e) {
		console.log(e);
	}
};

const main = async () => {
	console.clear();
	// checkIfUpdate();
	await initialCheck();
	await welcome();
	await rules();
	await gameLoop();
};

await main();
