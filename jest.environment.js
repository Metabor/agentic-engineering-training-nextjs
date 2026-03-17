const { default: JsDomEnvironment } = require("jest-environment-jsdom");

// Extends jsdom environment to inject Node.js globals that jsdom doesn't expose.
// Chakra UI v3 uses structuredClone which is available in Node.js 17+ but not in jsdom.
class CustomJsDomEnvironment extends JsDomEnvironment {
  async setup() {
    await super.setup();
    this.global.structuredClone = structuredClone;
  }
}

module.exports = CustomJsDomEnvironment;
