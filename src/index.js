#!/usr/bin/env node
import got from 'got';
import { JSDOM } from 'jsdom';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import console from 'consola';
import fs from 'fs/promises';
import stdConsole from 'console';
import Table from 'cli-table';
import { stringify } from 'csv';
import { markdownTable } from 'markdown-table';

const argv = yargs(hideBin(process.argv))
	.option('usernames', {
		alias: 'u',
		type: 'array',
		description: 'List of usernames to fetch',
	})
	.option('problems', {
		alias: 'p',
		type: 'array',
		description: 'List of problems to fetch',
	})
	.option('output', {
		alias: 'o',
		type: 'string',
		description: 'Output format',
		choices: ['stdout', 'md', 'csv'],
		default: 'stdout',
	})
	.demandOption(['usernames', 'problems'])
	.help()
	.argv;

const problems = argv.problems;
const usernames = argv.usernames;
const outputFormat = argv.output;

const scores = {};

for (const username of usernames) {

	console.info(chalk.blue(`Fetching submissions for ${username}`));
	scores[username] = {};

	for (const problem of problems) {
		console.info(chalk.cyan(`  Fetching ${username}'s submissions for ${problem}`));

		const res = (await got(`https://codebreaker.xyz/submissions?problem=${problem}&username=${username}`)).body;
		const { document } = (new JSDOM(res)).window;
		const scoresTable = document.querySelector('table#myTable > tbody');
		const scoreRows = scoresTable.getElementsByTagName('tr');
		let maxScore = 0;

		for (const row of scoreRows) {
			const score = parseInt(row.getElementsByTagName('td')[4].textContent);
			if (score > maxScore) {
				maxScore = score;
			}
		}
		scores[username][problem] = maxScore;
	}
}

console.log();

if (outputFormat === 'stdout') {
	const table = new Table({
		head: ['Username', ...problems],
	});
	for (const username in scores) {
		table.push([username, ...problems.map(problem => {
			const score = scores[username][problem];
			if (score === 0) {
				return chalk.red(score);
			}
			if (score === 100) {
				return chalk.green(score);
			}
			else {
				return chalk.yellow(score);
			}
		})]);
	}
	console.log(table.toString());
}

else if (outputFormat === 'csv') {
	const csv = stringify([
		['Username', ...problems],
		// eslint-disable-next-line no-shadow
		...Object.entries(scores).map(([username, scores]) => [username, ...problems.map(problem => scores[problem])]),
	]);

	await fs.writeFile('./scores.csv', csv);
	console.success('Saved scores to scores.csv!');
}

else if (outputFormat === 'md') {
	const table = markdownTable([
		['Username', ...problems],
		// eslint-disable-next-line no-shadow
		...Object.entries(scores).map(([username, scores]) => [username, ...problems.map(problem => scores[problem])]),
	]);

	await fs.writeFile('./scores.md', table);
	console.success('Saved scores to scores.md!');
}