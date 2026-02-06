# Intercom Articles MCP Server

A Model Context Protocol (MCP) server for reading Intercom Help Center articles.

## Version

**v0.1.0 MVP** - Read-only functionality

## Features

- ✅ `get_article` - Get a single article by ID
- ✅ `list_articles` - List articles with pagination

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/intercom-articles-mcp.git
cd intercom-articles-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### Get Intercom Access Token

1. Go to Intercom Settings → Developers → Developer Hub
2. Create a new app or use existing one
3. Get an Access Token with **Articles** read permissions

### Configure Claude Desktop

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "intercom-articles": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/intercom-articles-mcp/dist/index.js"
      ],
      "env": {
        "INTERCOM_ACCESS_TOKEN": "your_intercom_access_token_here"
      }
    }
  }
}
```

**Important**:
- Replace `/ABSOLUTE/PATH/TO/intercom-articles-mcp` with your actual project path
- Replace `your_intercom_access_token_here` with your actual token

### Restart Claude Desktop

Completely quit Claude Desktop and restart it.

## Usage

Once configured, you can use these commands in Claude Desktop:

### List Articles
```
請列出 Intercom 的文章
```

or

```
Show me the first 20 Intercom articles
```

### Get Article Details
```
請顯示 Intercom 文章 123456 的內容
```

(Replace `123456` with actual article ID)

## Tools Reference

### `get_article`

Get a single article by ID.

**Parameters:**
- `id` (string, required): Article ID

**Example:**
```json
{
  "id": "123456"
}
```

### `list_articles`

List articles with pagination.

**Parameters:**
- `page` (number, optional): Page number (default: 1)
- `per_page` (number, optional): Articles per page (default: 10, max: 50)

**Example:**
```json
{
  "page": 1,
  "per_page": 20
}
```

## Development

### Build
```bash
npm run build
```

### Watch mode
```bash
npm run watch
```

## Troubleshooting

### Claude Desktop doesn't show the tools

1. Check config file path is correct
2. Verify JSON format (no trailing commas)
3. Completely restart Claude Desktop
4. Check absolute path to `dist/index.js`

### API errors

1. Verify your Access Token is correct
2. Ensure token has Articles read permissions
3. Check Intercom API status

### Build errors

1. Ensure TypeScript version >= 5.0
2. Delete `node_modules` and `dist`, then:
```bash
npm install && npm run build
```

## Project Structure

```
intercom-articles-mcp/
├── package.json           # Project configuration
├── tsconfig.json          # TypeScript configuration
├── src/
│   └── index.ts           # Main server code
├── dist/                  # Compiled output
└── README.md             # This file
```

## Roadmap

Future versions (v0.2+) may include:

- Create Article
- Update Article
- Delete Article
- Better error handling
- Modular file structure

## Resources

- [Intercom Articles API](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/articles)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Documentation](https://modelcontextprotocol.io/)

## License

MIT
