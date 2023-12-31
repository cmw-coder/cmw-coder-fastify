// export const generateSchema = {
//   body: {
//     type: 'object',
//     required: [
//       'cursor',
//       'path',
//       'project',
//       'tabs',
//       'type',
//       'version',
//       'symbols',
//     ],
//     properties: {
//       cursor: {
//         type: 'object',
//         properties: {
//           start: {
//             type: 'object',
//             properties: {
//               line: { type: 'number' },
//               character: { type: 'number' },
//             },
//           },
//           end: {
//             type: 'object',
//             properties: {
//               line: { type: 'number' },
//               character: { type: 'number' },
//             },
//           },
//         },
//       },
//       path: { type: 'string' },
//       project: { type: 'string' },
//       tabs: { type: 'array', items: { type: 'string' } },
//       type: { enum: ['line', 'snippet'] },
//       version: { type: 'string' },
//       symbols: {
//         type: 'array',
//         items: {
//           type: 'object',
//           properties: {
//             name: { type: 'string' },
//             path: { type: 'string' },
//             startLine: { type: 'number' },
//             endLine: { type: 'number' },
//           },
//         },
//       },
//     },
//   },
// };
//
// export interface generateType {
//   Body: {
//     cursor: {
//       start: {
//         line: number;
//         character: number;
//       };
//       end: {
//         line: number;
//         character: number;
//       };
//     };
//     path: string;
//     project: string;
//     tabs: string[];
//     type: 'line' | 'snippet';
//     version: string;
//     symbols: {
//       name: string;
//       path: string;
//       startLine: number;
//       endLine: number;
//     }[];
//   };
// }

export const acceptSchema = {
  body: {
    type: 'object',
    required: ['completion', 'projectId', 'version'],
    properties: {
      completion: {
        type: 'string',
      },
      projectId: {
        type: 'string',
      },
      version: {
        type: 'string',
      },
    },
  },
};

export interface acceptType {
  Body: {
    completion: string;
    projectId: string;
    version: string;
  };
}

export const generateSchema = {
  body: {
    type: 'object',
    required: [
      'cursorString',
      'path',
      'prefix',
      'projectId',
      'suffix',
      'symbolString',
      'tabString',
      'version',
    ],
    properties: {
      cursorString: {
        type: 'string',
      },
      path: {
        type: 'string',
      },
      prefix: {
        type: 'string',
      },
      projectId: {
        type: 'string',
      },
      suffix: {
        type: 'string',
      },
      symbolString: {
        type: 'string',
      },
      tabString: {
        type: 'string',
      },
      version: {
        type: 'string',
      },
    },
  },
};

export interface generateType {
  Body: {
    cursorString: string;
    path: string;
    prefix: string;
    projectId: string;
    suffix: string;
    symbolString: string;
    tabString: string;
    version: string;
  };
}
