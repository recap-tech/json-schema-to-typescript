#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cli_color_1 = require("cli-color");
var minimist = require("minimist");
var fs_1 = require("mz/fs");
var path_1 = require("path");
var stdin = require("stdin");
var index_1 = require("./index");
main(minimist(process.argv.slice(2), {
    alias: {
        help: ['h'],
        input: ['i'],
        output: ['o']
    }
}));
function main(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var argIn, argOut, schema, _a, _b, ts, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (argv.help) {
                        printHelp();
                        process.exit(0);
                    }
                    argIn = argv._[0] || argv.input;
                    argOut = argv._[1] || argv.output;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readInput(argIn)];
                case 2:
                    schema = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, index_1.compile(schema, argIn, argv)];
                case 3:
                    ts = _c.sent();
                    return [4 /*yield*/, writeOutput(ts, argOut)];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _c.sent();
                    console.error(cli_color_1.whiteBright.bgRedBright('error'), e_1);
                    process.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function readInput(argIn) {
    if (!argIn) {
        return new Promise(stdin);
    }
    return fs_1.readFile(path_1.resolve(process.cwd(), argIn), 'utf-8');
}
function writeOutput(ts, argOut) {
    if (!argOut) {
        try {
            process.stdout.write(ts);
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    return fs_1.writeFile(argOut, ts);
}
function printHelp() {
    var pkg = require('../../package.json');
    process.stdout.write("\n" + pkg.name + " " + pkg.version + "\nUsage: json2ts [--input, -i] [IN_FILE] [--output, -o] [OUT_FILE] [OPTIONS]\n\nWith no IN_FILE, or when IN_FILE is -, read standard input.\nWith no OUT_FILE and when IN_FILE is specified, create .d.ts file in the same directory.\nWith no OUT_FILE nor IN_FILE, write to standard output.\n\nYou can use any of the following options by adding them at the end.\nBoolean values can be set to false using the 'no-' prefix.\n\n  --cwd=XXX\n      Root directory for resolving $ref\n  --declareExternallyReferenced\n      Declare external schemas referenced via '$ref'?\n  --enableConstEnums\n      Prepend enums with 'const'?\n  --style.XXX=YYY\n      Prettier configuration\n  --unreachableDefinitions\n      Generates code for definitions that aren't referenced by the schema\n");
}
//# sourceMappingURL=cli.js.map