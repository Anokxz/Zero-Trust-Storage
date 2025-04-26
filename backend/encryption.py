from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import os

def generate_key():
    return os.urandom(32) 

def encrypt_file(file_data: bytes, key: bytes):
    iv = os.urandom(16)
    aes_cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = aes_cipher.encryptor()

    # Manual padding
    pad_len = 16 - len(file_data) % 16
    file_data += bytes([pad_len]) * pad_len

    aes_encrypted = encryptor.update(file_data) + encryptor.finalize()

    # Step 2: ChaCha20 encryption on AES output (iv + ciphertext)
    nonce = os.urandom(16)
    chacha_cipher = Cipher(algorithms.ChaCha20(key, nonce), mode=None)
    chacha_encryptor = chacha_cipher.encryptor()

    chacha_encrypted = chacha_encryptor.update(iv + aes_encrypted)

    # Final output: nonce + chacha20_encrypted_data
    return nonce + chacha_encrypted

def decrypt_file(encrypted_data: bytes, key: bytes):
    # Step 1: ChaCha20 decryption
    nonce = encrypted_data[:16]
    chacha_encrypted = encrypted_data[16:]

    chacha_cipher = Cipher(algorithms.ChaCha20(key, nonce), mode=None)
    chacha_decryptor = chacha_cipher.decryptor()

    aes_combined = chacha_decryptor.update(chacha_encrypted)

    iv = aes_combined[:16]
    aes_encrypted = aes_combined[16:]

    # Step 2: AES-CBC decryption
    aes_cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = aes_cipher.decryptor()
    decrypted_padded = decryptor.update(aes_encrypted) + decryptor.finalize()

    # Remove padding
    pad_len = decrypted_padded[-1]
    return decrypted_padded[:-pad_len]
