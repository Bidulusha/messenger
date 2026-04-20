(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/ts-markdown-parser/dist/libs/javascript/keywords.js
  var require_keywords = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/javascript/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.tsTypes = exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "instanceof",
        "break",
        "case",
        "catch",
        "class",
        "const",
        "continue",
        "debugger",
        "default",
        "delete",
        "else",
        "export",
        "extends",
        "finally",
        "function",
        "import",
        "return",
        "super",
        "switch",
        "this",
        "throw",
        "typeof",
        "type",
        "from",
        "void",
        "while",
        "with",
        "yield",
        "await",
        "async",
        "enum",
        "implements",
        "interface",
        "package",
        "private",
        "protected",
        "public",
        "static",
        "super",
        "readonly",
        "try",
        "var",
        "if",
        "let",
        "new",
        "for",
        "in",
        "do"
      ];
      exports.tsTypes = [
        ": number",
        ": string",
        ": boolean",
        ": void",
        ": null",
        ": undefined",
        ": any",
        ": unknown",
        ": never",
        ": object",
        ": Array<T>",
        // or T[]
        ": Tuple<T1, T2, ...>",
        // For tuple types
        ": Function",
        // General function type
        ": Promise<T>",
        // For promise types
        ": RegExp",
        // Regular expression type
        ": Symbol",
        // Symbol type
        ": bigint",
        // BigInt type
        ": Date",
        // Date object type
        ": Set<T>",
        // Set type
        ": Map<K, V>",
        // Map type
        ": WeakSet<T>",
        // WeakSet type
        ": WeakMap<K, V>",
        // WeakMap type
        ": ReadonlyArray<T>",
        // Read-only array type
        ": Readonly<T>"
        // Read-only type
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/javascript/highlight.js
  var require_highlight = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/javascript/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightJavaScript = void 0;
      var keywords_1 = require_keywords();
      var markdown_parser_1 = require_markdown_parser();
      var highlightJavaScript = (code) => {
        const hasOpenComment = /\/\*/g.test(code);
        const hasCloseComment = /\*\//g.test(code);
        if (hasOpenComment && !hasCloseComment || !hasOpenComment && hasCloseComment) {
          return code;
        }
        code = code.replace(/</g, "\uFF1C").replace(/>/g, "\uFF1E");
        const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
        let highlighted = code.replace(commentRegex, '<span class="md-comment">$1</span>');
        highlighted = highlighted.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
          if (match.startsWith('<span class="md-comment">'))
            return match;
          const stringLine = `<span class="md-string">${p1}${p2}${p3}</span>`;
          return stringLine;
        });
        const mdCommentSpan = `<span class="md-comment">`;
        let commentPart = "";
        if (highlighted.includes(mdCommentSpan)) {
          const splitLine = highlighted.split(mdCommentSpan);
          if (splitLine.length > 1) {
            if (splitLine[0].includes(mdCommentSpan)) {
              return highlighted;
            } else {
              highlighted = splitLine[0];
              commentPart = mdCommentSpan + splitLine[1];
            }
          } else {
            return highlighted;
          }
        }
        const regexEqualsPattern = /=([\s+]?\/.*\/[gimuy]*;)/g;
        highlighted = highlighted.replace(regexEqualsPattern, '=<span class="md-regex">$1</span>');
        const regexTestPattern = /([\s+]?\/.*\/[gimuy]*).test/g;
        highlighted = highlighted.replace(regexTestPattern, '<span class="md-regex">$1</span>.test');
        const blockCommentRegex = /\/\*(.*)\*\//g;
        highlighted = highlighted.replace(blockCommentRegex, `<span class="md-comment">&sol;&ast;$1&ast;&sol;</span>`);
        const decoratorRegex = /(^|\s)@[\w]+/gm;
        highlighted = highlighted.replace(decoratorRegex, '<span class="md-decorator">$&</span>');
        const arrowFuncRegex = /(\w+)\s*=\s*\(([^)]+)\)/gi;
        highlighted = highlighted.replace(arrowFuncRegex, '<span class="md-special">$1</span> = ($2)');
        const declareFuncRegexWithSpace = /(\w+\s+[if]) \s*\(([^)]*)\)/gi;
        highlighted = highlighted.replace(declareFuncRegexWithSpace, '<span class="md-special">$1</span> ($2)');
        const elseIfRegex = /(if+|else\sif+)\s*\(([^)]*)\)/g;
        highlighted = highlighted.replace(elseIfRegex, '<span class="md-special">$1</span> ($2)');
        const declareFuncRegex = /(\w+\s+[if])\s*\(([^)]*)\)/gi;
        highlighted = highlighted.replace(declareFuncRegex, '<span class="md-special">$1</span>($2)');
        const functionDeclareRe = /function (\w+)(<[^>]+>)?\(/g;
        highlighted = highlighted.replace(functionDeclareRe, (match, funcName, generics) => {
          return `function <span class="md-special">${funcName}</span>${generics || ""}(`;
        });
        const constFuncDeclareRe = /const (\w+)(<[^>]+>)? =/g;
        highlighted = highlighted.replace(constFuncDeclareRe, (match, funcName, generics) => {
          return `const <span class="md-special">${funcName}</span>${generics || ""} =`;
        });
        const classDeclareRegex = /^(?:export\s+)?class\s+([A-Z][a-zA-Z0-9_]*)/gi;
        highlighted = highlighted.replace(classDeclareRegex, (match, className) => {
          return match.replace(className, `<span class="md-class">${className}</span>`);
        });
        const methodCallRegEx = /\.(\w+)\(/g;
        highlighted = highlighted.replace(methodCallRegEx, '.<span class="md-call-method">$1</span>(');
        const replaceKeywords = (text) => {
          return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
            if (span)
              return span;
            if (word && keywords_1.reservedKeywords.includes(word)) {
              return `<span class="md-keyword">${(0, markdown_parser_1.escapeHtml)(word)}</span>`;
            }
            return word;
          });
        };
        highlighted = replaceKeywords(highlighted);
        highlighted = highlighted.replace(`:<span class="</span>md-comment<span class="md-string">">//`, `://`);
        return highlighted + commentPart;
      };
      exports.highlightJavaScript = highlightJavaScript;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/python/keywords.js
  var require_keywords2 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/python/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "False",
        "None",
        "True",
        "and",
        "assert",
        "break",
        "class",
        "continue",
        "def",
        "del",
        "elif",
        "else",
        "except",
        "finally",
        "for",
        "from",
        "global",
        "import",
        "lambda",
        "match",
        "main",
        "not",
        "or",
        "pass",
        "raise",
        "return",
        "try",
        "while",
        "with",
        "yield",
        "if",
        "in",
        "is",
        "as"
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/python/libs.js
  var require_libs = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/python/libs.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.pythonStandardLibrary = void 0;
      exports.pythonStandardLibrary = [
        // System and Operating System
        "sys",
        "os",
        "subprocess",
        "shutil",
        "glob",
        "pathlib",
        "tempfile",
        "io",
        "logging",
        "platform",
        // Data Types and Data Structures
        "collections",
        "heapq",
        "bisect",
        "array",
        "struct",
        // String Handling and Regular Expressions
        "re",
        "string",
        "textwrap",
        "unicodedata",
        // File and Directory Handling
        "os.path",
        "fnmatch",
        "pickle",
        "json",
        "csv",
        "configparser",
        // Internet Protocols and Support
        "socket",
        "ssl",
        "email",
        "http",
        "urllib",
        "ftplib",
        "poplib",
        "imaplib",
        // Data Serialization and Persistence
        "pickle",
        "marshal",
        "sqlite3",
        // Utilities
        "datetime",
        "calendar",
        "random",
        "math",
        "statistics",
        "functools",
        "itertools",
        // Testing and Debugging
        "unittest",
        "doctest",
        "pdb",
        // Concurrency
        "threading",
        "multiprocessing",
        "asyncio",
        // Import and Module Management
        "importlib",
        "pkgutil",
        "zipimport",
        // Performance and Optimization
        "timeit",
        "cProfile",
        // Development Tools
        "argparse",
        "pdb",
        "trace",
        // Cryptography
        "hashlib",
        "hmac",
        // Data Management
        "xml",
        "sqlite3",
        // Additional Modules
        "contextlib",
        "socketserver"
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/python/highlight.js
  var require_highlight2 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/python/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightPython = void 0;
      var keywords_1 = require_keywords2();
      var libs_1 = require_libs();
      var markdown_parser_1 = require_markdown_parser();
      var highlightPython = (line) => {
        line = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#x60;");
        const hashIdx = line.indexOf("#");
        if (hashIdx === -1) {
          return highlightPythonCode(line);
        }
        if (/^\s*#/.test(line)) {
          return `<span class="md-comment">${(0, markdown_parser_1.escapeHtml)(line)}</span>`;
        }
        const codePart = line.slice(0, hashIdx);
        const commentPart = line.slice(hashIdx);
        const codeHighlighted = highlightPythonCode(codePart);
        return codeHighlighted + `<span class="md-comment">${(0, markdown_parser_1.escapeHtml)(commentPart)}</span>`;
      };
      exports.highlightPython = highlightPython;
      function highlightPythonCode(code) {
        const stringRegex = /(?:r|R)?(["'])(?:\\.|(?!\1).)*\1/g;
        let highlighted = code.replace(stringRegex, '<span class="md-string">$&</span>');
        const decoratorRegex = /(^|\s)@[\w]+/gm;
        highlighted = highlighted.replace(decoratorRegex, '<span class="md-decorator">$&</span>');
        const funcCallRegex = /(\b\w+)\s*\(([^)]*)\)/g;
        highlighted = highlighted.replace(funcCallRegex, '<span class="md-special">$1</span>($2)');
        const classDeclareRegex = /^class\s+([A-Z][a-zA-Z0-9_]*)/gi;
        highlighted = highlighted.replace(classDeclareRegex, 'class <span class="md-class">$1</span>');
        highlighted = highlighted.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
          if (span)
            return span;
          if (word && keywords_1.reservedKeywords.includes(word)) {
            return `<span class="md-keyword">${(0, markdown_parser_1.escapeHtml)(word)}</span>`;
          }
          if (word && libs_1.pythonStandardLibrary.includes(word)) {
            return `<span class="md-call-method">${(0, markdown_parser_1.escapeHtml)(word)}</span>`;
          }
          return word;
        });
        return highlighted;
      }
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/html/keywords.js
  var require_keywords3 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/html/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "header",
        "footer",
        "address",
        "html",
        "head",
        "title",
        "base",
        "href",
        "class",
        "link",
        "meta",
        "style",
        "script",
        "noscript",
        "body",
        "section",
        "nav",
        "article",
        "aside",
        "main",
        "pre",
        "blockquote",
        "figure",
        "figcaption",
        "div",
        "em",
        "strong",
        "small",
        "cite",
        "dfn",
        "abbr",
        "data",
        "time",
        "code",
        "var",
        "samp",
        "kbd",
        "sub",
        "sup",
        "mark",
        "ruby",
        "rt",
        "rp",
        "bdi",
        "bdo",
        "span",
        "br",
        "wbr",
        "ins",
        "del",
        "img",
        "iframe",
        "embed",
        "object",
        "param",
        "video",
        "audio",
        "source",
        "track",
        "canvas",
        "map",
        "area",
        "svg",
        "math",
        "table",
        "caption",
        "colgroup",
        "col",
        "tbody",
        "thead",
        "tfoot",
        "tr",
        "td",
        "th",
        "form",
        "fieldset",
        "legend",
        "label",
        "input",
        "button",
        "select",
        "datalist",
        "optgroup",
        "option",
        "textarea",
        "keygen",
        "output",
        "progress",
        "meter",
        "details",
        "summary",
        "menu",
        "menuitem",
        "dialog",
        "hr",
        "ol",
        "ul",
        "li",
        "dl",
        "dt",
        "dd",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "a",
        "p",
        "q",
        "s",
        "id",
        "i",
        "b",
        "u"
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/html/highlight.js
  var require_highlight3 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/html/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightHtml = void 0;
      var keywords_1 = require_keywords3();
      var highlightHtml = (code) => {
        let escapedCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/`/g, "&#x60;");
        escapedCode = escapedCode.replace(/ ([a-zA-Z0-9-]+)=&quot;([a-zA-Z0-9-]+)&quot;/g, ` <span class="md-special">$1=&quot;$2&quot;</span>`);
        escapedCode = escapedCode.replace(/&quot;https:\/\/(.+)&quot;/g, `<span class="md-string">&quot;https:\\\\$1&quot;</span>`);
        escapedCode = escapedCode.replace(/&lt;!--(.*?)--&gt;/g, `<span class="md-comment">&lt;!--$1--&gt;</span>`);
        keywords_1.reservedKeywords.forEach((keyword) => {
          const regexClose = new RegExp(`&lt;/${keyword}&gt;`, "g");
          escapedCode = escapedCode.replace(regexClose, `<span class="md-keyword">&lt;/${keyword}&gt;</span>`);
          const regexOpen = new RegExp(`&lt;${keyword}&gt;`, "g");
          escapedCode = escapedCode.replace(regexOpen, `<span class="md-keyword">&lt;${keyword}&gt;</span>`);
          const regexSpecialOpen = new RegExp(`&lt;${keyword} `, "g");
          escapedCode = escapedCode.replace(regexSpecialOpen, `<span class="md-keyword">&lt;${keyword} </span>`);
        });
        return escapedCode;
      };
      exports.highlightHtml = highlightHtml;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/css/highlight.js
  var require_highlight4 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/css/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightCss = void 0;
      var highlightCss = (code) => {
        let escapedCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/`/g, "&#x60;");
        const hasOpenComment = /\/\*/g.test(code);
        const hasCloseComment = /\*\//g.test(code);
        if (hasOpenComment && !hasCloseComment || !hasOpenComment && hasCloseComment) {
          return code;
        }
        const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
        escapedCode = escapedCode.replace(commentRegex, '<span class="md-comment">$1</span>');
        escapedCode = escapedCode.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
          if (match.startsWith('<span class="md-comment">'))
            return match;
          return `<span class="md-string">${p1}${p2}${p3}</span>`;
        });
        escapedCode = escapedCode.replace(/(\$[a-zA-Z0-9_-]+)(?=\s*:)/g, `<span class="md-special">$1</span>`);
        escapedCode = escapedCode.replace(/(\#[a-zA-Z0-9_-]+)(?=\s*;)/g, `<span class="md-special">$1</span>`);
        escapedCode = escapedCode.replace(/(&quot;.*?&quot;|'.*?')/g, '<span class="md-string">$1</span>');
        escapedCode = escapedCode.replace(/\/\*(.*?)\*\//g, `<span class="md-comment">/*$1*/</span>`);
        escapedCode = escapedCode.replace(/(&quot;.*?&quot;|'.*?')/g, `<span class="md-string">$1</span>`);
        const cssPropertyRegex = /([a-zA-Z-]+)(?=\s*:)/g;
        escapedCode = escapedCode.replace(cssPropertyRegex, '<span class="md-keyword">$1</span>');
        escapedCode = escapedCode.replace(/(\d*\.?\d+)(px|em|rem|%|vh|vw|vmin|vmax|deg)/g, `<span class="md-number">$1$2</span>`);
        escapedCode = escapedCode.replace(/([.#]?[a-zA-Z0-9_-]+)(?=\s*{)/g, `<span class="md-decorator">$1</span>`);
        escapedCode = escapedCode.replace(/(:[a-zA-Z0-9_-]+)/g, `<span class="md-decorator">$1</span>`);
        return escapedCode;
      };
      exports.highlightCss = highlightCss;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/golang/keywords.js
  var require_keywords4 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/golang/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reservedLibraries = exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "fallthrough",
        "continue",
        "default",
        "package",
        "import",
        "break",
        "case",
        "chan",
        "const",
        "defer",
        "range",
        "return",
        "select",
        "switch",
        "else",
        "func",
        "goto",
        "map",
        "type",
        "case",
        "var",
        "err",
        "nil",
        "for",
        "go",
        "if"
      ];
      exports.reservedLibraries = ["os", "fmt", "http", "io", "path", "time", "strings"];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/golang/highlight.js
  var require_highlight5 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/golang/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightGo = void 0;
      var keywords_1 = require_keywords4();
      var highlightGo = (code) => {
        let escapedCode = code.replace(/&/g, "&amp;").replace(/:\/\//g, ":&#47;&#47;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\'/g, "&#039;").replace(/'/g, "&#039;").replace(/\\"/g, "&quot;").replace(/"/g, "&quot;").replace(/`/g, "&#x60;");
        const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
        escapedCode = escapedCode.replace(commentRegex, '<span class="md-comment">$1</span>');
        const commentSpanRegex = /<span class="md-comment">.*?<\/span>|([^<]+)(?=<span class="md-comment">|$)/g;
        return escapedCode.replace(commentSpanRegex, (match, code2) => {
          if (match.startsWith('<span class="md-comment">')) {
            return match;
          }
          const stringRegex = /(&quot;|&#039;|&#x60;)(.*?)(\1)/g;
          code2 = code2.replace(stringRegex, '<span class="md-string">$1$2$3</span>');
          if (code2.includes('<span class="md-string"')) {
          }
          const replaceKeywords = (text) => {
            return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match2, span, word) => {
              if (span)
                return span;
              if (word && keywords_1.reservedKeywords.includes(word)) {
                return `<span class="md-keyword">${word}</span>`;
              }
              return word;
            });
          };
          code2 = replaceKeywords(code2);
          return code2;
          const mdSpanRegexComplete = /(<span class="md-[^"]*">)([\s\S]*?)(<\/span>)/;
          const mdSpanRegexPart = /(<span class="md-[^"]*">)/;
          code2 = code2.replace(/(\d+(?:\.\d+)?)/g, '<span class="md-number">$1</span>');
          const libMethodCallStr = `<span class="md-special">$1</span>$2<span class="md-call-method">$3</span>`;
          code2 = code2.replace(/([a-zA-Z0-9_-]+)(\.)([a-zA-Z0-9_-]+)(?=\s*[\{(])/g, libMethodCallStr);
          code2 = code2.replace(/(:[a-zA-Z0-9_-]+)/g, '<span class="md-decorator">$1</span>');
          code2 = code2.replace(/(\$[a-zA-Z0-9_-]+)/g, '<span class="md-special">$1</span>');
          const methodCallRegEx = /\.(\w+)\(/g;
          return code2.replace(methodCallRegEx, '.<span class="md-call-method">$1</span>(');
        });
      };
      exports.highlightGo = highlightGo;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/jsx/keywords.js
  var require_keywords5 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/jsx/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "getStaticProps",
        "getServerSideProps",
        "getStaticPaths",
        "Image",
        "Link",
        "useState",
        "useEffect",
        "useContext",
        "useReducer",
        "useCallback",
        "useMemo",
        "useRef",
        "useImperativeHandle",
        "useLayoutEffect",
        "useDebugValue",
        "useDeferredValue",
        "useTransition",
        "useId",
        "Fragment",
        "StrictMode",
        "Suspense",
        "Profiler",
        "SuspenseList",
        "createPortal",
        "Memo",
        "forwardRef",
        "memo",
        "React",
        "ReactDOM",
        "PropTypes",
        "Component",
        "PureComponent",
        "Provider",
        "Consumer",
        "Context",
        "ThemeProvider",
        "Styled",
        "ErrorBoundary",
        "App",
        "Document",
        "Main",
        "NextScript",
        "Head",
        "Router",
        "Link",
        "Image",
        "Script",
        "AppProps",
        "Document",
        "Main",
        "NextScript",
        "interface",
        "type",
        "enum",
        "implements",
        "extends",
        "namespace",
        "module",
        "declare",
        "abstract",
        "readonly",
        "keyof",
        "infer",
        "instanceof",
        "typeof",
        "useImperativeHandle",
        "useDebugValue",
        "useCallback",
        "useMemo",
        "useRef",
        "useLayoutEffect",
        "useDeferredValue",
        "useTransition",
        "useId",
        "ReactDOM",
        "PropTypes",
        "Component",
        "PureComponent",
        "Provider",
        "Consumer",
        "Context",
        "ThemeProvider",
        "Styled",
        "ErrorBoundary"
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/jsx/highlight.js
  var require_highlight6 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/jsx/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightJSX = void 0;
      var keywords_1 = require_keywords();
      var keywords_2 = require_keywords3();
      var keywords_3 = require_keywords5();
      var reservedKeywords = [...keywords_1.reservedKeywords, ...keywords_2.reservedKeywords];
      var highlightJSXAttributes = (attributes) => {
        const attrNameRegex = /(\w+)=/g;
        let highlightedAttrs = attributes.replace(attrNameRegex, '<span class="md-special">$1</span>=');
        const attrValueRegex = /=(["'])(.*?)\1/g;
        highlightedAttrs = highlightedAttrs.replace(attrValueRegex, '="<span class="md-special">$2</span>"');
        const exprValueRegex = /=\{(.*?)\}/g;
        highlightedAttrs = highlightedAttrs.replace(exprValueRegex, '={<span class="md-special">$1</span>}');
        return highlightedAttrs;
      };
      var replaceKeywords = (text) => {
        return text.replace(/(<span[^>]*>.*?<\/span>)|(\b\w+\b)/g, (match, span, word) => {
          if (span)
            return span;
          if (word && reservedKeywords.includes(word)) {
            return `<span class="md-keyword">${word}</span>`;
          } else if (word && keywords_3.reservedKeywords.includes(word)) {
            return `<span class="md-decorator">${word}</span>`;
          }
          return word;
        });
      };
      var highlightJSX = (code) => {
        code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
        const hasOpenComment = /\/\*/.test(code);
        const hasCloseComment = /\*\//.test(code);
        if (hasOpenComment && !hasCloseComment || !hasOpenComment && hasCloseComment) {
          return code;
        }
        const commentRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)/g;
        let highlighted = code.replace(commentRegex, '<span class="md-comment">$1</span>');
        highlighted = highlighted.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
          if (match.startsWith('<span class="md-comment">'))
            return match;
          return `<span class="md-string">${p1}${p2}${p3}</span>`;
        });
        const regexEqualsPattern = /=([\s+]?\/.*?\/[gimuy]*)/g;
        highlighted = highlighted.replace(regexEqualsPattern, '=<span class="md-regex">$1</span>');
        const regexTestPattern = /([\s+]?\/.*?\/[gimuy]*)\.test/g;
        highlighted = highlighted.replace(regexTestPattern, '<span class="md-regex">$1</span>.test');
        const decoratorRegex = /(^|\s)@[\w]+/gm;
        highlighted = highlighted.replace(decoratorRegex, '$1<span class="md-decorator">$&</span>');
        const jsxTagRegex = /&lt;\/?([A-Z][A-Za-z0-9_]*)\b([^&]*?)&gt;/g;
        highlighted = highlighted.replace(jsxTagRegex, (match, p1, p2) => {
          return `&lt;<span class="md-decorator">${p1}</span>${highlightJSXAttributes(p2)}&gt;`;
        });
        const jsxSelfClosingTagRegex = /&lt;([A-Z][A-Za-z0-9_]*)\b([^&]*?)\/&gt;/g;
        highlighted = highlighted.replace(jsxSelfClosingTagRegex, (match, p1, p2) => {
          return `&lt;<span class="md-decorator">${p1}</span>${highlightJSXAttributes(p2)} /&gt;`;
        });
        const jsxExpressionRegex = /{([^}]+)}/g;
        highlighted = highlighted.replace(jsxExpressionRegex, '<span class="md-special">{$1}</span>');
        highlighted = replaceKeywords(highlighted);
        return highlighted;
      };
      exports.highlightJSX = highlightJSX;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/sql/keywords.js
  var require_keywords6 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/sql/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.specialIdentifiers = exports.sqlFunctions = exports.sqlDataTypes = exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "TRANSACTION",
        "CONSTRAINT",
        "REFERENCES",
        "PRIVILEGES",
        "PROCEDURE",
        "SAVEPOINT",
        "DISTINCT",
        "PASSWORD",
        "FUNCTION",
        "ROLLBACK",
        "DESCRIBE",
        "DATABASE",
        "TRUNCATE",
        "EXECUTE",
        "DECLARE",
        "DEFAULT",
        "BETWEEN",
        "PRIMARY",
        "FOREIGN",
        "TRIGGER",
        "EXPLAIN",
        "CASCADE",
        "RETURNS",
        "REPLACE",
        "SELECT",
        "INSERT",
        "VALUES",
        "UPDATE",
        "DELETE",
        "CREATE",
        "HAVING",
        "OFFSET",
        "EXISTS",
        "COMMIT",
        "REVOKE",
        "COLUMN",
        "SCHEMA",
        "RETURN",
        "OUTER",
        "WHERE",
        "TABLE",
        "ALTER",
        "INNER",
        "RIGHT",
        "GROUP",
        "ORDER",
        "LIMIT",
        "UNION",
        "INDEX",
        "GRANT",
        "BEGIN",
        "VALUE",
        "CHECK",
        "FROM",
        "INTO",
        "LOOP",
        "DROP",
        "JOIN",
        "LEFT",
        "FULL",
        "LIKE",
        "SHOW",
        "DATA",
        "TYPE",
        "VIEW",
        "CASE",
        "WITH",
        "WHEN",
        "THEN",
        "ELSE",
        "ALL",
        "ANY",
        "NOT",
        "END",
        "SET",
        "KEY",
        "FOR",
        "USE",
        "AND",
        "ADD",
        "ON",
        "AS",
        "IN",
        "IS",
        "DO",
        "BY",
        "TO",
        "OR"
      ];
      exports.sqlDataTypes = [
        "VARBINARY",
        "TIMESTAMP",
        "MEDIUMINT",
        "DATETIME",
        "NVARCHAR",
        "SMALLINT",
        "VARCHAR",
        "TINYINT",
        "DECIMAL",
        "NUMERIC",
        "BIGINT",
        "DOUBLE",
        "SERIAL",
        "BINARY",
        "NCHAR",
        "NTEXT",
        "USING",
        "IMAGE",
        "FLOAT",
        "TIME",
        "ZONE",
        "CHAR",
        "DATE",
        "YEAR",
        "JSON",
        "ENUM",
        "UUID",
        "TEXT",
        "NULL",
        "XML",
        "BIT",
        "INT"
      ];
      exports.sqlFunctions = [
        // Date and Time Functions
        "NOW",
        "DATE_TRUNC",
        "CURRENT_DATE",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "EXTRACT",
        "AGE",
        "TO_CHAR",
        "TO_DATE",
        "TO_TIMESTAMP",
        "INTERVAL",
        "DATE_PART",
        "DATEADD",
        "DATEDIFF",
        "DATE_FORMAT",
        "TIMESTAMPADD",
        "TIMESTAMPDIFF",
        // Aggregate Functions
        "COUNT",
        "SUM",
        "AVG",
        "MIN",
        "MAX",
        "ARRAY_AGG",
        "STRING_AGG",
        "JSON_AGG",
        "JSON_OBJECT_AGG",
        "BOOL_AND",
        "BOOL_OR",
        "VARIANCE",
        "STDDEV",
        // String Functions
        "CONCAT",
        "CONCAT_WS",
        "SUBSTRING",
        "LEFT",
        "RIGHT",
        "LENGTH",
        "LOWER",
        "UPPER",
        "TRIM",
        "LTRIM",
        "RTRIM",
        "REPLACE",
        "POSITION",
        "STRPOS",
        "INITCAP",
        "OVERLAY",
        "SPLIT_PART",
        "TRANSLATE",
        "ASCII",
        "FORMAT",
        "CHR",
        // Mathematical Functions
        "ABS",
        "CEIL",
        "CEILING",
        "FLOOR",
        "ROUND",
        "POWER",
        "SQRT",
        "MOD",
        "RANDOM",
        "EXP",
        "LN",
        "LOG",
        "LOG10",
        "SIGN",
        "TRUNC",
        // Conditional Expressions
        "COALESCE",
        "NULLIF",
        "CASE",
        "CAST",
        "CONVERT",
        "GREATEST",
        "LEAST",
        "IFNULL",
        "ISNULL",
        // JSON Functions (PostgreSQL)
        "JSON_BUILD_OBJECT",
        "JSON_BUILD_ARRAY",
        "TO_JSON",
        "JSONB_SET",
        "JSON_TYPE",
        "JSON_PARSE",
        "JSONB_PRETTY",
        // Window Functions
        "ROW_NUMBER",
        "RANK",
        "DENSE_RANK",
        "LEAD",
        "LAG",
        "NTILE",
        "FIRST_VALUE",
        "LAST_VALUE",
        "CUME_DIST",
        "PERCENT_RANK",
        // System Functions
        "VERSION",
        "CURRENT_USER",
        "SESSION_USER",
        "DATABASE",
        "USER",
        "DBNAME",
        "SESSION_ID",
        "TXID_CURRENT",
        // Network Address Functions
        "INET_ATON",
        "INET_NTOA",
        "INET6_ATON",
        "INET6_NTOA",
        // Miscellaneous Functions
        "MD5",
        "SHA1",
        "SHA256",
        "UUID_GENERATE_V4",
        "GENERATE_SERIES",
        "PG_SLEEP",
        "RANDOM",
        // Geometric Functions
        "ST_DISTANCE",
        "ST_INTERSECTS",
        "ST_WITHIN",
        "ST_CONTAINS",
        "ST_BUFFER",
        "ST_AREA",
        "ST_LENGTH",
        // Array Functions
        "ARRAY_APPEND",
        "ARRAY_PREPEND",
        "ARRAY_REMOVE",
        "UNNEST",
        "ARRAY_AGG",
        "ARRAY_TO_STRING"
      ];
      exports.specialIdentifiers = [
        "current_database",
        // Name of the current database
        "information_schema",
        "connamespace",
        "current_user",
        // Current database user
        "session_user",
        // Session user
        "current_schema",
        // Current schema
        "current_time",
        // Current time
        "current_timestamp",
        // Current timestamp
        "current_date",
        // Current date
        "conname",
        // Communications connection identifier
        "nspname",
        "relname",
        "tablename",
        "schemaname",
        "sequencename",
        "increment_by",
        "usename",
        "conrelid",
        "user",
        // User connected to the database
        "tc",
        "ccu",
        "kcu",
        "now"
        // Current date and time
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/sql/highlight.js
  var require_highlight7 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/sql/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightSQL = void 0;
      var markdown_parser_1 = require_markdown_parser();
      var keywords_1 = require_keywords6();
      var highlightSQL = (code) => {
        let escapedCode = (0, markdown_parser_1.escapeHtml)(code);
        const commentRegex = /(--.*?$|\/\*[\s\S]*?\*\/)/gm;
        escapedCode = escapedCode.replace(commentRegex, '<span class="md-comment">$&</span>');
        escapedCode = escapedCode.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
          if (match.startsWith('<span class="md-comment">'))
            return match;
          return `<span class="md-string">${p1}${p2}${p3}</span>`;
        });
        const codeParts = escapedCode.split(/(<span class="md-string">[\s\S]*?<\/span>|<span class="md-comment">[\s\S]*?<\/span>)/g);
        escapedCode = codeParts.map((part) => {
          if (part.startsWith('<span class="md-string">') || part.startsWith('<span class="md-comment">') || part.startsWith('<span class="md-command">')) {
            return part;
          } else {
            let newPart = part;
            keywords_1.reservedKeywords.forEach((keyword) => {
              const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
              newPart = newPart.replace(regexKeyword, '<span class="md-keyword">$1</span>');
            });
            keywords_1.sqlDataTypes.forEach((keyword) => {
              const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
              newPart = newPart.replace(regexKeyword, '<span class="md-decorator">$1</span>');
            });
            keywords_1.sqlFunctions.forEach((keyword) => {
              const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
              newPart = newPart.replace(regexKeyword, '<span class="md-call-method">$1</span>');
            });
            const pgFunctionRegex = /\b(pg_[a-zA-Z0-9_]+)(?=\s*\()/g;
            newPart = newPart.replace(pgFunctionRegex, '<span class="md-call-method">$1</span>');
            const pgAttrRegex = /\b(pg_[a-zA-Z0-9_]+)/g;
            newPart = newPart.replace(pgAttrRegex, '<span class="md-special">$1</span>');
            newPart = newPart.replace(/(\$\$)/g, '<span class="md-decorator">$1</span>');
            newPart = newPart.replace(/(\:\:)/g, '<span class="md-decorator">$1</span>');
            newPart = newPart.replace(/\s(=)\s/g, '<span class="md-decorator">$1</span>');
            const numberRegex = /\b\d+(\.\d+)?\b/g;
            newPart = newPart.replace(numberRegex, '<span class="md-number">$&</span>');
            const parenthesesRegex = /[(){}[\]]/g;
            newPart = newPart.replace(parenthesesRegex, '<span class="md-special">$&</span>');
            const commaSemicolonRegex = /[;,]/g;
            newPart = newPart.replace(commaSemicolonRegex, '<span class="md-special">$&</span>');
            return newPart;
          }
        }).join("");
        return escapedCode;
      };
      exports.highlightSQL = highlightSQL;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/lua/keywords.js
  var require_keywords7 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/lua/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reservedFunctions = exports.reservedKeywords = void 0;
      exports.reservedKeywords = [
        "and",
        "break",
        "do",
        "else",
        "elseif",
        "end",
        "false",
        "for",
        "function",
        "if",
        "in",
        "local",
        "nil",
        "not",
        "or",
        "repeat",
        "return",
        "then",
        "true",
        "until",
        "while"
      ];
      exports.reservedFunctions = [
        "assert",
        "collectgarbage",
        "dofile",
        "error",
        "ipairs",
        "load",
        "loadfile",
        "next",
        "pairs",
        "pcall",
        "print",
        "rawequal",
        "rawget",
        "rawset",
        "select",
        "setmetatable",
        "tonumber",
        "tostring",
        "type",
        "xpcall",
        "coroutine",
        "string",
        "table",
        "math",
        "io",
        "os",
        "package",
        "debug"
      ];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/lua/highlight.js
  var require_highlight8 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/lua/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightLua = void 0;
      var keywords_1 = require_keywords7();
      var highlightLua = (code) => {
        const commentRegex = /(--[^\n]*)/g;
        code = code.replace(commentRegex, '<span class="md-comment">$1</span>');
        code = code.replace(/<span class="md-comment">.*?<\/span>|(["'`])(.*?)(\1)/g, (match, p1, p2, p3) => {
          if (match.startsWith('<span class="md-comment">'))
            return match;
          return `<span class="md-string">${p1}${p2}${p3}</span>`;
        });
        const codeParts = code.split(/(<span class="md-string">[\s\S]*?<\/span>|<span class="md-comment">[\s\S]*?<\/span>)/g);
        code = codeParts.map((part) => {
          if (part.startsWith('<span class="md-string">') || part.startsWith('<span class="md-comment">')) {
            return part;
          } else {
            let newPart = part;
            keywords_1.reservedKeywords.forEach((keyword) => {
              const regexKeyword = new RegExp(`\\b(${keyword})\\b`, "g");
              newPart = newPart.replace(regexKeyword, '<span class="md-keyword">$1</span>');
            });
            keywords_1.reservedFunctions.forEach((func) => {
              const regexKeyword = new RegExp(`\\b(${func})\\b`, "g");
              newPart = newPart.replace(regexKeyword, '<span class="md-decorator">$1</span>');
            });
            const stringOperatorRegex = /(\.\.)/g;
            newPart = newPart.replace(stringOperatorRegex, '<span class="md-decorator">$&</span>');
            const funcCallRegex = /(\w+)\(/g;
            newPart = newPart.replace(funcCallRegex, '<span class="md-call-method">$1</span>(');
            const numberRegex = /\b\d+(\.\d+)?\b/g;
            newPart = newPart.replace(numberRegex, '<span class="md-number">$&</span>');
            const parenthesesRegex = /[(){}[\]]/g;
            newPart = newPart.replace(parenthesesRegex, '<span class="md-special">$&</span>');
            const commaSemicolonRegex = /[;,]/g;
            newPart = newPart.replace(commaSemicolonRegex, '<span class="md-special">$&</span>');
            return newPart;
          }
        }).join("");
        return code;
      };
      exports.highlightLua = highlightLua;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/rust/keywords.js
  var require_keywords8 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/rust/keywords.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.rustLogicalOps = exports.rustSpecial = exports.rustKeywords = void 0;
      exports.rustKeywords = [
        "fn",
        "let",
        "mut",
        "pub",
        "crate",
        "super",
        "self",
        "Self",
        "as",
        "use",
        "impl",
        "trait",
        "struct",
        "enum",
        "match",
        "if",
        "else",
        "while",
        "loop",
        "for",
        "in",
        "move",
        "ref",
        "type",
        "where",
        "const",
        "static",
        "mod",
        "unsafe",
        "async",
        "await",
        "dyn",
        "return",
        "break",
        "continue",
        "extern",
        "println",
        "read_to_string"
      ];
      exports.rustSpecial = [
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "isize",
        "&&",
        "||",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "usize",
        "f32",
        "f64",
        "bool",
        "char",
        "str",
        "String",
        "Vec",
        "Option",
        "Result",
        "Box",
        "true",
        "false",
        "None",
        "Some",
        "Ok",
        "Err"
      ];
      exports.rustLogicalOps = ["&&", "||", "==", "!=", "<=", ">=", "->", "::", "=>", "=", "+", "-", "*", "/", "%", "^", "&", "|", "<<", ">>"];
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/rust/highlight.js
  var require_highlight9 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/rust/highlight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.highlightRust = void 0;
      var keywords_1 = require_keywords8();
      var escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#x60;");
      var highlightRust = (code) => {
        let line = escapeHtml(code);
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.endsWith("*/")) {
          return `<span class="md-comment">${line}</span>`;
        }
        const commentIdx = line.indexOf("//");
        let codePart = line, commentPart = "";
        if (commentIdx >= 0) {
          codePart = line.slice(0, commentIdx);
          commentPart = line.slice(commentIdx);
        }
        codePart = codePart.replace(/('[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="md-special">$1</span>');
        codePart = codePart.replace(/"(?:\\.|[^"\\])*"/g, '<span class="md-string">$&</span>');
        codePart = codePart.replace(/'([^'\\])'/g, `<span class="md-string">'$1'</span>`);
        codePart = codePart.replace(/\bmacro_rules!/, '<span class="md-decorator">macro_rules!</span>');
        codePart = codePart.replace(/(\b\w+)!/g, '<span class="md-macro">$1!</span>');
        codePart = codePart.replace(/\b\d+(\.\d+)?\b/g, '<span class="md-number">$&</span>');
        codePart = codePart.replace(/(<span[^>]+>.*?<\/span>)|(\b\w+\b)/g, (m, span, word) => {
          if (span)
            return span;
          if (word) {
            if (keywords_1.rustKeywords.includes(word))
              return `<span class="md-keyword">${word}</span>`;
            if (keywords_1.rustSpecial.includes(word))
              return `<span class="md-special">${word}</span>`;
            return word;
          }
          return m;
        });
        if (commentPart) {
          codePart += `<span class="md-comment">${escapeHtml(commentPart)}</span>`;
        }
        return codePart;
      };
      exports.highlightRust = highlightRust;
    }
  });

  // node_modules/ts-markdown-parser/dist/libs/index.js
  var require_libs2 = __commonJS({
    "node_modules/ts-markdown-parser/dist/libs/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.markdownReplace = exports.countOccurrences = exports.stripLeadingWhitespace = exports.highlightCode = exports.getMultilineCommentRegex = exports.languageAliases = void 0;
      var highlight_1 = require_highlight();
      var highlight_2 = require_highlight2();
      var highlight_3 = require_highlight3();
      var highlight_4 = require_highlight4();
      var highlight_5 = require_highlight5();
      var highlight_6 = require_highlight6();
      var highlight_7 = require_highlight7();
      var highlight_8 = require_highlight8();
      var highlight_9 = require_highlight9();
      exports.languageAliases = {
        js: "javascript",
        javascript: "javascript",
        typescript: "javascript",
        ts: "javascript",
        python: "python",
        py: "python",
        html: "html",
        css: "css",
        scss: "scss",
        go: "golang",
        golang: "golang",
        jsx: "jsx",
        tsx: "jsx",
        sql: "sql",
        lua: "lua",
        rust: "rust",
        rs: "rust"
      };
      var highlightFunctions = {
        javascript: highlight_1.highlightJavaScript,
        js: highlight_1.highlightJavaScript,
        ts: highlight_1.highlightJavaScript,
        typescript: highlight_1.highlightJavaScript,
        python: highlight_2.highlightPython,
        py: highlight_2.highlightPython,
        html: highlight_3.highlightHtml,
        css: highlight_4.highlightCss,
        scss: highlight_4.highlightCss,
        go: highlight_5.highlightGo,
        golang: highlight_5.highlightGo,
        jsx: highlight_6.highlightJSX,
        tsx: highlight_6.highlightJSX,
        sql: highlight_7.highlightSQL,
        lua: highlight_8.highlightLua,
        rust: highlight_9.highlightRust,
        rs: highlight_9.highlightRust
      };
      var cssStart = /(^\/\*)/;
      var cssEnd = /(^\*\/|^\s\*\/)/;
      var regexJavaScriptStart = /(^\/\*\*|^\/\*|\s\/\*\*|\s\/\*)/;
      var regexJavaScriptEnd = /(^\*\/|\s\*\/)/;
      var regexPython = /('''|""")/;
      var goRegexStart = /(\/\*)/;
      var goRegexEnd = /(\*\/)/;
      var multilineCommentMap = {
        javascript: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
        js: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
        typescript: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
        jsx: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
        tsx: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
        ts: { start: regexJavaScriptStart, end: regexJavaScriptEnd },
        python: { start: regexPython, end: regexPython },
        py: { start: regexPython, end: regexPython },
        html: { start: /<!--/, end: /-->/ },
        // HTML comments are not multiline but for structure
        css: { start: cssStart, end: cssEnd },
        scss: { start: cssStart, end: cssEnd },
        go: { start: goRegexStart, end: goRegexEnd },
        golang: { start: goRegexStart, end: goRegexEnd },
        sql: { start: /\/\*/, end: /\*\// },
        lua: { start: /(^--\[\[)/, end: /(^--\]\]|^]])/ },
        // Lua block comments
        rust: { start: /\/\*/, end: /\*\// }
      };
      var getMultilineCommentRegex = (language) => {
        return multilineCommentMap[language] || null;
      };
      exports.getMultilineCommentRegex = getMultilineCommentRegex;
      var highlightCode = (language, code) => {
        const normalizedLanguage = exports.languageAliases[language] || language;
        const highlightFunction = highlightFunctions[normalizedLanguage];
        return highlightFunction ? highlightFunction(code) : code;
      };
      exports.highlightCode = highlightCode;
      var stripLeadingWhitespace = (str) => {
        const regex = /^[\s\n]+/;
        return str.replace(regex, "").trim();
      };
      exports.stripLeadingWhitespace = stripLeadingWhitespace;
      var countOccurrences = (arr, target) => {
        if (!arr || !arr.length) {
          return 0;
        }
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
          const str = arr[i].trim();
          if (target === str) {
            total++;
          }
        }
        return total;
      };
      exports.countOccurrences = countOccurrences;
      var markdownReplace = (text, replaceRegex, replacement) => {
        const htmlEntityRegex = /(&.+;)(.*?)(\1)/gi;
        const parts = text.split(htmlEntityRegex);
        const replacedParts = parts.map((item) => {
          const isHTMLEntity = /(&.+;)(.*?)/g.test(item);
          if (isHTMLEntity)
            return item;
          return item.replace(replaceRegex, replacement);
        });
        return replacedParts.join("");
      };
      exports.markdownReplace = markdownReplace;
    }
  });

  // node_modules/ts-markdown-parser/dist/utils/markdown-parser.js
  var require_markdown_parser = __commonJS({
    "node_modules/ts-markdown-parser/dist/utils/markdown-parser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.checkboxScript = exports.globalScript = exports.elementToHtml = exports.parseMarkdown = exports.replaceSpecialQuotes = exports.markdownTableToHTML = exports.escapeHtml = exports.replaceReferenceLinks = void 0;
      var libs_1 = require_libs2();
      var detectNonHtmlCodeBlocks = (line, previous = "html") => {
        const openScriptMatch = line.match(/<script/i);
        const closeScriptMatch = line.match(/<\/script>/i);
        const openStyleMatch = line.match(/<style/i);
        const closeStyleMatch = line.match(/<\/style>/i);
        if (previous !== "html") {
          if (closeScriptMatch || closeStyleMatch) {
            return { action: "close", lang: "html" };
          }
        }
        if (openScriptMatch) {
          return { action: "open", lang: "js" };
        } else if (closeScriptMatch) {
          return { action: "close", lang: "js" };
        } else if (openStyleMatch) {
          return { action: "open", lang: "css" };
        } else if (closeStyleMatch) {
          return { action: "close", lang: "css" };
        } else {
          return { action: "inside", lang: typeof previous === "string" && previous ? previous : "html" };
        }
      };
      var replaceReferenceLinks = (markdown) => {
        const lines = markdown.split("\n");
        const map = {};
        const newLines = [];
        const refDefRegex = /^\[(\d+)]\:\s*(\S+)\s*"(.+)"$/;
        const inlineRefRegex = /\[([^\]]+)]\[(\d+)]/g;
        const inlineCodeRegex = /`([^`]+)`/g;
        let isCodeBlock = false;
        for (const line of lines) {
          const trimmed = line.trimStart();
          if (trimmed.startsWith("```")) {
            isCodeBlock = !isCodeBlock;
            newLines.push(line);
            continue;
          }
          if (isCodeBlock) {
            newLines.push(line);
            continue;
          }
          const refMatch = line.match(refDefRegex);
          if (refMatch) {
            const [, refNum, url, title] = refMatch;
            map[refNum] = { title, link: url };
            continue;
          }
          newLines.push(line);
        }
        const finalLines = [];
        isCodeBlock = false;
        for (const line of newLines) {
          const trimmed = line.trimStart();
          if (trimmed.startsWith("```")) {
            isCodeBlock = !isCodeBlock;
            finalLines.push(line);
            continue;
          }
          if (isCodeBlock) {
            finalLines.push(line);
            continue;
          }
          const inlineCodeMatches = [];
          let maskedLine = line.replace(inlineCodeRegex, (match, code) => {
            inlineCodeMatches.push(match);
            return `{{INLINE_CODE_${inlineCodeMatches.length - 1}}}`;
          });
          maskedLine = maskedLine.replace(inlineRefRegex, (match, label, refNum) => {
            const ref = map[refNum];
            if (ref) {
              return `[${ref.title}](${ref.link})`;
            }
            return match;
          });
          maskedLine = maskedLine.replace(/\{\{INLINE_CODE_(\d+)}}/g, (match, index) => {
            return inlineCodeMatches[parseInt(index, 10)];
          });
          finalLines.push(maskedLine);
        }
        return finalLines.join("\n");
      };
      exports.replaceReferenceLinks = replaceReferenceLinks;
      var escapeHtml = (html) => {
        const regex = /(['"`])(.*?)\1/g;
        let escapedHtml = html.replace(regex, (match, p1, p2) => {
          const escapedContent = p2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/`/g, "&#x60;");
          return `${p1}${escapedContent}${p1}`;
        });
        escapedHtml = escapedHtml.replace(/<\/?Image/g, "&lt;Image");
        escapedHtml = escapedHtml.replace(/<\/?img/g, "&lt;img");
        return escapedHtml;
      };
      exports.escapeHtml = escapeHtml;
      var markdownTableToHTML = (lines) => {
        if (lines.length < 2)
          return "";
        const headerCells = lines[0].split("|").map((cell) => parseInlineStyles(cell.trim())).filter(Boolean);
        const bodyLines = lines.slice(2);
        const thead = `<thead><tr>${headerCells.map((c) => `<th>${c}</th>`).join("")}</tr></thead>`;
        const tbodyRows = bodyLines.map((row) => {
          const cells = row.split("|").map((cell) => parseInlineStyles(cell.trim())).filter(Boolean);
          return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
        });
        const tbody = `<tbody>${tbodyRows.join("")}</tbody>`;
        return `<table class="md-table">
${thead}
${tbody}
</table>`;
      };
      exports.markdownTableToHTML = markdownTableToHTML;
      var replaceSpecialQuotes = (text) => {
        const specialSingleQuotes = [
          "\u2018",
          // Left Single Quotation Mark (U+2018)
          "\u2019",
          // Right Single Quotation Mark (U+2019)
          "\u201A",
          // Single Low-9 Quotation Mark (U+201A)
          "\u2039",
          // Single Left-Pointing Angle Quotation Mark (U+2039)
          "\u203A"
          // Single Right-Pointing Angle Quotation Mark (U+203A)
        ];
        specialSingleQuotes.forEach((specialQuote) => {
          text = text.split(specialQuote).join("'");
        });
        return text;
      };
      exports.replaceSpecialQuotes = replaceSpecialQuotes;
      var parseInlineStyles = (text) => {
        text = text.replace(/`([^`]*)`/g, (match, code) => {
          const escapedCode = code.replace(/\*/g, "&#42;").replace(/_/g, "&#95;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/＜/g, "&lt;").replace(/＞/g, "&gt;").replace(/\[/g, "&#91;").replace(/\]/g, "&#93;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;");
          return `<span class="md-inline-code">${escapedCode}</span>`;
        });
        text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');
        const links = [];
        let linkIndex = 0;
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
          const placeholder = `{{LINK~${linkIndex}}}`;
          links.push({ placeholder, html: `<a href="${url}">${linkText}</a>` });
          linkIndex++;
          return placeholder;
        });
        text = text.replace(/\*\*(?![^<]*?>)(.*?)\*\*/g, "<b>$1</b>");
        text = text.replace(/__(?![^<]*?>)(.*?)__/g, "<b>$1</b>");
        text = text.replace(/\*(?![^<]*?>)(.*?)\*/g, "<i>$1</i>");
        text = text.replace(/_(?![^<]*?>)(.*?)_/g, "<i>$1</i>");
        text = text.replace(/^>\s*(.*)/gm, "<blockquote>$1</blockquote>");
        text = text.replace(/`(.*?)`/g, `<span class="md-inline-code">$1</span>`);
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          text = text.replace(new RegExp(link.placeholder, "g"), link.html);
        }
        text = text.replace(/\\([*_])/g, "$1");
        return text;
      };
      var parseMarkdown = (markdown) => {
        if (typeof markdown !== "string" || !markdown) {
          throw new Error(`Markdown string is invalid: ${typeof markdown}`);
        }
        markdown = (0, exports.replaceReferenceLinks)(markdown);
        const lines = (0, libs_1.stripLeadingWhitespace)(markdown).split("\n");
        const totalYamlFrontLines = lines.filter((line) => line.trim() === "---").length;
        let yamlEndLine = -1;
        if (totalYamlFrontLines >= 2 && lines[0].trim() === "---") {
          for (let j = 1; j < lines.length; j++) {
            if (lines[j].trim() === "---") {
              yamlEndLine = j;
              break;
            }
          }
        }
        const ulItemRegex = /^(\s*)[-*+]\s+(\[([ xX])\]\s*)?(.*)$/;
        const processedLines = [];
        const elements = [];
        let i = 0;
        let inMetadata = false;
        while (i < lines.length) {
          const line = (0, exports.replaceSpecialQuotes)(lines[i]).trim();
          if (i === 0 && line === "---") {
            inMetadata = true;
            i++;
            continue;
          }
          if (line === "---" && inMetadata) {
            inMetadata = false;
            i++;
            continue;
          }
          if (inMetadata) {
            if (i === yamlEndLine) {
              inMetadata = false;
            }
            i++;
            continue;
          }
          if (line.trim() === "---") {
            elements.push({ type: "line", content: "" });
            i++;
            continue;
          }
          if (line.startsWith("##### ")) {
            elements.push({ type: "h5", content: parseInlineStyles(line.slice(5)) });
          } else if (line.startsWith("#### ")) {
            elements.push({ type: "h4", content: parseInlineStyles(line.slice(5)) });
          } else if (line.startsWith("### ")) {
            elements.push({ type: "h3", content: parseInlineStyles(line.slice(4)) });
          } else if (line.startsWith("## ")) {
            elements.push({ type: "h2", content: parseInlineStyles(line.slice(3)) });
          } else if (line.startsWith("# ")) {
            elements.push({ type: "h1", content: parseInlineStyles(line.slice(2)) });
          } else if (line.trimStart().startsWith("```")) {
            const cleanLine = line.trimStart();
            const language = cleanLine.slice(3).trim().toLowerCase() || "txt";
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
              const fixedLine = (0, exports.replaceSpecialQuotes)(lines[i]);
              codeLines.push(fixedLine);
              i++;
            }
            const finalCode = codeLines.join("\n");
            elements.push({ type: "code", content: finalCode, language });
          } else if (ulItemRegex.test(line)) {
            const listItems = [];
            while (i < lines.length && ulItemRegex.test(lines[i])) {
              const [, indent, , checkboxStatus, content] = lines[i].match(ulItemRegex);
              if (typeof checkboxStatus !== "undefined") {
                const checked = checkboxStatus && checkboxStatus.toLowerCase() === "x";
                const label = parseInlineStyles(content.trim());
                const checkbox = `<input type="checkbox" disabled${checked ? " checked" : ""}>`;
                listItems.push(`<li class="md-checkbox">${checkbox}<span>${label}</span></li>`);
              } else {
                listItems.push(`<li>${parseInlineStyles(content.trim())}</li>`);
              }
              i++;
            }
            elements.push({ type: "ul", content: listItems.join("") });
            continue;
          } else if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) {
            const tableLines = [];
            tableLines.push(lines[i]);
            tableLines.push(lines[i + 1]);
            i += 2;
            while (i < lines.length && lines[i].includes("|") && !lines[i].trim().startsWith("#") && lines[i].trim().length > 0) {
              tableLines.push(lines[i]);
              i++;
            }
            const tableHtml = (0, exports.markdownTableToHTML)(tableLines);
            elements.push({ type: "table", content: tableHtml });
            continue;
          } else if (line.trim().length > 0) {
            const fixedLine = parseInlineStyles(line);
            elements.push({ type: "p", content: fixedLine });
          }
          if (processedLines.includes(i)) {
            console.error(`\x1B[31mLine '${line}' (#${i}) has already been processed\x1B[37m`);
            break;
          }
          processedLines.push(i);
          i++;
        }
        return elements;
      };
      exports.parseMarkdown = parseMarkdown;
      var elementToHtml = (element, opts) => {
        const addCopyToClipboard = !!opts.addCopyToClipboard;
        switch (element.type) {
          case "h1":
            return `<h1>${element.content}</h1>
`;
          case "h2":
            return `<h2>${element.content}</h2>
`;
          case "h3":
            return `<h3>${element.content}</h3>
`;
          case "h4":
            return `<h4>${element.content}</h4>
`;
          case "h5":
            return `<h5>${element.content}</h5>
`;
          case "table":
            return `${element.content}
`;
          case "line":
            return `<div class="md-line"></div>
`;
          // i.e. `---` decorative lines
          case "code":
            let highlightedCode = "";
            if (element.language && typeof element.language === "string") {
              const codeBlock = element.content;
              const lines = codeBlock.split("\n");
              const multiLineCommentRegex = (0, libs_1.getMultilineCommentRegex)(element.language);
              const finalLines = [];
              let inBlockComment = false, pythonCommentIsOpen = false, isPython = !!(element.language === "py" || element.language === "python"), htmlCommentOpen = false, previousHtmlLang = "html";
              for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                let isBlockStart = false, isBlockEnd = false;
                if (multiLineCommentRegex) {
                  const startRegex = multiLineCommentRegex.start;
                  const endRegex = multiLineCommentRegex.end;
                  isBlockStart = startRegex.test(line);
                  isBlockEnd = endRegex.test(line);
                }
                if (isPython) {
                  const regexPython = /('''|""")/;
                  const isPythonMultiCommentMarker = regexPython.test(line);
                  if (isPythonMultiCommentMarker) {
                    pythonCommentIsOpen = !pythonCommentIsOpen;
                    if (pythonCommentIsOpen) {
                      finalLines.push(`<span class="md-comment">${line}`);
                    } else {
                      finalLines.push(`${line}</span>`);
                    }
                  } else if (pythonCommentIsOpen) {
                    finalLines.push(line);
                  } else {
                    finalLines.push((0, libs_1.highlightCode)("py", line));
                  }
                } else {
                  if (element.language === "html") {
                    if (line.trim() === "<!--") {
                      line = line.replace(/<!--/g, `&lt;!--`);
                      line = '<span class="md-comment">' + line;
                      htmlCommentOpen = true;
                    }
                    const otherCodeResult = detectNonHtmlCodeBlocks(line, previousHtmlLang);
                    if (previousHtmlLang !== "html" && (otherCodeResult === null || otherCodeResult === void 0 ? void 0 : otherCodeResult.action) === "inside") {
                      highlightedCode = (0, libs_1.highlightCode)(previousHtmlLang, line);
                    } else if (!htmlCommentOpen) {
                      highlightedCode = (0, libs_1.highlightCode)("html", line);
                    } else {
                      highlightedCode = (0, exports.escapeHtml)(line);
                      if (htmlCommentOpen === true && line.includes("-->")) {
                        highlightedCode = (0, exports.escapeHtml)(line);
                        htmlCommentOpen = false;
                        highlightedCode = highlightedCode + "</span>";
                      }
                    }
                    previousHtmlLang = typeof (otherCodeResult === null || otherCodeResult === void 0 ? void 0 : otherCodeResult.lang) === "string" ? otherCodeResult.lang : "html";
                    finalLines.push(highlightedCode);
                  } else if (isBlockStart && !inBlockComment) {
                    finalLines.push(`<span class="md-comment">${line}`);
                    inBlockComment = true;
                  } else if (inBlockComment && !isBlockStart && !isBlockEnd) {
                    finalLines.push(line);
                  } else if (inBlockComment && isBlockEnd) {
                    finalLines.push(`${line}</span>`);
                    inBlockComment = false;
                  } else {
                    highlightedCode = (0, libs_1.highlightCode)(element.language, line);
                    finalLines.push(highlightedCode);
                    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) {
                      const tableLines = [];
                      tableLines.push(lines[i]);
                      tableLines.push(lines[i + 1]);
                      i += 2;
                      while (i < lines.length && lines[i].includes("|") && !lines[i].trim().startsWith("#") && lines[i].trim().length > 0) {
                        tableLines.push(lines[i]);
                        i++;
                      }
                      continue;
                    }
                  }
                }
              }
              highlightedCode = finalLines.join("\n");
            }
            return `
          <div class="md-code-container">
            ${addCopyToClipboard ? `<button onclick="copyToClipboard(this)">Copy</button>` : ""}
            <pre><code class="md-code${element.language ? "-" + element.language : ""}">${(0, exports.escapeHtml)(highlightedCode)}</code></pre>
          </div>
        `;
          case "ul":
            return `<ul>
${element.content}
</ul>
`;
          case "ol":
            return `<ol>
${element.content}
</ol>
`;
          case "li":
            return `<li>${(0, exports.escapeHtml)(element.content)}</li>
`;
          case "p":
            return `<p>${parseInlineStyles(element.content)}</p>
`;
          default:
            return "";
        }
      };
      exports.elementToHtml = elementToHtml;
      var globalScript = () => `
  <script>
    function copyToClipboard(button) {
      const codeBlock = button.parentElement.querySelector('code');
      const text = codeBlock.innerText.replace(/\uFF1C/g, '<').replace(/\uFF1E/g, '>');
      navigator.clipboard.writeText(text).then(() => {
        button.innerText = 'Copied!';
        setTimeout(() => button.innerText = 'Copy', 2000);
      });
    }
  <\/script>
`;
      exports.globalScript = globalScript;
      var checkboxScript = () => `
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.md-checkbox input[type="checkbox"]').forEach(function(cb) {
        cb.addEventListener('change', function() {
          if (cb.checked) {
            cb.nextElementSibling && cb.nextElementSibling.classList.add('md-checked');
          } else {
            cb.nextElementSibling && cb.nextElementSibling.classList.remove('md-checked');
          }
        });
      });
    });
  <\/script>
`;
      exports.checkboxScript = checkboxScript;
    }
  });

  // node_modules/ts-markdown-parser/dist/utils/metadata-parser.js
  var require_metadata_parser = __commonJS({
    "node_modules/ts-markdown-parser/dist/utils/metadata-parser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.parseMetadata = void 0;
      var libs_1 = require_libs2();
      var slugify = (str) => {
        return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\- ]+/g, "").replace(/[\s\-]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").trim();
      };
      var normalizeString = (str) => {
        return str.replace(/[\"\u201C\u201D\u201E\u201F]+/g, "").replace(/[\u2018\u2019\u201A\u2039\u203A]+/g, "").trim().toLowerCase();
      };
      var formatDate = (dateStr) => {
        const parsedDate = new Date(dateStr);
        if (parsedDate.toString() !== "Invalid Date") {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const day = String(parsedDate.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
        return null;
      };
      var stripQuotes = (str) => {
        return str.replace(/(^["'`]+|["'`]+$)/g, "");
      };
      var parseYaml = (yamlString) => {
        if (typeof yamlString !== "string" || !yamlString) {
          throw new Error(`YAML string is invalid: ${typeof yamlString}`);
        }
        const yamlLines = (0, libs_1.stripLeadingWhitespace)(yamlString).split("\n");
        const result = {};
        yamlLines.forEach((line) => {
          const [key, ...valueParts] = line.split(":").map((str) => str.trim());
          const value = valueParts.join(":").trim();
          if (key && value) {
            const trimmedKey = key.trim();
            if (normalizeString(trimmedKey).includes("keyword")) {
              if (value.includes(",")) {
                const splitKeywords = value.split(",");
                result[trimmedKey] = splitKeywords.map((kw) => normalizeString(kw.replace(/[\"|\']+/g, ""))).filter((kw) => kw);
              } else {
                result[trimmedKey] = [normalizeString(value.replace(/[\"|\'|\,]+/g, ""))].filter((kw) => kw);
              }
            } else if (normalizeString(trimmedKey).includes("slug")) {
              const slug = stripQuotes(value);
              if (slug) {
                result[trimmedKey] = slugify(slug);
              } else {
                result[trimmedKey] = "";
              }
            } else if (/date|created_at|createdat|creation_date/i.test(normalizeString(trimmedKey))) {
              const formattedDate = formatDate(value);
              if (formattedDate !== null) {
                result[trimmedKey] = formattedDate;
              } else {
                const numberValue = parseFloat(stripQuotes(value));
                result[trimmedKey] = isNaN(numberValue) ? value : numberValue;
              }
            } else {
              try {
                const parsedNum = parseFloat(stripQuotes(value));
                if (isNaN(parsedNum)) {
                  result[trimmedKey] = stripQuotes(value);
                } else {
                  result[trimmedKey] = parsedNum;
                }
              } catch (err) {
                result[trimmedKey] = stripQuotes(value);
              }
            }
          }
        });
        return result;
      };
      var parseMetadata = (markdown) => {
        if (!markdown || typeof markdown !== "string") {
          return {};
        }
        const lines = (0, libs_1.stripLeadingWhitespace)(markdown).split("\n");
        const metadataBlock = [];
        let metadata = {};
        let inMetadata = false;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line === "---" && i === 0) {
            inMetadata = true;
            continue;
          }
          if (line === "---" && inMetadata) {
            inMetadata = false;
            metadata = parseYaml(metadataBlock.join("\n"));
            break;
          }
          if (inMetadata) {
            metadataBlock.push(line);
          }
        }
        return metadata;
      };
      exports.parseMetadata = parseMetadata;
    }
  });

  // node_modules/ts-markdown-parser/dist/index.js
  var require_dist = __commonJS({
    "node_modules/ts-markdown-parser/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getMarkdownMetadata = exports.markdownToHtml = void 0;
      var markdown_parser_1 = require_markdown_parser();
      var metadata_parser_1 = require_metadata_parser();
      var warnedDeprecatedBoolean = false;
      var markdownToHtml2 = (markdown, opts = true) => {
        const addCopyToClipboard = opts === false || typeof opts === "object" && opts.addCopyToClipboard === false ? false : true;
        const interactiveCheckboxes = typeof opts === "object" ? !!(opts === null || opts === void 0 ? void 0 : opts.interactiveCheckboxes) : false;
        const elements = (0, markdown_parser_1.parseMarkdown)(markdown);
        let html = "";
        if (typeof opts === "boolean" && !warnedDeprecatedBoolean) {
          console.warn("\x1B[33m[markdownToHtml] Passing a boolean as the 2nd arg is deprecated. Please use an options object.\x1B[37m");
          warnedDeprecatedBoolean = true;
        }
        const totalEles = elements.length;
        for (let i = 0; i < totalEles; i++) {
          const opts2 = { addCopyToClipboard };
          html += (0, markdown_parser_1.elementToHtml)(elements[i], opts2);
        }
        if (interactiveCheckboxes && html.includes(`<li class="md-checkbox">`) && html.includes(`type="checkbox" disabled`)) {
          const disabledCheckboxRe = /<input type="checkbox" disabled/gm;
          html = html.replace(disabledCheckboxRe, `<input type="checkbox"`);
          html += (0, markdown_parser_1.checkboxScript)();
        }
        if (addCopyToClipboard && html.includes(`<div class="md-code-container"`)) {
          html += (0, markdown_parser_1.globalScript)();
        }
        return html;
      };
      exports.markdownToHtml = markdownToHtml2;
      var getMarkdownMetadata = (markdown) => {
        return (0, metadata_parser_1.parseMetadata)(markdown);
      };
      exports.getMarkdownMetadata = getMarkdownMetadata;
    }
  });

  // ../constants.ts
  var PROTOCOL = "http://";
  var DOMEN = "91.122.215.194";
  var BASE_URL = PROTOCOL + DOMEN;
  var WS_URL = "ws://" + DOMEN;
  var STATIC_URL = "/static";
  var AVATARS_URL = STATIC_URL + "/images/avatars/";
  var AUTH_API_URL = BASE_URL + ":8081";
  var CHAT_URL = BASE_URL + ":3000/chat";
  var SIGN_IN_URL = BASE_URL + ":3000/sign_in";
  var CHAT_WS_URL = WS_URL + ":8080/api/chat_ws";

  // objects/chat_info.ts
  var ChatsInfo = class {
    constructor(id, avatar, chat_name, members_id) {
      this.id = id;
      this.avatar = avatar;
      this.chat_name = chat_name;
      this.members_id = members_id;
    }
  };

  // ui_objects/sidebar.ts
  var SidebarUI = class {
    constructor(ws) {
      // HTML elements
      this.sidebarDiv = document.querySelector("#main_sidebar");
      this.userInfoDiv = document.querySelector(".sidebar__user-info");
      this.userInfoAvatarImage = this.userInfoDiv.querySelector("img");
      this.userInfoNameDiv = this.userInfoDiv.querySelector(".sidebar__user-info__header-info__name");
      this.ws = ws;
    }
    setupChats(chats_info) {
      console.log(chats_info);
      chats_info.forEach((chat2, index) => {
        this.addChat(chat2);
      });
    }
    setUserInfo(user_info) {
      this.userInfoAvatarImage.src = AVATARS_URL + user_info.avatar;
      this.userInfoNameDiv.innerText = user_info.login;
    }
    addChat(chat2) {
      const chat_info_button = document.createElement("button");
      chat_info_button.id = `chat_${chat2.chat_id}_info`;
      chat_info_button.classList.add("chat__info");
      chat_info_button.classList.add("sidebar-element");
      chat_info_button.addEventListener("click", (ev) => {
        this.ws.openChatMessage(chat2.chat_id);
        this.currentChat = new ChatsInfo(
          chat2.chat_id,
          chat2.chat_avatar,
          chat2.chat_name,
          chat2.members_id
        );
      });
      const chat_avatar_div = document.createElement("div");
      const chat_avatar_img = document.createElement("img");
      chat_avatar_img.src = `/static/images/avatars/${chat2.chat_avatar}`;
      chat_avatar_div.append(chat_avatar_img);
      const chat_info_text = document.createElement("div");
      chat_info_text.classList.add("chat_info__text");
      const chat_info_name = document.createElement("div");
      chat_info_name.classList.add("chat__info-name");
      chat_info_name.classList.add("line-limit-length");
      chat_info_name.innerText = chat2.chat_name;
      chat_info_text.append(chat_info_name);
      chat_info_button.append(chat_info_text);
      this.sidebarDiv.append(chat_info_button);
    }
    show() {
    }
  };

  // node_modules/websocket-ts/dist/esm/src/backoff/exponentialbackoff.js
  var ExponentialBackoff = class {
    /**
     * Creates a new ExponentialBackoff.
     * @param base the base of the exponentiation
     * @param expMax the maximum exponent, no bound if undefined
     */
    constructor(base, expMax) {
      this._retries = 0;
      if (!Number.isInteger(base) || base < 0) {
        throw new Error("Base must be a positive integer or zero");
      }
      if (expMax !== void 0 && (!Number.isInteger(expMax) || expMax < 0)) {
        throw new Error("ExpMax must be undefined, a positive integer, or zero");
      }
      this.base = base;
      this.expMax = expMax;
      this.i = 0;
    }
    get retries() {
      return this._retries;
    }
    get current() {
      return this.base * Math.pow(2, this.i);
    }
    next() {
      this._retries++;
      this.i = this.expMax === void 0 ? this.i + 1 : Math.min(this.i + 1, this.expMax);
      return this.current;
    }
    reset() {
      this._retries = 0;
      this.i = 0;
    }
  };

  // node_modules/websocket-ts/dist/esm/src/queue/array_queue.js
  var ArrayQueue = class {
    constructor() {
      this.elements = [];
    }
    add(element) {
      this.elements.push(element);
    }
    clear() {
      this.elements.length = 0;
    }
    forEach(fn) {
      this.elements.forEach(fn);
    }
    length() {
      return this.elements.length;
    }
    isEmpty() {
      return this.elements.length === 0;
    }
    peek() {
      return this.elements[0];
    }
    read() {
      return this.elements.shift();
    }
  };

  // node_modules/websocket-ts/dist/esm/src/websocket_event.js
  var WebsocketEvent = {
    /** Fired when the connection is opened. */
    open: "open",
    /** Fired when the connection is closed. */
    close: "close",
    /** Fired when the connection has been closed because of an error, such as when some data couldn't be sent. */
    error: "error",
    /** Fired when a message is received. */
    message: "message",
    /** Fired when the websocket tries to reconnect after a connection loss. */
    retry: "retry",
    /** Fired when the websocket successfully reconnects after a connection loss. */
    reconnect: "reconnect"
  };

  // node_modules/websocket-ts/dist/esm/src/websocket.js
  var Websocket = class {
    /**
     * Creates a new websocket.
     *
     * @param url to connect to, or a function that returns a URL.
     * @param protocols optional protocols to use.
     * @param options optional options to use.
     */
    constructor(url, protocols, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
      this._closedByUser = false;
      this.handleOpenEvent = (event) => this.handleEvent(WebsocketEvent.open, event);
      this.handleErrorEvent = (event) => this.handleEvent(WebsocketEvent.error, event);
      this.handleCloseEvent = (event) => this.handleEvent(WebsocketEvent.close, event);
      this.handleMessageEvent = (event) => this.handleEvent(WebsocketEvent.message, event);
      this._urlProvider = url;
      this._protocols = protocols;
      this._options = {
        buffer: options === null || options === void 0 ? void 0 : options.buffer,
        retry: {
          maxRetries: (_a = options === null || options === void 0 ? void 0 : options.retry) === null || _a === void 0 ? void 0 : _a.maxRetries,
          instantReconnect: (_b = options === null || options === void 0 ? void 0 : options.retry) === null || _b === void 0 ? void 0 : _b.instantReconnect,
          backoff: (_c = options === null || options === void 0 ? void 0 : options.retry) === null || _c === void 0 ? void 0 : _c.backoff
        },
        listeners: {
          open: [...(_e = (_d = options === null || options === void 0 ? void 0 : options.listeners) === null || _d === void 0 ? void 0 : _d.open) !== null && _e !== void 0 ? _e : []],
          close: [...(_g = (_f = options === null || options === void 0 ? void 0 : options.listeners) === null || _f === void 0 ? void 0 : _f.close) !== null && _g !== void 0 ? _g : []],
          error: [...(_j = (_h = options === null || options === void 0 ? void 0 : options.listeners) === null || _h === void 0 ? void 0 : _h.error) !== null && _j !== void 0 ? _j : []],
          message: [...(_l = (_k = options === null || options === void 0 ? void 0 : options.listeners) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : []],
          retry: [...(_o = (_m = options === null || options === void 0 ? void 0 : options.listeners) === null || _m === void 0 ? void 0 : _m.retry) !== null && _o !== void 0 ? _o : []],
          reconnect: [...(_q = (_p = options === null || options === void 0 ? void 0 : options.listeners) === null || _p === void 0 ? void 0 : _p.reconnect) !== null && _q !== void 0 ? _q : []]
        }
      };
      this._underlyingWebsocket = this.tryConnect();
    }
    /**
     * Getter for the url.
     *
     * @return the url.
     */
    get url() {
      return this._url;
    }
    /**
     * Getter for the protocols.
     *
     * @return the protocols, or undefined if none were provided.
     */
    get protocols() {
      return this._protocols;
    }
    /**
     * Getter for the buffer.
     *
     * @return the buffer, or undefined if none was provided.
     */
    get buffer() {
      return this._options.buffer;
    }
    /**
     * Getter for the maxRetries.
     *
     * @return the maxRetries, or undefined if none was provided (no limit).
     */
    get maxRetries() {
      return this._options.retry.maxRetries;
    }
    /**
     * Getter for the instantReconnect.
     *
     * @return the instantReconnect, or undefined if none was provided.
     */
    get instantReconnect() {
      return this._options.retry.instantReconnect;
    }
    /**
     * Getter for the backoff.
     *
     * @return the backoff, or undefined if none was provided.
     */
    get backoff() {
      return this._options.retry.backoff;
    }
    /**
     * Whether the websocket was closed by the user. A websocket is closed by the user by calling close().
     *
     * @return true if the websocket was closed by the user, false otherwise.
     */
    get closedByUser() {
      return this._closedByUser;
    }
    /**
     * Getter for the last 'open' event, e.g. the last time the websocket was connected.
     *
     * @return the last 'open' event, or undefined if the websocket was never connected.
     */
    get lastConnection() {
      return this._lastConnection;
    }
    /**
     * Getter for the underlying websocket. This can be used to access the browser's native websocket directly.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
     * @return the underlying websocket.
     */
    get underlyingWebsocket() {
      return this._underlyingWebsocket;
    }
    /**
     * Getter for the readyState of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
     * @return the readyState of the underlying websocket.
     */
    get readyState() {
      return this._underlyingWebsocket.readyState;
    }
    /**
     * Getter for the bufferedAmount of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount
     * @return the bufferedAmount of the underlying websocket.
     */
    get bufferedAmount() {
      return this._underlyingWebsocket.bufferedAmount;
    }
    /**
     * Getter for the extensions of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/extensions
     * @return the extensions of the underlying websocket.
     */
    get extensions() {
      return this._underlyingWebsocket.extensions;
    }
    /**
     * Getter for the binaryType of the underlying websocket.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType
     * @return the binaryType of the underlying websocket.
     */
    get binaryType() {
      return this._underlyingWebsocket.binaryType;
    }
    /**
     * Setter for the binaryType of the underlying websocket.
     *
     * @param value to set, 'blob' or 'arraybuffer'.
     */
    set binaryType(value) {
      this._underlyingWebsocket.binaryType = value;
    }
    /**
     * Sends data over the websocket.
     *
     * If the websocket is not connected and a buffer was provided on creation, the data will be added to the buffer.
     * If no buffer was provided or the websocket was closed by the user, the data will be dropped.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
     * @param data to send.
     */
    send(data) {
      if (this.closedByUser)
        return;
      if (this._underlyingWebsocket.readyState === this._underlyingWebsocket.OPEN) {
        this._underlyingWebsocket.send(data);
      } else if (this.buffer !== void 0) {
        this.buffer.add(data);
      }
    }
    /**
     * Close the websocket. No connection-retry will be attempted after this.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
     * @param code optional close code.
     * @param reason optional close reason.
     */
    close(code, reason) {
      this.cancelScheduledConnectionRetry();
      this._closedByUser = true;
      this._underlyingWebsocket.close(code, reason);
    }
    /**
     * Adds an event listener for the given event-type.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type of the event to add the listener for.
     * @param listener to add.
     * @param options to use when adding the listener.
     */
    addEventListener(type, listener, options) {
      this._options.listeners[type].push({ listener, options });
    }
    /**
     * Removes one or more event listener for the given event-type that match the given listener and options.
     *
     * @param type of the event to remove the listener for.
     * @param listener to remove.
     * @param options that were used when the listener was added.
     */
    removeEventListener(type, listener, options) {
      const isListenerNotToBeRemoved = (l) => l.listener !== listener || l.options !== options;
      this._options.listeners[type] = this._options.listeners[type].filter(isListenerNotToBeRemoved);
    }
    /**
     * Creates a new browser-native websocket and connects it to the given URL with the given protocols
     * and adds all event listeners to the browser-native websocket.
     *
     * @return the created browser-native websocket which is also stored in the '_underlyingWebsocket' property.
     */
    tryConnect() {
      this._url = typeof this._urlProvider === "function" ? this._urlProvider() : this._urlProvider;
      this._underlyingWebsocket = new WebSocket(this._url, this.protocols);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.open, this.handleOpenEvent);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.close, this.handleCloseEvent);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.error, this.handleErrorEvent);
      this._underlyingWebsocket.addEventListener(WebsocketEvent.message, this.handleMessageEvent);
      return this._underlyingWebsocket;
    }
    /**
     * Removes all event listeners from the browser-native websocket and closes it.
     */
    clearWebsocket() {
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.open, this.handleOpenEvent);
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.close, this.handleCloseEvent);
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.error, this.handleErrorEvent);
      this._underlyingWebsocket.removeEventListener(WebsocketEvent.message, this.handleMessageEvent);
      this._underlyingWebsocket.close();
    }
    /**
     * Dispatch an event to all listeners of the given event-type.
     *
     * @param type of the event to dispatch.
     * @param event to dispatch.
     */
    dispatchEvent(type, event) {
      const eventListeners = this._options.listeners[type];
      const newEventListeners = [];
      eventListeners.forEach(({ listener, options }) => {
        listener(this, event);
        if (options === void 0 || options.once === void 0 || !options.once) {
          newEventListeners.push({ listener, options });
        }
      });
      this._options.listeners[type] = newEventListeners;
    }
    /**
     * Handles the given event by dispatching it to all listeners of the given event-type.
     *
     * @param type of the event to handle.
     * @param event to handle.
     */
    handleEvent(type, event) {
      switch (type) {
        case WebsocketEvent.close:
          this.dispatchEvent(type, event);
          this.scheduleConnectionRetryIfNeeded();
          break;
        case WebsocketEvent.open:
          if (this.backoff !== void 0 && this._lastConnection !== void 0) {
            const detail = {
              retries: this.backoff.retries,
              lastConnection: new Date(this._lastConnection)
            };
            const event2 = new CustomEvent(WebsocketEvent.reconnect, {
              detail
            });
            this.dispatchEvent(WebsocketEvent.reconnect, event2);
            this.backoff.reset();
          }
          this._lastConnection = /* @__PURE__ */ new Date();
          this.dispatchEvent(type, event);
          this.sendBufferedData();
          break;
        case WebsocketEvent.retry:
          this.dispatchEvent(type, event);
          this.clearWebsocket();
          this.tryConnect();
          break;
        default:
          this.dispatchEvent(type, event);
          break;
      }
    }
    /**
     * Sends buffered data if there is a buffer defined.
     */
    sendBufferedData() {
      if (this.buffer === void 0) {
        return;
      }
      for (let ele = this.buffer.read(); ele !== void 0; ele = this.buffer.read()) {
        this.send(ele);
      }
    }
    /**
     * Schedules a connection-retry if there is a backoff defined and the websocket was not closed by the user.
     */
    scheduleConnectionRetryIfNeeded() {
      if (this.closedByUser) {
        return;
      }
      if (this.backoff === void 0) {
        return;
      }
      const handleRetryEvent = (detail) => {
        const event = new CustomEvent(WebsocketEvent.retry, { detail });
        this.handleEvent(WebsocketEvent.retry, event);
      };
      const retryEventDetail = {
        backoff: this._options.retry.instantReconnect === true ? 0 : this.backoff.next(),
        retries: this._options.retry.instantReconnect === true ? 0 : this.backoff.retries,
        lastConnection: this._lastConnection
      };
      if (this._options.retry.maxRetries === void 0 || retryEventDetail.retries <= this._options.retry.maxRetries) {
        this.retryTimeout = globalThis.setTimeout(() => handleRetryEvent(retryEventDetail), retryEventDetail.backoff);
      }
    }
    /**
     * Cancels the scheduled connection-retry, if there is one.
     */
    cancelScheduledConnectionRetry() {
      globalThis.clearTimeout(this.retryTimeout);
    }
  };

  // node_modules/websocket-ts/dist/esm/src/websocket_builder.js
  var WebsocketBuilder = class {
    /**
     * Creates a new WebsocketBuilder.
     *
     * @param url the url to connect to, or a function that returns a URL
     */
    constructor(url) {
      this._url = url;
    }
    /**
     * Getter for the url.
     *
     * @returns the url or url provider
     */
    get url() {
      return this._url;
    }
    /**
     * Adds protocols to the websocket. Subsequent calls to this method will override the previously set protocols.
     *
     * @param protocols the protocols to add
     */
    withProtocols(protocols) {
      this._protocols = protocols;
      return this;
    }
    /**
     * Getter for the protocols.
     *
     * @returns the protocols, undefined if no protocols have been set
     */
    get protocols() {
      return this._protocols;
    }
    /**
     * Sets the maximum number of retries before giving up. No limit if undefined.
     *
     * @param maxRetries the maximum number of retries before giving up
     */
    withMaxRetries(maxRetries) {
      var _a;
      this._options = Object.assign(Object.assign({}, this._options), { retry: Object.assign(Object.assign({}, (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry), { maxRetries }) });
      return this;
    }
    /**
     * Getter for the maximum number of retries before giving up.
     *
     * @returns the maximum number of retries before giving up, undefined if no maximum has been set
     */
    get maxRetries() {
      var _a, _b;
      return (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry) === null || _b === void 0 ? void 0 : _b.maxRetries;
    }
    /**
     * Sets whether to reconnect immediately after a connection has been lost, ignoring the backoff strategy for the first retry.
     *
     * @param instantReconnect whether to reconnect immediately after a connection has been lost
     */
    withInstantReconnect(instantReconnect) {
      var _a;
      this._options = Object.assign(Object.assign({}, this._options), { retry: Object.assign(Object.assign({}, (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry), { instantReconnect }) });
      return this;
    }
    /**
     * Getter for whether to reconnect immediately after a connection has been lost, ignoring the backoff strategy for the first retry.
     *
     * @returns whether to reconnect immediately after a connection has been lost, undefined if no value has been set
     */
    get instantReconnect() {
      var _a, _b;
      return (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry) === null || _b === void 0 ? void 0 : _b.instantReconnect;
    }
    /**
     * Adds a backoff to the websocket. Subsequent calls to this method will override the previously set backoff.
     *
     * @param backoff the backoff to add
     */
    withBackoff(backoff) {
      var _a;
      this._options = Object.assign(Object.assign({}, this._options), { retry: Object.assign(Object.assign({}, (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry), { backoff }) });
      return this;
    }
    /**
     * Getter for the backoff.
     *
     * @returns the backoff, undefined if no backoff has been set
     */
    get backoff() {
      var _a, _b;
      return (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.retry) === null || _b === void 0 ? void 0 : _b.backoff;
    }
    /**
     * Adds a buffer to the websocket. Subsequent calls to this method will override the previously set buffer.
     *
     * @param buffer the buffer to add
     */
    withBuffer(buffer) {
      this._options = Object.assign(Object.assign({}, this._options), { buffer });
      return this;
    }
    /**
     * Getter for the buffer.
     *
     * @returns the buffer, undefined if no buffer has been set
     */
    get buffer() {
      var _a;
      return (_a = this._options) === null || _a === void 0 ? void 0 : _a.buffer;
    }
    /**
     * Adds an 'open' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onOpen(listener, options) {
      this.addListener(WebsocketEvent.open, listener, options);
      return this;
    }
    /**
     * Adds an 'close' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onClose(listener, options) {
      this.addListener(WebsocketEvent.close, listener, options);
      return this;
    }
    /**
     * Adds an 'error' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onError(listener, options) {
      this.addListener(WebsocketEvent.error, listener, options);
      return this;
    }
    /**
     * Adds an 'message' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onMessage(listener, options) {
      this.addListener(WebsocketEvent.message, listener, options);
      return this;
    }
    /**
     * Adds an 'retry' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onRetry(listener, options) {
      this.addListener(WebsocketEvent.retry, listener, options);
      return this;
    }
    /**
     * Adds an 'reconnect' event listener to the websocket. Subsequent calls to this method will add additional listeners that will be
     * called in the order they were added.
     *
     * @param listener the listener to add
     * @param options the listener options
     */
    onReconnect(listener, options) {
      this.addListener(WebsocketEvent.reconnect, listener, options);
      return this;
    }
    /**
     * Builds the websocket.
     *
     * @return a new websocket, with the set options
     */
    build() {
      return new Websocket(this._url, this._protocols, this._options);
    }
    /**
     * Adds an event listener to the options.
     *
     * @param event the event to add the listener to
     * @param listener the listener to add
     * @param options the listener options
     */
    addListener(event, listener, options) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
      this._options = Object.assign(Object.assign({}, this._options), { listeners: {
        open: (_c = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.listeners) === null || _b === void 0 ? void 0 : _b.open) !== null && _c !== void 0 ? _c : [],
        close: (_f = (_e = (_d = this._options) === null || _d === void 0 ? void 0 : _d.listeners) === null || _e === void 0 ? void 0 : _e.close) !== null && _f !== void 0 ? _f : [],
        error: (_j = (_h = (_g = this._options) === null || _g === void 0 ? void 0 : _g.listeners) === null || _h === void 0 ? void 0 : _h.error) !== null && _j !== void 0 ? _j : [],
        message: (_m = (_l = (_k = this._options) === null || _k === void 0 ? void 0 : _k.listeners) === null || _l === void 0 ? void 0 : _l.message) !== null && _m !== void 0 ? _m : [],
        retry: (_q = (_p = (_o = this._options) === null || _o === void 0 ? void 0 : _o.listeners) === null || _p === void 0 ? void 0 : _p.retry) !== null && _q !== void 0 ? _q : [],
        reconnect: (_t = (_s = (_r = this._options) === null || _r === void 0 ? void 0 : _r.listeners) === null || _s === void 0 ? void 0 : _s.reconnect) !== null && _t !== void 0 ? _t : [],
        [event]: [
          ...(_w = (_v = (_u = this._options) === null || _u === void 0 ? void 0 : _u.listeners) === null || _v === void 0 ? void 0 : _v[event]) !== null && _w !== void 0 ? _w : [],
          { listener, options }
        ]
      } });
      return this;
    }
  };

  // ws_messages/message.ts
  var AuthRequest = class {
    constructor(user_id2, token2) {
      this.user_id = user_id2;
      this.token = token2;
    }
  };
  var UserMessage = class {
    constructor(type, content) {
      this.message_type = type;
      this.content = content;
    }
  };

  // websocket_connection.ts
  var WebsocketManager = class {
    constructor() {
      this.ws = new WebsocketBuilder(CHAT_WS_URL).withBuffer(new ArrayQueue()).withBackoff(new ExponentialBackoff(1e3, 6)).build();
    }
    /*              MESSAGES                */
    // base message
    sendMessage(message) {
      this.ws.send(message);
    }
    // start chat message
    startChatMessage(login) {
      this.ws.send(
        JSON.stringify(new UserMessage(
          "START_CHAT" /* START_CHAT */,
          login
        ))
      );
    }
    // Authorization message
    authorizationMessage(user_id2, token2) {
      this.ws.send(JSON.stringify(
        new UserMessage(
          "AUTH_CHECK" /* AUTH_CHECK */,
          JSON.stringify(
            new AuthRequest(
              user_id2,
              token2
            )
          )
        )
      ));
    }
    // Get chats message
    getChatsMessage() {
      this.ws.send(JSON.stringify(
        new UserMessage(
          "GET_CHATS" /* GET_CHATS */,
          ""
        )
      ));
    }
    // Open chat message
    openChatMessage(chat_id) {
      this.ws.send(JSON.stringify(
        new UserMessage(
          "OPEN_CHAT" /* OPEN_CHAT */,
          chat_id.toString()
        )
      ));
    }
    // Send message to user
    sendChatMessage(message) {
      this.ws.send(JSON.stringify(
        new UserMessage(
          "SEND_MESSAGE" /* SEND_MESSAGE */,
          JSON.stringify(message)
        )
      ));
    }
    // Send fist message
    sendChatFirstMessage(message) {
      this.ws.send(JSON.stringify(
        new UserMessage(
          "START_CHAT" /* START_CHAT */,
          JSON.stringify(message)
        )
      ));
    }
    /*              LISTENERS              */
    addEventListeners(open, close, message, reconnect) {
      this.ws.addEventListener(WebsocketEvent.open, open);
      this.ws.addEventListener(WebsocketEvent.close, close);
      this.ws.addEventListener(WebsocketEvent.message, message);
      this.ws.addEventListener(WebsocketEvent.reconnect, reconnect);
    }
  };

  // objects/chats_user_with_info.ts
  var ChatsUserWithInfo = class {
  };

  // ui_objects/pop_up/start_new_chat.ts
  var PopUpNewChatUI = class {
    constructor(ws_manager2) {
      this.popUpElement = document.querySelector("#pop_up_start_new_chat");
      this.findUser = this.popUpElement.querySelector(".pop_up__form-find_button");
      this.backgroundElement = this.popUpElement.querySelector(".pop_up__background");
      this.inputElement = this.popUpElement.querySelector(".pop_up__form-login_input");
      this.formContainerElement = this.popUpElement.querySelector(".pop_up__form-container");
      this.backgroundElement.addEventListener("click", () => this.close());
      this.findUser.addEventListener("click", () => {
        ws_manager2.startChatMessage(this.inputElement.value);
      });
      this.inputElement.addEventListener("keypress", (ev) => {
        if (ev.keyCode == 13) {
          ev.preventDefault();
          ws_manager2.startChatMessage(this.inputElement.value);
        }
      });
    }
    show() {
      this.popUpElement.style.display = "flex";
    }
    close() {
      this.popUpElement.style.display = "none";
      this.inputElement.value = "";
    }
  };

  // objects/user_info.ts
  var UserShortInfo = class {
  };

  // objects/chat_message.ts
  var MessageContent = class {
    constructor(answer_to, forwarded_from, text_content, photos_content, files) {
      if (typeof answer_to != typeof text_content) {
        this.answer_to = answer_to;
        this.forwarded_from = forwarded_from;
        this.text_content = text_content;
        this.photos_content = photos_content;
        this.files = files;
      }
    }
  };
  var ChatMessages = class {
    constructor(id, who_sended, send_time, content) {
      if (typeof id != typeof send_time) {
        this.id = id;
        this.who_sended = who_sended;
        this.send_time = send_time.hmsTime;
        this.content = content;
      }
    }
  };
  var SendMessage = class {
    constructor(id_to, first_message, what) {
      this.id_to = id_to;
      this.first_message = first_message;
      this.what = what;
    }
  };

  // objects/time.ts
  var Time = class {
    get isoTime() {
      return this._time;
    }
    get hmsTime() {
      return this._time.slice(0, 10);
    }
    constructor(time) {
      this._time = time.toISOString();
    }
  };

  // ui_objects/chat.ts
  var import_ts_markdown_parser = __toESM(require_dist());
  var ChatUI = class {
    /*                  CONSTRUCTOR              */
    constructor(ws, sidebar2, user_id2) {
      // Elements on page
      this.chatElement = document.querySelector("#chat_body");
      this.chatHeaderElement = this.chatElement.querySelector(".chat__header");
      this.chatAvatarElement = this.chatHeaderElement.querySelector(".chat__header-avatar");
      this.chatAvatartImage = this.chatAvatarElement.querySelector("img");
      this.chatInfoElement = this.chatHeaderElement.querySelector(".chat__header-info");
      this.chatNameElement = this.chatHeaderElement.querySelector(".chat__header-info__name");
      this.chatBodyElement = this.chatElement.querySelector(".chat__body");
      this.chatBodyTextElement = this.chatBodyElement.querySelector(".chat__body-text");
      this.chatInputElement = this.chatElement.querySelector(".chat__input");
      this.chatInputField = this.chatInputElement.querySelector(".chat__input-text");
      this.chatButtonSend = this.chatInputElement.querySelector(".chat__input-button");
      // Chat message info
      this._message_id = 0;
      this._answer_to = -1;
      this._forwarded_from = -1;
      this._photos_content = [];
      this._files = [];
      // Markdown options
      this.md_options = { addCopyToClipboard: true, interactiveCheckboxes: false };
      this.first_message = false;
      this.ws = ws;
      this.user_id = user_id2;
      this.close();
      this.chatButtonSend.addEventListener("click", () => this.send_message());
      this.chatInputElement.addEventListener("keypress", (ev) => {
        if (ev.keyCode == 13 && !ev.shiftKey) {
          ev.preventDefault();
          this.send_message();
        }
        ;
      });
    }
    set chat_id(value) {
      this.chat.id = value;
    }
    get chat_id() {
      return this.chat.id;
    }
    /*                  UI METHODS                */
    show() {
      this.chatElement.style.display = "flex";
      this.chatBodyTextElement.scroll(0, this.chatBodyTextElement.scrollHeight);
      this.add_header();
    }
    close() {
      this.chatBodyTextElement.innerHTML = "";
      this.chatElement.style.display = "none";
    }
    // Add header
    add_header() {
      this.chatAvatartImage.src = AVATARS_URL + this.chat.avatar;
      this.chatNameElement.innerText = this.chat.chat_name;
      this.chatAvatartImage.style.display = "block";
    }
    // Add message to page
    add_message(message) {
      const hmtlContent = (0, import_ts_markdown_parser.markdownToHtml)(message.content.text_content, this.md_options);
      const sended_message_container = document.createElement("div");
      sended_message_container.classList.add("chat__body-text__message-container");
      const sended_message_text = document.createElement("div");
      if (message.who_sended == this.user_id)
        sended_message_text.classList.add("chat__body-text__sended_message");
      else sended_message_text.classList.add("chat__body-text__recieved_message");
      sended_message_text.classList.add("message-text");
      sended_message_text.innerHTML = hmtlContent;
      sended_message_container.append(sended_message_text);
      this.chatBodyTextElement.append(sended_message_container);
    }
    /*                  MESSAGE METHODS              */
    open_chat(chat2, messages) {
      this.close();
      this.chat = chat2;
      messages.forEach((message, ind) => {
        this.add_message(message);
      });
      this.show();
    }
    start_chat(user_info) {
      this.close();
      this.first_message = true;
      this.chat = new ChatsInfo(
        user_info.chat_id,
        user_info.chat_avatar,
        user_info.chat_name,
        user_info.members_id
      );
      this.show();
    }
    send_message() {
      if (this.chatInputField.innerText == "") {
        alert("\u0422\u0435\u043A\u0441\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043F\u0443\u0441\u0442\u044B\u043C!");
        return;
      }
      const message = new MessageContent(
        this._answer_to,
        this._forwarded_from,
        this.chatInputField.innerText,
        this._photos_content,
        this._files
      );
      this.ws.sendChatMessage(
        new SendMessage(
          this.chat_id,
          this.first_message,
          message
        )
      );
      this.add_message(
        new ChatMessages(
          this._message_id,
          this.user_id,
          new Time(/* @__PURE__ */ new Date()),
          message
        )
      );
      this.chatInputField.innerText = "";
      this.chatBodyTextElement.scroll(0, this.chatBodyTextElement.scrollHeight);
      this.first_message = false;
      this._message_id++;
    }
  };

  // index.ts
  var user_id = parseInt(localStorage.getItem("user_id"));
  var token = localStorage.getItem("access_token");
  var ws_manager = new WebsocketManager();
  var sidebar = new SidebarUI(ws_manager);
  var pop_up_new_chat = new PopUpNewChatUI(ws_manager);
  var chat = new ChatUI(ws_manager, sidebar, user_id);
  var initialized = false;
  if (token != null && !Number.isNaN(user_id)) {
    ws_manager.addEventListeners(
      // On open
      async () => {
        console.log("Open connection!");
        ws_manager.authorizationMessage(user_id, token);
      },
      // On close 
      async () => {
        console.log("Close connection!");
      },
      // On message
      async (i, ev) => {
        try {
          const ans = JSON.parse(ev.data);
          switch (ans["message_type"]) {
            // Auth check
            case "AUTH_CHECK" /* AUTH_CHECK */: {
              if (ans["content"] == "ACCESS_DENIED") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_id");
                window.location.replace("/sign_in");
              } else {
                console.log("Access to user allowed!");
                console.log(initialized);
                if (!initialized) {
                  initialized = true;
                  await ws_manager.getChatsMessage();
                }
              }
              break;
            }
            // Get user short info
            case "USER_SHORT_INFO" /* USER_SHORT_INFO */: {
              const user_info = Object.assign(new UserShortInfo(), JSON.parse(ans["content"]));
              console.log(user_info);
              sidebar.setUserInfo(user_info);
              break;
            }
            // Get chats
            case "GET_CHATS" /* GET_CHATS */: {
              const chats = JSON.parse(ans["content"]);
              chats.forEach((chat2, index) => {
                chat2 = Object.assign(new ChatsUserWithInfo(), chat2);
              });
              sidebar.setupChats(chats);
              break;
            }
            case "START_CHAT" /* START_CHAT */: {
              if (ans["content"] == "USER_NOT_FOUND") {
                alert("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442!");
                break;
              }
              pop_up_new_chat.close();
              const short_info = Object.assign(new ChatsUserWithInfo(), JSON.parse(ans["content"]));
              chat.start_chat(short_info);
              break;
            }
            case "OPEN_CHAT" /* OPEN_CHAT */: {
              if (ans["content"] == "CHAT_NOT_FOUND") {
                alert("\u0427\u0430\u0442\u0430 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442!");
                break;
              }
              const chat_messages = JSON.parse(ans["content"]);
              chat_messages.forEach((message, ind) => {
                message = Object.assign(new ChatMessages(), message);
              });
              chat.open_chat(sidebar.currentChat, chat_messages);
              break;
            }
            case "CREATE_CHAT" /* CREATE_CHAT */: {
              const chat_info = Object.assign(new ChatsUserWithInfo(), JSON.parse(ans["content"]));
              chat.chat_id = chat_info.chat_id;
              sidebar.addChat(chat_info);
              break;
            }
            case "SEND_MESSAGE" /* SEND_MESSAGE */: {
              const message = Object.assign(new ChatMessages(), JSON.parse(ans["content"]));
              message.content = Object.assign(new MessageContent(), message.content);
              if (message.id == chat.chat_id) chat.add_message(message);
              break;
            }
          }
        } catch (error) {
          console.log("Server message: ", ev.data);
        }
      },
      () => {
        console.log("recconect");
      }
    );
    const create_new_chat_button = document.querySelector("#sidebar__create-chat");
    create_new_chat_button?.addEventListener("click", (event) => {
      pop_up_new_chat.show();
    });
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    window.location.replace(SIGN_IN_URL);
  }
})();
/*! Bundled license information:

ts-markdown-parser/dist/index.js:
  (*! Parse as boolean or object key, but default to `true` in either case (THIS BOOLEAN IS DEPRECATED) *)
*/
