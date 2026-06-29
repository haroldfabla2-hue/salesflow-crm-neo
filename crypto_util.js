/**
 * ============================================================================
 * CRYPTO UTILITY FOR SALESFLOW CRM (ENTERPRISE GRADE)
 * Compliance: Ley N° 29733 (Confidentiality & Data Protection)
 * Cipher: AES-256-GCM with PBKDF2 Key Derivation
 * Support: Multi-version Key Rotation
 * ============================================================================
 */

const crypto = require('crypto');

// In production, these should be loaded from a secure environment variable or KMS
const MASTER_SECRETS = {
    'v1': 'sf_master_secret_2026_super_secure_key_placeholder_for_salesflow_crm',
    // 'v2': 'new_rotated_secret_for_future_rotation'
};

const ACTIVE_VERSION = 'v1';
const KDF_ITERATIONS = 100000;
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;
const SALT_SIZE = 16;

/**
 * Derives a strong 256-bit key from a master secret and a salt using PBKDF2.
 * @param {string} secret 
 * @param {Buffer} salt 
 * @returns {Buffer}
 */
function deriveKey(secret, salt) {
    return crypto.pbkdf2Sync(secret, salt, KDF_ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Output format: version:salt_hex:iv_hex:auth_tag_hex:ciphertext_hex
 * @param {string} plaintext 
 * @returns {string} Encrypted ciphertext string with metadata prefix
 */
function encrypt(plaintext) {
    if (!plaintext) return null;

    const secret = MASTER_SECRETS[ACTIVE_VERSION];
    if (!secret) {
        throw new Error(`[CryptoError]: La versión activa de llave de cifrado ${ACTIVE_VERSION} no está configurada.`);
    }

    // 1. Generate salt and derive unique key for this payload
    const salt = crypto.randomBytes(SALT_SIZE);
    const key = deriveKey(secret, salt);

    // 2. Generate cryptographically strong IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // 3. Encrypt data
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    // 4. Retrieve Authentication Tag
    const authTag = cipher.getAuthTag();

    // 5. Package and return the structured string
    return [
        ACTIVE_VERSION,
        salt.toString('hex'),
        iv.toString('hex'),
        authTag.toString('hex'),
        ciphertext
    ].join(':');
}

/**
 * Decrypts a ciphertext string created by the encrypt function.
 * @param {string} encryptedPayload String format: version:salt:iv:tag:ciphertext
 * @returns {string} Original plaintext
 */
function decrypt(encryptedPayload) {
    if (!encryptedPayload) return null;

    const parts = encryptedPayload.split(':');
    if (parts.length !== 5) {
        throw new Error('[CryptoError]: Formato de carga cifrada inválido. Debe tener 5 segmentos.');
    }

    const [version, saltHex, ivHex, authTagHex, ciphertextHex] = parts;
    const secret = MASTER_SECRETS[version];
    if (!secret) {
        throw new Error(`[CryptoError]: La llave versión ${version} para desencriptar no se encuentra en el llavero de seguridad.`);
    }

    // Convert hex segments back to Buffers
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    // 1. Derive the identical key using the stored salt
    const key = deriveKey(secret, salt);

    // 2. Decrypt data
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    return plaintext;
}

/**
 * Partially masks sensitive personal data for lower-tier roles (sales agents).
 * Example: "juan.perez@dominio.com" -> "jua*****@dominio.com"
 * Example: "+51 987654321" -> "+51 987***321"
 * @param {string} decryptedText 
 * @param {string} type 'email' | 'phone'
 * @returns {string} Masked string
 */
function maskData(decryptedText, type) {
    if (!decryptedText) return '';
    
    if (type === 'email') {
        const parts = decryptedText.split('@');
        if (parts.length !== 2) return '*****';
        const [username, domain] = parts;
        if (username.length <= 3) {
            return username[0] + '*****@' + domain;
        }
        return username.slice(0, 3) + '*****@' + domain;
    }
    
    if (type === 'phone') {
        const clean = decryptedText.trim();
        if (clean.length < 6) return '******';
        // Mask the middle characters
        const start = clean.slice(0, clean.length - 6);
        const middle = '***';
        const end = clean.slice(clean.length - 3);
        return start + middle + end;
    }
    
    return '*****';
}

/**
 * Verifies the X-Hub-Signature-256 signature sent by Meta (WhatsApp).
 * @param {string|Buffer} rawPayload The raw body of the request.
 * @param {string} signatureHeader The X-Hub-Signature-256 header.
 * @returns {boolean} True if signature is valid.
 */
function verifySignature(rawPayload, signatureHeader) {
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    // Si no está configurado, actuamos en modo bypass para pruebas locales
    if (!appSecret) {
        return true;
    }
    if (!signatureHeader) return false;

    const parts = signatureHeader.split('=');
    if (parts.length !== 2 || parts[0] !== 'sha256') return false;

    const signature = parts[1];
    const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(rawPayload)
        .digest('hex');

    // Comparación en tiempo constante para evitar ataques de temporización
    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'), 
            Buffer.from(expectedSignature, 'hex')
        );
    } catch (e) {
        return false;
    }
}

module.exports = {
    encrypt,
    decrypt,
    maskData,
    verifySignature
};

