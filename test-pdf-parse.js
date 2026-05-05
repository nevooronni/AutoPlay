if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor(init) {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}
const fs = require('fs');
// Let's create a dummy pdf or try to run pdf-parse as a function
const pdfParse = require('pdf-parse');
console.log(typeof pdfParse === 'function' ? 'function' : 'object');
