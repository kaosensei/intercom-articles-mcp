# Intercom Articles MCP Server

A Model Context Protocol (MCP) server for reading and writing Intercom Help Center articles.

## Version

**v0.2.0** - Full CRUD functionality with multilingual support

## Features

- ✅ `get_article` - Get a single article by ID
- ✅ `list_articles` - List articles with pagination
- ✅ `create_article` - Create new articles with multilingual content
- ✅ `update_article` - Update existing articles with partial updates

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kaosensei/intercom-articles-mcp.git
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
3. Get an Access Token with **Articles** read and write permissions

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
List Intercom articles
```

or

```
Show me the first 20 Intercom articles
```

### Get Article Details
```
Get Intercom article with ID 9876543
```

### Create Article
```
Create a new Intercom article titled "Getting Started Guide" with content "Welcome to our platform" by author ID 123456, save as draft
```

### Update Article
```
Update article 9876543 and change its state to published
```

## Tools Reference

### `get_article`

Get a single article by ID.

**Parameters:**
- `id` (string, required): Article ID

**Example:**
```json
{
  "id": "9876543"
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

### `create_article`

Create a new article with multilingual support.

**Parameters:**
- `title` (string, required): Article title
- `body` (string, required): Article content in HTML format
- `author_id` (number, required): Author ID (must be a valid Intercom team member)
- `description` (string, optional): Article description
- `state` (string, optional): "draft" or "published" (default: "draft")
- `parent_id` (string, optional): Collection or section ID
- `parent_type` (string, optional): "collection" (default)
- `translated_content` (object, optional): Multilingual content

**Example (Simple):**
```json
{
  "title": "Getting Started Guide",
  "body": "<p>Welcome to our platform</p>",
  "author_id": 123456,
  "state": "draft"
}
```

**Example (Multilingual):**
```json
{
  "title": "Getting Started Guide",
  "body": "<p>Welcome to our platform</p>",
  "author_id": 123456,
  "state": "published",
  "translated_content": {
    "zh-TW": {
      "title": "入門指南",
      "body": "<p>歡迎使用我們的平台</p>",
      "author_id": 123456,
      "state": "published"
    },
    "ja": {
      "title": "スタートガイド",
      "body": "<p>プラットフォームへようこそ</p>",
      "author_id": 123456,
      "state": "published"
    }
  }
}
```

### `update_article`

Update an existing article. Only provided fields will be updated.

**Parameters:**
- `id` (string, required): Article ID
- `title` (string, optional): Updated title
- `body` (string, optional): Updated content
- `description` (string, optional): Updated description
- `state` (string, optional): "draft" or "published"
- `author_id` (number, optional): Updated author ID
- `translated_content` (object, optional): Updated translations

**Example (Change state):**
```json
{
  "id": "9876543",
  "state": "published"
}
```

**Example (Update content):**
```json
{
  "id": "9876543",
  "title": "Updated Title",
  "body": "<p>Updated content</p>"
}
```

**Example (Add translation):**
```json
{
  "id": "9876543",
  "translated_content": {
    "zh-TW": {
      "title": "更新的標題",
      "body": "<p>更新的內容</p>"
    }
  }
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

Future versions may include:

- ✅ Create Article (v0.2.0)
- ✅ Update Article (v0.2.0)
- ✅ Multilingual support (v0.2.0)
- 🔜 Delete Article
- 🔜 Search Articles
- 🔜 Better error handling
- 🔜 Modular file structure

## Resources

- [Intercom Articles API](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/articles)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Documentation](https://modelcontextprotocol.io/)

## License

MIT
