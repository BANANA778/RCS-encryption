let currentSlide = 1;
const totalSlides = 5;
let p, q, n, phi, e, d;
let encryptedNumbers = [];

function updateProgressBar() {
    const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Update active steps
    for (let i = 1; i <= totalSlides; i++) {
        const step = document.getElementById(`step${i}`);
        if (i <= currentSlide) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    }
}

function nextSlide() {
    if (currentSlide === 1) {
        // Validate primes on slide 1 before proceeding
        p = parseInt(document.getElementById('prime1').value);
        q = parseInt(document.getElementById('prime2').value);
        
        if (!isPrime(p) || !isPrime(q) || p === q) {
            alert('Please enter two distinct prime numbers under 30.');
            return;
        }
        
        // Calculate keys
        calculateKeys();
        
        // Prepare slide 2 animation
        prepareKeyExplanation();
    } else if (currentSlide === 3) {
        // Prepare encryption visualization
        const message = document.getElementById('message').value;
        if (!message) {
            alert('Please enter a message to encrypt.');
            return;
        }
        prepareEncryptionVisualization(message);
    }
    
    document.getElementById(`slide${currentSlide}`).classList.remove('active');
    document.getElementById(`slide${currentSlide}`).classList.add('previous');
    currentSlide++;
    document.getElementById(`slide${currentSlide}`).classList.add('active');
    
    updateProgressBar();
    
    if (currentSlide === 2) {
        // Start the typing animation for key explanation
        animateKeyExplanation();
    } else if (currentSlide === 4) {
        // Prepare decryption visualization
        prepareDecryptionVisualization();
    } else if (currentSlide === 5) {
        // Show final keys
        document.getElementById('finalPublicKey').textContent = `(${n}, ${e})`;
        document.getElementById('finalPrivateKey').textContent = `(${n}, ${d})`;
    }
}

function prevSlide() {
    document.getElementById(`slide${currentSlide}`).classList.remove('active');
    currentSlide--;
    document.getElementById(`slide${currentSlide}`).classList.remove('previous');
    document.getElementById(`slide${currentSlide}`).classList.add('active');
    
    updateProgressBar();
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function calculateKeys() {
    // Calculate n and phi
    n = p * q;
    phi = (p - 1) * (q - 1);
    
    // Find e (public exponent)
    e = 3;
    while (gcd(e, phi) !== 1) e++;
    
    // Find d (private exponent)
    d = 1;
    while ((d * e) % phi !== 1) d++;
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function prepareKeyExplanation() {
    const explanation = `
        <div class="explanation">
            <p>1. First we calculate <span class="highlight">n = p × q</span></p>
            <p class="equation">n = ${p} × ${q} = ${n}</p>
            
            <p>2. Then calculate <span class="highlight">φ(n) = (p-1) × (q-1)</span></p>
            <p class="equation">φ(n) = (${p}-1) × (${q}-1) = ${phi}</p>
            
            <p>3. Choose <span class="highlight">e</span> (public exponent) where 1 < e < φ(n) and gcd(e, φ(n)) = 1</p>
            <p class="equation">e = ${e}</p>
            
            <p>4. Calculate <span class="highlight">d</span> (private exponent) where (d × e) mod φ(n) = 1</p>
            <p class="equation">d = ${d} (because ${d} × ${e} mod ${phi} = ${(d * e) % phi})</p>
        </div>
    `;
    
    document.getElementById('keyExplanation').innerHTML = explanation;
    document.getElementById('publicKeyDisplay').textContent = `${n}, ${e}`;
    document.getElementById('privateKeyDisplay').textContent = `${n}, ${d}`;
}

function animateKeyExplanation() {
    const elements = document.querySelectorAll('#keyExplanation .explanation > *');
    let delay = 0;
    
    elements.forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease';
            el.style.opacity = '1';
        }, delay);
        delay += 1000;
    });
    
    setTimeout(() => {
        document.getElementById('finalKeys').style.display = 'block';
    }, delay + 1000);
}

function prepareEncryptionVisualization(message) {
    const originalBox = document.getElementById('originalMessage');
    const asciiBox = document.getElementById('asciiCodes');
    const resultBox = document.getElementById('encryptedResult');
    
    // Show original message
    originalBox.innerHTML = '';
    for (let char of message) {
        const charBox = document.createElement('span');
        charBox.className = 'char-box';
        charBox.textContent = char;
        originalBox.appendChild(charBox);
    }
    
    // Show ASCII codes
    asciiBox.innerHTML = '';
    for (let char of message) {
        const code = char.charCodeAt(0);
        const codeBox = document.createElement('span');
        codeBox.className = 'number-box';
        codeBox.textContent = code;
        asciiBox.appendChild(codeBox);
    }
    
    // Show encrypted result
    resultBox.innerHTML = '';
    encryptedNumbers = [];
    for (let char of message) {
        const code = char.charCodeAt(0);
        const encrypted = modPow(code, e, n);
        encryptedNumbers.push(encrypted);
        const encryptedBox = document.createElement('span');
        encryptedBox.className = 'number-box';
        encryptedBox.textContent = encrypted;
        resultBox.appendChild(encryptedBox);
    }
    
    document.getElementById('encryptVisualization').style.display = 'block';
}

function prepareDecryptionVisualization() {
    const encryptedBox = document.getElementById('encryptedNumbers');
    const asciiBox = document.getElementById('decryptedAscii');
    const messageBox = document.getElementById('decryptedMessage');
    
    // Show encrypted numbers
    encryptedBox.innerHTML = '';
    for (let num of encryptedNumbers) {
        const numBox = document.createElement('span');
        numBox.className = 'number-box';
        numBox.textContent = num;
        encryptedBox.appendChild(numBox);
    }
    
    // Show decrypted ASCII codes
    asciiBox.innerHTML = '';
    const decryptedCodes = [];
    for (let num of encryptedNumbers) {
        const decrypted = modPow(num, d, n);
        decryptedCodes.push(decrypted);
        const codeBox = document.createElement('span');
        codeBox.className = 'number-box';
        codeBox.textContent = decrypted;
        asciiBox.appendChild(codeBox);
    }
    
    // Show decrypted message
    messageBox.innerHTML = '';
    for (let code of decryptedCodes) {
        const char = String.fromCharCode(code);
        const charBox = document.createElement('span');
        charBox.className = 'char-box';
        charBox.textContent = char;
        messageBox.appendChild(charBox);
    }
    
    document.getElementById('decryptVisualization').style.display = 'block';
}

function modPow(base, exponent, mod) {
    let result = 1;
    base = base % mod;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % mod;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % mod;
    }
    return result;
}