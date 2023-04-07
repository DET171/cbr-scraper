#!/usr/bin/env node
import got from 'got';
import jsdom from 'jsdom';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
	.option('usernames', {
		alias: 'u',
		type: 'array',
		description: 'List of usernames to fetch',
	})
	.demandOption(['usernames'])
	.help()
	.argv;


console.log('==================CBR SCORE FETCHER==================');