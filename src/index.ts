#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('git-log')
  .description('Export Git commit history')
  .option('--repo <path>', 'Path to the Git repository', '.')
  .option('--format <format>', 'Output format: json | csv | md', 'json')
  .option('--output <file>', 'Path to save the output', 'git-log-output.json')
  .action(async (options) => {
    console.log(chalk.cyan(`📦 Extracting Git logs from: ${options.repo}`));

    const git = simpleGit(options.repo);

    try {
      const log = await git.log();

      const commits = log.all.map(entry => ({
        hash: entry.hash,
        author: entry.author_name,
        email: entry.author_email,
        date: entry.date,
        message: entry.message,
      }));

      if (options.format === 'json') {
        const outputPath = path.resolve(process.cwd(), options.output);
        fs.writeFileSync(outputPath, JSON.stringify(commits, null, 2));
        console.log(chalk.green(`✅ Git logs saved to ${outputPath}`));
      } else {
        console.log(chalk.yellow(`⚠️ Format '${options.format}' not implemented yet.`));
      }
    } catch (err: any) {
      console.error(chalk.red(`❌ Error while reading git log: ${err.message}`));
    }
  });

program.parse(process.argv);
