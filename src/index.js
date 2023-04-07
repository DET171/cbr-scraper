#!/usr/bin/env node

// Imports
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

// Parse command line arguments
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
		description: `Output format
		- stdout
		- json
		- md
		- csv`,
		default: 'stdout',
	})
	.demandOption(['usernames', 'problems'])
	.help()
	.argv;

// Get problems and usernames from command line arguments
const problems = argv.problems;
const usernames = argv.usernames;
const outputFormat = argv.output;

// Initialize scores object
const scores = {};

// Iterate over usernames
for (const username of usernames) {

	// Log username being fetched
	console.info(chalk.blue(`Fetching submissions for ${username}`));

	// Initialize scores object for username
	scores[username] = {};

	// Iterate over problems
	for (const problem of problems) {

		// Log problem being fetched
		console.info(chalk.cyan(`  Fetching ${username}'s submissions for ${problem}`));

		// Get submissions page
		const res = (await got(`https://codebreaker.xyz/submissions?problem=${problem}&username=${username}`)).body;

		// Parse submissions page
		const { document } = (new JSDOM(res)).window;

		// Get table of scores
		const scoresTable = document.querySelector('table#myTable > tbody');

		// Get rows of scores
		const scoreRows = scoresTable.getElementsByTagName('tr');

		// Initialize max score
		let maxScore = 0;

		// Iterate over rows of scores
		for (const row of scoreRows) {

			// Get score
			const score = parseInt(row.getElementsByTagName('td')[4].textContent);

			// Update max score
			if (score > maxScore) {
				maxScore = score;
			}
		}

		// Update scores object with max score
		scores[username][problem] = maxScore;
	}
}

// empty line
console.log();


// Output scores
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

else if (outputFormat === 'json') {
	await fs.writeFile('./scores.json', JSON.stringify(scores, null, 2));
	console.success('Saved scores to scores.json!');
}

else if (outputFormat === 'csv') {
	// eslint-disable-next-line no-shadow
	const csv = stringify(Object.entries(scores).map(([username, scores]) => ({ username, ...scores })), {
		header: true,
	});

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