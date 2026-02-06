#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Intercom Article 型別
interface IntercomArticle {
  id: string;
  title: string;
  description?: string;
  body?: string;
  author_id: number;
  state: 'draft' | 'published';
  created_at: number;
  updated_at: number;
}

// List 回應型別
interface ListArticlesResponse {
  type: 'list';
  data: IntercomArticle[];
  pages?: {
    page: number;
    per_page: number;
    total_pages: number;
  };
}

// 從環境變數取得 token
const INTERCOM_TOKEN = process.env.INTERCOM_ACCESS_TOKEN;
const INTERCOM_API_BASE = 'https://api.intercom.io';

/**
 * 呼叫 Intercom API
 */
async function callIntercomAPI(endpoint: string): Promise<any> {
  const response = await fetch(`${INTERCOM_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${INTERCOM_TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Intercom-Version': '2.11'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Intercom API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * 建立 MCP Server
 */
const server = new Server({
  name: 'intercom-articles-mcp',
  version: '0.1.0'
}, {
  capabilities: {
    tools: {}
  }
});

/**
 * 註冊工具列表
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_article',
        description: 'Get a single Intercom article by ID. Returns full article details including title, body, author, and state.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The article ID (e.g., "123456")'
            }
          },
          required: ['id']
        }
      },
      {
        name: 'list_articles',
        description: 'List Intercom articles with pagination. Returns a list of articles with basic information.',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Page number (default: 1)',
              default: 1
            },
            per_page: {
              type: 'number',
              description: 'Number of articles per page (default: 10, max: 50)',
              default: 10
            }
          }
        }
      }
    ]
  };
});

/**
 * 註冊工具呼叫處理
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_article') {
      const { id } = args as { id: string };

      if (!id) {
        throw new Error('Article ID is required');
      }

      const article = await callIntercomAPI(`/articles/${id}`);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(article, null, 2)
        }]
      };
    }

    if (name === 'list_articles') {
      const { page = 1, per_page = 10 } = args as {
        page?: number;
        per_page?: number;
      };

      // 確保參數在合理範圍內
      const validPage = Math.max(1, Math.floor(page));
      const validPerPage = Math.min(50, Math.max(1, Math.floor(per_page)));

      const data: ListArticlesResponse = await callIntercomAPI(
        `/articles?page=${validPage}&per_page=${validPerPage}`
      );

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2)
        }]
      };
    }

    throw new Error(`Unknown tool: ${name}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{
        type: 'text',
        text: `Error: ${errorMessage}`
      }],
      isError: true
    };
  }
});

/**
 * 主函數
 */
async function main() {
  // 檢查環境變數
  if (!INTERCOM_TOKEN) {
    console.error('Error: INTERCOM_ACCESS_TOKEN environment variable is required');
    console.error('Please set it in your MCP configuration or environment');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // 使用 stderr 輸出（stdio 協定使用 stdout）
  console.error('Intercom Articles MCP Server v0.1.0');
  console.error('Running on stdio transport');
  console.error('Tools available: get_article, list_articles');
}

// 啟動伺服器
main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
