#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import os from 'os';

const program = new Command();

program
  .name('git-log')
  .description('Export Git commit history from local or remote repositories')
  .version('1.0.0')
  .option('--repo <path>', 'Path to Git repository or remote URL', '.')
  .option('--format <format>', 'Output format: json | csv | md', 'json')
  .option('--output <file>', 'Path to save the output', '')
  .option('--keep-temp', 'Keep temporary cloned repositories (for debugging)')
  .action(async (options) => {
    let repoPath = options.repo;
    let isRemoteRepo = false;
    let tempRepoPath = '';

    console.log(chalk.cyan(`📦 Processing repository: ${repoPath}`));

    try {
      // Check if it's a remote repository
      isRemoteRepo = repoPath.startsWith('http://') || repoPath.startsWith('https://') || repoPath.startsWith('git@');

      if (isRemoteRepo) {
        // Extract repository name from URL
        const repoName = path.basename(repoPath.replace('.git', ''));
        const tempDir = path.join(os.tmpdir(), 'thrylo-git-log');
        tempRepoPath = path.join(tempDir, `${repoName}-${Date.now()}`);

        console.log(chalk.yellow(`🌐 Cloning remote repository...`));
        console.log(chalk.gray(`   Source: ${repoPath}`));
        console.log(chalk.gray(`   Target: ${tempRepoPath}`));

        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        // Clone the repository
        const gitBase = simpleGit();
        await gitBase.clone(repoPath, tempRepoPath);
        
        repoPath = tempRepoPath; // NOW use the local path
        console.log(chalk.green(`✅ Repository cloned successfully`));
      }

      // Now work with the local repository (either original local or cloned)
      const git = simpleGit(repoPath);

      // Validate it's a Git repository
      const isValid = await git.checkIsRepo();
      if (!isValid) {
        throw new Error(`Not a valid Git repository: ${repoPath}`);
      }

      console.log(chalk.blue(`📊 Extracting commit history...`));

      // Get git log
      const log = await git.log();
      
      if (log.all.length === 0) {
        console.log(chalk.yellow(`⚠️ No commits found in repository`));
        return;
      }

      console.log(chalk.blue(`📈 Found ${log.all.length} commits`));

      // Transform commit data
      const commits = log.all.map(entry => ({
        hash: entry.hash,
        author: entry.author_name,
        email: entry.author_email,
        date: entry.date,
        message: entry.message,
      }));

      // Generate output filename
      const repoBaseName = isRemoteRepo 
        ? path.basename(options.repo.replace('.git', ''))
        : path.basename(path.resolve(repoPath));
      
      const outputBaseName = options.output
        ? options.output.replace(/\.\w+$/, '')
        : `git-log-${repoBaseName}`;
      
      const outputPath = path.resolve(process.cwd(), `${outputBaseName}.${options.format}`);

      // Export based on format
      if (options.format === 'json') {
        const exportData = {
          repository: isRemoteRepo ? options.repo : repoPath,
          exportDate: new Date().toISOString(),
          totalCommits: commits.length,
          commits
        };
        
        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
        console.log(chalk.green(`✅ Git logs exported as JSON to: ${outputPath}`));
        
      } else if (options.format === 'csv') {
        const csvWriter = createObjectCsvWriter({
          path: outputPath,
          header: [
            { id: 'hash', title: 'Commit Hash' },
            { id: 'author', title: 'Author' },
            { id: 'email', title: 'Email' },
            { id: 'date', title: 'Date' },
            { id: 'message', title: 'Message' }
          ]
        });
        
        await csvWriter.writeRecords(commits);
        console.log(chalk.green(`✅ Git logs exported as CSV to: ${outputPath}`));
        
      } else if (options.format === 'md') {
        // Basic Markdown export
        const mdContent = [
          `# Git Commit History - ${repoBaseName}`,
          ``,
          `**Repository:** ${isRemoteRepo ? options.repo : repoPath}`,
          `**Export Date:** ${new Date().toISOString()}`,
          `**Total Commits:** ${commits.length}`,
          ``,
          `## Commits`,
          ``,
          ...commits.map(commit => [
            `### ${commit.hash}`,
            ``,
            `- ${commit.message}`,
            ``,
            `**Author:** ${commit.author} (${commit.email})`,
            ``,
            `**Date:** ${commit.date}`,
            ``,
            `---`,
          ].join('\n'))
          
        ].join('\n');
        
        fs.writeFileSync(outputPath, mdContent);
        console.log(chalk.green(`✅ Git logs exported as Markdown to: ${outputPath}`));
        
      } else {
        throw new Error(`Unsupported format: ${options.format}. Supported formats: json, csv, md`);
      }

      console.log(chalk.gray(`📋 Summary: ${commits.length} commits exported from ${isRemoteRepo ? 'remote' : 'local'} repository`));

    } catch (err: any) {
      console.error(chalk.red(`❌ Error: ${err.message}`));
      process.exit(1);
      
    } finally {
      // Clean up temporary repository unless --keep-temp is specified
      if (isRemoteRepo && tempRepoPath && !options.keepTemp) {
        try {
          if (fs.existsSync(tempRepoPath)) {
            fs.rmSync(tempRepoPath, { recursive: true, force: true });
            console.log(chalk.gray(`🧹 Cleaned up temporary repo: ${tempRepoPath}`));
          }
        } catch (error) {
          console.warn(chalk.yellow(`⚠️ Could not clean up temporary repo: ${tempRepoPath}`));
        }
      }
    }
  });

program.parse(process.argv);