from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
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
    iv = encrypted_data[:16]
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = cipher.decryptor()

    data = decryptor.update(encrypted_data[16:]) + decryptor.finalize()
    return data.rstrip(b"\x00")
