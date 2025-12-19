import Crypto from 'crypto';

const LEGACY_ALGORITHM = 'aes-192-cbc';
const LEGACY_KEY_LENGTH = 24;
const LEGACY_IV_LENGTH = 16;

const evpBytesToKey = (password, keyLen, ivLen, salt) => {
  let data = Buffer.alloc(0);
  let prev = Buffer.alloc(0);

  while (data.length < keyLen + ivLen) {
    const md5 = Crypto.createHash('md5');
    md5.update(prev);
    md5.update(password);
    if (salt) md5.update(salt);
    prev = md5.digest();
    data = Buffer.concat([data, prev]);
  }

  return {
    key: data.subarray(0, keyLen),
    iv: data.subarray(keyLen, keyLen + ivLen),
  };
};

const getLegacyKeyAndIv = (secret) =>
  evpBytesToKey(
    Buffer.from(`${secret}`, 'utf8'),
    LEGACY_KEY_LENGTH,
    LEGACY_IV_LENGTH
  );

export const createLegacyCipher = (secret) => {
  const { key, iv } = getLegacyKeyAndIv(secret);
  return Crypto.createCipheriv(LEGACY_ALGORITHM, key, iv);
};

export const createLegacyDecipher = (secret) => {
  const { key, iv } = getLegacyKeyAndIv(secret);
  return Crypto.createDecipheriv(LEGACY_ALGORITHM, key, iv);
};
