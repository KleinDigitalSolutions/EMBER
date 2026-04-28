const Module = require("node:module");
const path = require("node:path");

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveServerOnlyStub(request, parent, isMain, options) {
  if (request === "server-only") {
    return path.join(__dirname, "server-only-stub.cjs");
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
