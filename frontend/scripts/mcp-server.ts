import 'dotenv/config'; // .env를 process.cwd()에서 로드 (MCP cwd 설정값 사용)

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const server = new Server(
  { name: 'talent-db-admin', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// 사용 가능한 도구 목록
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_cells',
      description: '모든 셀 목록과 각 셀의 학생 수를 조회합니다',
      inputSchema: { type: 'object' as const, properties: {} },
    },
    {
      name: 'delete_cell',
      description: '셀 이름으로 셀과 연결된 모든 학생을 함께 삭제합니다',
      inputSchema: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: '삭제할 셀 이름' },
        },
        required: ['name'],
      },
    },
    {
      name: 'list_children',
      description: '특정 셀의 학생 목록을 조회합니다',
      inputSchema: {
        type: 'object' as const,
        properties: {
          cell_name: { type: 'string', description: '조회할 셀 이름' },
        },
        required: ['cell_name'],
      },
    },
    {
      name: 'delete_child',
      description: '학생 이름으로 학생을 삭제합니다',
      inputSchema: {
        type: 'object' as const,
        properties: {
          name: { type: 'string', description: '삭제할 학생 이름' },
          cell_name: { type: 'string', description: '학생이 속한 셀 이름 (동명이인 구분용)' },
        },
        required: ['name'],
      },
    },
    {
      name: 'reset_talents',
      description: '모든 학생 또는 특정 셀 학생들의 달란트를 0으로 초기화합니다',
      inputSchema: {
        type: 'object' as const,
        properties: {
          cell_name: { type: 'string', description: '초기화할 셀 이름 (생략 시 전체 초기화)' },
        },
      },
    },
  ],
}));

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // 셀 목록 조회
    if (name === 'list_cells') {
      const cells = await prisma.cell.findMany({ include: { children: true } });
      if (cells.length === 0) {
        return { content: [{ type: 'text', text: '등록된 셀이 없습니다.' }] };
      }
      const text = cells
        .map((c) => `• ${c.name} — 학생 ${c.children.length}명`)
        .join('\n');
      return { content: [{ type: 'text', text: `전체 셀 목록 (${cells.length}개):\n${text}` }] };
    }

    // 셀 삭제 (학생 포함 cascade)
    if (name === 'delete_cell') {
      const cellName = args?.name as string;
      const cell = await prisma.cell.findFirst({ where: { name: cellName } });

      if (!cell) {
        return {
          content: [{ type: 'text', text: `"${cellName}" 셀을 찾을 수 없습니다.` }],
        };
      }

      const childCount = await prisma.child.count({ where: { cellId: cell.id } });
      await prisma.child.deleteMany({ where: { cellId: cell.id } });
      await prisma.cell.delete({ where: { id: cell.id } });

      return {
        content: [{
          type: 'text',
          text: `삭제 완료 — "${cellName}" 셀 (학생 ${childCount}명 함께 삭제)`,
        }],
      };
    }

    // 특정 셀 학생 목록 조회
    if (name === 'list_children') {
      const cellName = args?.cell_name as string;
      const cell = await prisma.cell.findFirst({
        where: { name: cellName },
        include: { children: true },
      });

      if (!cell) {
        return { content: [{ type: 'text', text: `"${cellName}" 셀을 찾을 수 없습니다.` }] };
      }
      if (cell.children.length === 0) {
        return { content: [{ type: 'text', text: `"${cellName}" 셀에 학생이 없습니다.` }] };
      }

      const text = cell.children
        .map((c) => `• ${c.name} (${c.grade}학년, zone: ${c.zone}, 달란트: ${c.talent})`)
        .join('\n');
      return { content: [{ type: 'text', text: `"${cellName}" 셀 학생 목록:\n${text}` }] };
    }

    // 학생 삭제
    if (name === 'delete_child') {
      const childName = args?.name as string;
      const cellName = args?.cell_name as string | undefined;

      const whereClause: { name: string; cellId?: number } = { name: childName };
      if (cellName) {
        const cell = await prisma.cell.findFirst({ where: { name: cellName } });
        if (!cell) {
          return { content: [{ type: 'text', text: `"${cellName}" 셀을 찾을 수 없습니다.` }] };
        }
        whereClause.cellId = cell.id;
      }

      const children = await prisma.child.findMany({ where: whereClause });
      if (children.length === 0) {
        return { content: [{ type: 'text', text: `"${childName}" 학생을 찾을 수 없습니다.` }] };
      }

      // 동명이인 처리
      if (children.length > 1 && !cellName) {
        const cellIds = Array.from(new Set(children.map((c) => c.cellId)));
        const cells = await prisma.cell.findMany({ where: { id: { in: cellIds } } });
        const cellMap = Object.fromEntries(cells.map((c) => [c.id, c.name]));
        const list = children.map((c) => `• ${c.name} (${cellMap[c.cellId]} 셀)`).join('\n');
        return {
          content: [{
            type: 'text',
            text: `동명이인 ${children.length}명이 있습니다. cell_name을 지정해주세요:\n${list}`,
          }],
        };
      }

      await prisma.child.deleteMany({ where: whereClause });
      return { content: [{ type: 'text', text: `"${childName}" 학생 삭제 완료.` }] };
    }

    // 달란트 초기화
    if (name === 'reset_talents') {
      const cellName = args?.cell_name as string | undefined;

      if (cellName) {
        const cell = await prisma.cell.findFirst({ where: { name: cellName } });
        if (!cell) {
          return { content: [{ type: 'text', text: `"${cellName}" 셀을 찾을 수 없습니다.` }] };
        }
        const result = await prisma.child.updateMany({
          where: { cellId: cell.id },
          data: { talent: 0 },
        });
        return {
          content: [{ type: 'text', text: `"${cellName}" 셀 달란트 초기화 완료 (${result.count}명)` }],
        };
      }

      const result = await prisma.child.updateMany({ data: { talent: 0 } });
      return {
        content: [{ type: 'text', text: `전체 달란트 초기화 완료 (${result.count}명)` }],
      };
    }

    throw new Error(`알 수 없는 도구: ${name}`);
  } catch (error) {
    return {
      content: [{ type: 'text', text: `오류: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch(console.error);
