# GitHub File Search Tool

A bash script to search for specific files across all repositories in a GitHub organization with configurable filtering options.

## Purpose

This tool helps organizations enforce policies by discovering files across their repositories. For example:
- Finding repositories missing required documentation (`README.md`, `SECURITY.md`)
- Locating configuration files (`dependabot.yml`, `.tsconfig`)
- Auditing compliance files across the organization

## Dependencies

- **Required**: `curl` - [Install here](https://curl.se/)
- **Optional**: 
  - `gh` (GitHub CLI) - [Install here](https://cli.github.com/) - For fallback authentication
  - `jq` (JSON processor) - [Install here](https://jqlang.github.io/jq/) - Only needed for `--json` output

## Authentication

This tool uses GitHub fine-grained personal access tokens and follows this authentication order:

1. **Tests API access first** - Checks if GitHub API is accessible (sbx may handle this automatically)
2. **Environment variable** - `GH_FILE_SEARCH_TOKEN` 
3. **Config file** - `~/.config/gh-file-search/token`
4. **GitHub CLI fallback** - Only with `--use-gh-cli` flag

### Setting up a fine-grained token

1. Go to: https://github.com/settings/personal-access-tokens/new
2. Fill in the form:
   - **Token name**: `gh-file-search-YYYYMMDD`
   - **Description**: `File search tool for [your-org] organization`
   - **Resource owner**: Select your target organization
   - **Expiration**: 7 days (or as needed)
   - **Repository access**: All repositories
3. Set **Repository permissions**:
   - **Contents**: Read
   - **Metadata**: Read
   - **Custom properties**: Read (required for `--custom-property` filtering)
4. Generate token and set environment variable:
   ```bash
   export GH_FILE_SEARCH_TOKEN="your_token_here"
   ```

### Alternative authentication methods

- **sbx secrets**: `sbx secret set-custom work-useful-scripts --host api.github.com --env GH_FILE_SEARCH_TOKEN --value <token>`
- **Config file**: Store in `~/.config/gh-file-search/token` (600 permissions)
- **GitHub CLI**: Use `--use-gh-cli` flag (requires `gh auth login`)

### Token storage options

```bash
# Environment variable (recommended)
export GH_FILE_SEARCH_TOKEN="your_token"

# sbx custom secrets (for sandbox environments)
sbx secret set-custom work-useful-scripts --host api.github.com --env GH_FILE_SEARCH_TOKEN --value "your_token"

# Config file (atomic write for security)
mkdir -p ~/.config/gh-file-search
umask 077  # Ensure secure permissions
temp_file=$(mktemp ~/.config/gh-file-search/token.XXXXXX)
echo "your_token" > "$temp_file" && mv "$temp_file" ~/.config/gh-file-search/token
```

## Usage

```bash
./gh-file-search FILENAME --org ORG [OPTIONS]
```

### Options

- `--org ORG` - GitHub organization name (required)
- `--depth DEPTH` - Search depth: `root_only` (default), `recursive` 
- `--visibility LEVEL` - Filter by repository visibility (`private`, `public`, `internal`)
- `--custom-property KEY=VALUE` - Filter by custom repository properties (can be used multiple times)
- `--limit N` - Limit number of repositories to process (useful for testing)
- `--json` - Output results as JSON instead of table format
- `--output FILE` - Write JSON results to file (implies `--json`)
- `--use-gh-cli` - Use GitHub CLI authentication instead of fine-grained token
- `--debug` - Show debug information for troubleshooting
- `--help` - Show help message

## Examples

### Basic Usage

Search for README.md files in all repositories:
```bash
./gh-file-search README.md --org my-organization
```

Search recursively for TypeScript config files:
```bash
./gh-file-search tsconfig.json --org my-organization --depth recursive
```

### Filtering by Visibility

Search only private repositories:
```bash
./gh-file-search SECURITY.md --org my-organization --visibility private
```

Search only public repositories:
```bash
./gh-file-search LICENSE --org my-organization --visibility public
```

### Using Custom Properties

Filter by a single custom property:
```bash
./gh-file-search README.md --org my-organization --custom-property team=platform
```

Filter by multiple custom properties:
```bash
./gh-file-search dependabot.yml --org my-organization \
  --custom-property team=security \
  --custom-property compliance=required \
  --custom-property environment=production
```

Combine visibility and custom property filters:
```bash
./gh-file-search .github/workflows/ci.yml --org my-organization \
  --visibility private \
  --custom-property team=devops \
  --depth recursive
```

### Testing and Development

Test with a limited number of repositories:
```bash
./gh-file-search README.md --org my-organization --limit 5
```

### Pipeline Usage

Output JSON for processing by other tools:
```bash
./gh-file-search README.md --org my-organization --json > results.json
```

Save results directly to a file:
```bash
./gh-file-search README.md --org my-organization --output results.json
```

Pipe to validation scripts:
```bash
./gh-file-search README.md --org my-organization --json | ./gh-readme-validate
```

## Output Formats

### Table Format (Default)

```
File Search Results for my-org

REPOSITORY     VISIBILITY  FILE LINKS
project-alpha  private     https://github.com/my-org/project-alpha/blob/main/README.md
project-beta   public      https://github.com/my-org/project-beta/blob/main/README.md<br>https://github.com/my-org/project-beta/blob/main/docs/README.md

Found 2 files
```

Note: Multiple files in the same repository are separated by `<br>` in table format, and shown as arrays in JSON format.

### JSON Format

```json
[
  {
    "repository": "my-org/project-alpha",
    "visibility": "private",
    "file_links": [
      "https://github.com/my-org/project-alpha/blob/main/README.md"
    ],
    "custom_properties": {}
  },
  {
    "repository": "my-org/project-beta", 
    "visibility": "public",
    "file_links": [
      "https://github.com/my-org/project-beta/blob/main/README.md",
      "https://github.com/my-org/project-beta/blob/main/docs/README.md"
    ],
    "custom_properties": {}
  }
]
```

## Notes

- **Custom Properties**: This feature requires GitHub Enterprise. The script includes placeholder support and will be enhanced when the GitHub API provides access to custom repository properties.
- **Authentication**: Script handles authentication via fine-grained tokens or sbx network-level auth. GitHub CLI is optional fallback.
- **Rate Limiting**: Built-in timeouts and error handling for API rate limits.
- **Default Branch**: File links assume the default branch is `main`. The script could be enhanced to detect the actual default branch.
- **sbx Integration**: When running in sbx environments, network-level authentication may be handled automatically.

## Common Use Cases

1. **Compliance Auditing**: Find all repositories missing required security documentation
2. **Configuration Management**: Locate and validate configuration files across projects  
3. **Policy Enforcement**: Identify repositories that need specific files added
4. **Migration Planning**: Discover legacy configuration files that need updating

## Error Handling

The script will exit with helpful error messages if:
- Required dependencies are missing
- GitHub authentication is not configured
- Invalid command line arguments are provided
- The specified organization cannot be accessed