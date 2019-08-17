"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.input = {
    "title": "Example Schema",
    "description": 'My cool schema',
    type: "object",
    properties: {
        value: {
            "type": ["number", "string"]
        },
        anotherValue: {
            type: ['null', 'string']
        }
    },
    required: ['value']
};
//# sourceMappingURL=disjointType.js.map