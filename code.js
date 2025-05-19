function gcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    return b === 0n ? a : gcd(b, a % b);
}

function generateKeys() {
    const p = BigInt(document.getElementById('prime1').value);
    const q = BigInt(document.getElementById('prime2').value);
    if (!p || !q || p === q) return alert('Please enter two distinct prime numbers.');

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    let e = 3n;
    while (gcd(e, phi) !== 1n) e++;

    let d = 1n;
    while ((d * e) % phi !== 1n) d++;

    document.getElementById('keysOutput').textContent = `Public Key: (${n}, ${e})\nPrivate Key: (${n}, ${d})`;
    document.getElementById('publicKey').value = `${n},${e}`;
    document.getElementById('privateKey').value = `${n},${d}`;
}

function modPow(base, exponent, mod) {
    base = BigInt(base);
    exponent = BigInt(exponent);
    mod = BigInt(mod);
    let result = 1n;
    base = base % mod;
    while (exponent > 0) {
        if (exponent % 2n === 1n) {
            result = (result * base) % mod;
        }
        exponent = exponent / 2n;
        base = (base * base) % mod;
    }
    return result;
}

function encryptMessage() {
    const message = document.getElementById('message').value;
    const [n, e] = document.getElementById('publicKey').value.split(',').map(x => BigInt(x));
    if (!n || !e) return alert("Please enter a valid public key.");

    const encrypted = Array.from(message).map(char =>
        modPow(char.charCodeAt(0), e, n).toString()
    );
    document.getElementById('encryptedMessage').textContent = encrypted.join(' ');
}

function decryptMessage() {
    const [n, d] = document.getElementById('privateKey').value.split(',').map(x => BigInt(x));
    if (!n || !d) return alert("Please enter a valid private key.");

    const encrypted = document.getElementById('encryptedMessage').textContent.trim().split(' ').map(BigInt);
    const decrypted = encrypted.map(code =>
        String.fromCharCode(Number(modPow(code, d, n)))
    ).join('');
    document.getElementById('decryptedMessage').textContent = decrypted;
}

