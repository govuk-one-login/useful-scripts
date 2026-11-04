# aws-costs

Prints AWS costs grouped by environment from an AWS Cost Explorer CSV file, broken down by account.

## Requirements

Node v24+ (see `.nvmrc`). If using nvm: `nvm use`

## Setup

```bash
npm install
```

## Usage

```bash
node src/index.ts run <path-to-csv>
```

For full usage info:

```bash
node src/index.ts --help
```
