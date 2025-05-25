<div align="center">

# 🔧 @thrylolabs/git-log

**A modular CLI tool to extract and export Git commit history**

[![npm version](https://img.shields.io/npm/v/@thrylolabs/git-log.svg)](https://www.npmjs.com/package/@thrylolabs/git-log)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

*Transform your Git history into beautiful, structured data formats*

</div>

---

## ✨ Features

🔹 **Multi-format Export** - JSON, CSV, and Markdown outputs  
🔹 **Remote Repository Support** - Clone and analyze any GitHub repository  
🔹 **Local Repository Analysis** - Process any local Git repository  
🔹 **Smart Cleanup** - Automatic temporary file management  
🔹 **TypeScript Powered** - Full type safety and modern ES modules  
🔹 **Zero Configuration** - Works out of the box with sensible defaults  

## 🚀 Quick Start

### Installation
```bash
npm install -g @thrylolabs/git-log
```

### Basic Usage
```bash
# Export current repository as JSON
thrylo-git-log

# Export as CSV
thrylo-git-log --format csv

# Analyze remote repository
thrylo-git-log --repo https://github.com/user/repo.git --format csv

# Custom output location
thrylo-git-log --format json --output ./reports/commits
```

## 📊 Output Formats

### JSON
```json
{
  "repository": "/path/to/repo",
  "exportDate": "2024-01-15T10:30:00.000Z",
  "totalCommits": 150,
  "commits": [
    {
      "hash": "a1b2c3d4e5f6",
      "author": "Jane Developer",
      "email": "jane@example.com",
      "date": "2024-01-15T09:15:00.000Z",
      "message": "Add user authentication feature"
    }
  ]
}
```

### CSV
| Commit Hash | Author | Email | Date | Message |
|-------------|--------|-------|------|---------|
| a1b2c3d4e5f6 | Jane Developer | jane@example.com | 2024-01-15T09:15:00.000Z | Add user authentication feature |

### Markdown
```markdown
# Git Commit History - my-project

**Repository:** /path/to/repo  
**Total Commits:** 150

## Commits

### a1b2c3d4e5f6

- Add user authentication feature

**Author:** Jane Developer (jane@example.com)  
**Date:** 2024-01-15T09:15:00.000Z
```

## 🛠️ Command Options

| Option | Description | Default |
|--------|-------------|---------|
| `--repo <path>` | Local path or remote Git URL | `.` |
| `--format <format>` | Output format: `json`, `csv`, `md` | `json` |
| `--output <file>` | Output file path | `git-log-{repo-name}` |
| `--keep-temp` | Keep cloned repositories for debugging | `false` |

## 💡 Use Cases

- **📈 Analytics** - Analyze commit patterns and contributor activity
- **📋 Changelogs** - Generate structured changelogs for releases
- **🔍 Auditing** - Export commit history for compliance and review
- **📊 Reporting** - Create development reports and metrics
- **🤖 Automation** - Integrate with CI/CD pipelines and scripts

## 🌐 Remote Repository Support

Works seamlessly with any public Git repository:

```bash
# GitHub repositories
thry git-log --repo https://github.com/microsoft/vscode.git --format csv

# GitLab repositories  
thry git-log --repo https://gitlab.com/user/project.git --format json

```

## 🏗️ Part of Thrylo Ecosystem

This tool is designed as a modular component of the **Thrylo CLI ecosystem**. Future integration:

```bash
# Coming soon
thry install git-log
thry git-log --format csv --since "2024-01-01"
```

## 🛠️ Development

```bash
# Clone and setup
git clone https://github.com/thrylolabs/git-log.git
cd git-log
npm install

# Build and test
npm run build
npm link
thrylo-git-log --format json
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐛 **Bug Reports** - [Open an issue](https://github.com/thrylolabs/git-log/issues)
- 💡 **Feature Requests** - Share your ideas in [discussions](https://github.com/thrylolabs/git-log/discussions)
- 🔧 **Pull Requests** - Contribute code improvements
- 📖 **Documentation** - Help improve our docs

### Development Stack
- **TypeScript** for type safety
- **Commander** for CLI argument parsing  
- **simple-git** for Git operations
- **chalk** for beautiful terminal output

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Thrylo Labs](https://github.com/thrylolabs)**

[🌟 Star this project](https://github.com/thrylolabs/git-log) • [🐛 Report Bug](https://github.com/thrylolabs/git-log/issues) • [💡 Request Feature](https://github.com/thrylolabs/git-log/discussions)

</div>
