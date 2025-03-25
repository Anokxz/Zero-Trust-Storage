from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import os

def generate_key():
    return os.urandom(32)

def encrypt_file(file_data: bytes, key: bytes):
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()

    padding = 16 - len(file_data) % 16
    file_data += bytes([padding]) * padding

    return iv + encryptor.update(file_data) + encryptor.finalize()

def decrypt_file(encrypted_data: bytes, key: bytes):
    iv = encrypted_data[:16]  # Extract IV from the beginning
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = cipher.decryptor()

    decrypted_data = decryptor.update(encrypted_data[16:]) + decryptor.finalize()

    # Remove PKCS7 padding
    unpadder = padding.PKCS7(128).unpadder()
    unpadded_data = unpadder.update(decrypted_data) + unpadder.finalize()

    return unpadded_data  # Returns the cleaned plaintext
