import fs from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import ApollosConfig from '../config/index.js';

const readFile = fs.promises.readFile;
const readdir = fs.promises.readdir;

const buildCertificates = () => ({
  wwdr: ApollosConfig.PASS.CERTIFICATES.WWDR,
  signerCert: ApollosConfig.PASS.CERTIFICATES.SIGNER_CERT,
  signerKey: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY,
  signerKeyPassphrase: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY_PASSPHRASE,
});

const bufferFromDataUri = (uri) => {
  if (!uri) return null;
  const match = uri.match(/^data:.*;base64,(.+)$/);
  if (!match) return null;
  return Buffer.from(match[1], 'base64');
};

const readModelBuffers = async (modelPath) => {
  const buffers = {};

  const walk = async (dir, prefix = '') => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.posix.join(prefix, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, relativePath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (entry.name === 'pass.json') continue;
      buffers[relativePath] = await readFile(fullPath);
    }
  };

  await walk(modelPath);
  return buffers;
};

class ApollosPassGenerator {
  constructor(options = {}) {
    this._props = null;
    this.shouldOverwrite = false;
    this.Certificates = { _raw: buildCertificates() };
    this._passPromise = this._createPass(options);
  }

  async _createPass({ model, props } = {}) {
    const buffers = model ? await readModelBuffers(model) : {};
    const pass = new PKPass(buffers, buildCertificates(), props);
    return pass;
  }

  async load(uri, filename) {
    const pass = await this._passPromise;
    const buffer = bufferFromDataUri(uri);
    if (!buffer) return;
    pass.addBuffer(filename, buffer);
  }

  async generate() {
    const pass = await this._passPromise;
    if (this.shouldOverwrite && this._props) {
      pass.addBuffer('pass.json', Buffer.from(JSON.stringify(this._props)));
    }
    return pass.getAsStream();
  }
}

export default ApollosPassGenerator;
