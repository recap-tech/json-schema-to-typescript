"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_color_1 = require("cli-color");
var lodash_1 = require("lodash");
var path_1 = require("path");
// TODO: pull out into a separate package
function Try(fn, err) {
    try {
        return fn();
    }
    catch (e) {
        return err(e);
    }
}
exports.Try = Try;
/**
 * Depth-first traversal
 */
function dft(object, cb) {
    for (var key in object) {
        if (!object.hasOwnProperty(key))
            continue;
        if (lodash_1.isPlainObject(object[key]))
            dft(object[key], cb);
        cb(object[key], key);
    }
}
exports.dft = dft;
function mapDeep(object, fn, key) {
    return fn(lodash_1.mapValues(object, function (_, key) {
        if (lodash_1.isPlainObject(_)) {
            return mapDeep(_, fn, key);
        }
        else if (Array.isArray(_)) {
            return _.map(function (item) {
                if (lodash_1.isPlainObject(item)) {
                    return mapDeep(item, fn, key);
                }
                return item;
            });
        }
        return _;
    }), key);
}
exports.mapDeep = mapDeep;
// keys that shouldn't be traversed by the catchall step
var BLACKLISTED_KEYS = new Set([
    'id',
    '$schema',
    'title',
    'description',
    'default',
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'additionalItems',
    'items',
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxProperties',
    'minProperties',
    'required',
    'additionalProperties',
    'definitions',
    'properties',
    'patternProperties',
    'dependencies',
    'enum',
    'type',
    'allOf',
    'anyOf',
    'oneOf',
    'not'
]);
function traverseObjectKeys(obj, callback) {
    Object.keys(obj).forEach(function (k) {
        if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            traverse(obj[k], callback);
        }
    });
}
function traverseArray(arr, callback) {
    arr.forEach(function (i) { return traverse(i, callback); });
}
function traverse(schema, callback) {
    callback(schema);
    if (schema.anyOf) {
        traverseArray(schema.anyOf, callback);
    }
    if (schema.allOf) {
        traverseArray(schema.allOf, callback);
    }
    if (schema.oneOf) {
        traverseArray(schema.oneOf, callback);
    }
    if (schema.properties) {
        traverseObjectKeys(schema.properties, callback);
    }
    if (schema.patternProperties) {
        traverseObjectKeys(schema.patternProperties, callback);
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        traverse(schema.additionalProperties, callback);
    }
    if (schema.items) {
        var items = schema.items;
        if (Array.isArray(items)) {
            traverseArray(items, callback);
        }
        else {
            traverse(items, callback);
        }
    }
    if (schema.additionalItems && typeof schema.additionalItems === 'object') {
        traverse(schema.additionalItems, callback);
    }
    if (schema.dependencies) {
        traverseObjectKeys(schema.dependencies, callback);
    }
    if (schema.definitions) {
        traverseObjectKeys(schema.definitions, callback);
    }
    if (schema.not) {
        traverse(schema.not, callback);
    }
    // technically you can put definitions on any key
    Object.keys(schema).filter(function (key) { return !BLACKLISTED_KEYS.has(key); }).forEach(function (key) {
        var child = schema[key];
        if (child && typeof child === 'object') {
            traverseObjectKeys(child, callback);
        }
    });
}
exports.traverse = traverse;
/**
 * Eg. `foo/bar/baz.json` => `baz`
 */
function justName(filename) {
    if (filename === void 0) { filename = ''; }
    return stripExtension(path_1.basename(filename));
}
exports.justName = justName;
/**
 * Avoid appending "js" to top-level unnamed schemas
 */
function stripExtension(filename) {
    return filename.replace(path_1.extname(filename), '');
}
exports.stripExtension = stripExtension;
/**
 * Convert a string that might contain spaces or special characters to one that
 * can safely be used as a TypeScript interface or enum name.
 */
function toSafeString(string) {
    // identifiers in javaScript/ts:
    // First character: a-zA-Z | _ | $
    // Rest: a-zA-Z | _ | $ | 0-9
    return lodash_1.upperFirst(
    // remove accents, umlauts, ... by their basic latin letters
    lodash_1.deburr(string)
        // replace chars which are not valid for typescript identifiers with whitespace
        .replace(/(^\s*[^a-zA-Z_$])|([^a-zA-Z_$\d])/g, ' ')
        // uppercase leading underscores followed by lowercase
        .replace(/^_[a-z]/g, function (match) { return match.toUpperCase(); })
        // remove non-leading underscores followed by lowercase (convert snake_case)
        .replace(/_[a-z]/g, function (match) { return match.substr(1, match.length).toUpperCase(); })
        // uppercase letters after digits, dollars
        .replace(/([\d$]+[a-zA-Z])/g, function (match) { return match.toUpperCase(); })
        // uppercase first letter after whitespace
        .replace(/\s+([a-zA-Z])/g, function (match) { return lodash_1.trim(match.toUpperCase()); })
        // remove remaining whitespace
        .replace(/\s/g, ''));
}
exports.toSafeString = toSafeString;
function generateName(from, usedNames) {
    var name = toSafeString(from);
    // increment counter until we find a free name
    if (usedNames.has(name)) {
        var counter = 1;
        while (usedNames.has(name)) {
            name = "" + toSafeString(from) + counter;
            counter++;
        }
    }
    usedNames.add(name);
    return name;
}
exports.generateName = generateName;
function error() {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    console.error.apply(console, [cli_color_1.whiteBright.bgRedBright('error')].concat(messages));
}
exports.error = error;
function log() {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    if (process.env.VERBOSE) {
        console.info.apply(console, [cli_color_1.whiteBright.bgCyan('debug')].concat(messages));
    }
}
exports.log = log;
/**
 * escape block comments in schema descriptions so that they don't unexpectedly close JSDoc comments in generated typescript interfaces
 */
function escapeBlockComment(schema) {
    var replacer = '* /';
    if (schema === null || typeof schema !== 'object') {
        return;
    }
    for (var _i = 0, _a = Object.keys(schema); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key === 'description' && typeof schema[key] === 'string') {
            schema[key] = schema[key].replace(/\*\//g, replacer);
        }
    }
}
exports.escapeBlockComment = escapeBlockComment;
//# sourceMappingURL=utils.js.map