#!/usr/bin/env node

// Imports
import got from 'got';
import { JSDOM } from 'jsdom';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import console from 'consola';
import stdConsole from 'console';

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
		console.info(chalk.yellow(`  Fetching ${username}'s submissions for ${problem}`));

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

// Print scores object


if (outputFormat === 'stdout') {
	stdConsole.table(scores);
}
else if (outputFormat === 'csv') {
	console.error('Not implemented yet!');
}