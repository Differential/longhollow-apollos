import fs from 'fs';
import path from 'path';
import { Buffer } from 'node:buffer';
import { PKPass } from 'passkit-generator';
import ApollosConfig from '../config/index.js';

const readFile = (filePath) => fs.readFileSync(filePath);

const resolveCertificate = (value) => {
  if (typeof value !== 'string') return value;
  if (fs.existsSync(value)) return readFile(value);
  return value;
};

const buildTemplateBuffers = (modelPath) => {
  const buffers = {};
  const entries = fs.readdirSync(modelPath, { withFileTypes: true });
  entries.forEach((entry) => {
    if (!entry.isFile()) return;
    if (entry.name === 'pass.json') return;
    const filePath = path.join(modelPath, entry.name);
    buffers[entry.name] = readFile(filePath);
  });
  return buffers;
};

const buildCertificates = () => ({
  wwdr: resolveCertificate(ApollosConfig.PASS.CERTIFICATES.WWDR),
  signerCert: resolveCertificate(ApollosConfig.PASS.CERTIFICATES.SIGNER_CERT),
  signerKey: resolveCertificate(ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY),
  signerKeyPassphrase: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY_PASSPHRASE,
});

class ApollosPassGenerator {
  constructor(options = {}) {
    const { model } = options;
    const buffers = buildTemplateBuffers(model);
    const certificates = buildCertificates();
    this.pass = new PKPass(buffers, certificates);
    this.passProps = null;
  }

  setProps = (props) => {
    this.passProps = props;
  };

  async load(uri, filename) {
    if (!uri) return;
    let buffer;
    if (uri.startsWith('data:')) {
      const base64 = uri.split(',')[1] || '';
      buffer = Buffer.from(base64, 'base64');
    } else if (fs.existsSync(uri)) {
      buffer = readFile(uri);
    } else {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to load pass asset: ${response.status} ${uri}`);
      }
      buffer = Buffer.from(await response.arrayBuffer());
    }
    this.pass.addBuffer(filename, buffer);
  }

  async generate() {
    if (this.passProps) {
      const passJson = Buffer.from(JSON.stringify(this.passProps));
      this.pass.addBuffer('pass.json', passJson);
    }
    return this.pass.getAsStream();
  }
}

export default ApollosPassGenerator;
