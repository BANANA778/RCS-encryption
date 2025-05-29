let currentSlide = 1;
const totalSlides = 5;
let p, q, n, phi, e, d;
let encryptedNumbers = [];

function updateProgressBar() {
    const progress = ((currentSlide - 1) / (totalSlides - 1)) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
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
    if (currentSlide < totalSlides) {
        if (currentSlide === 1 && !validatePrimes()) {
            p = parseInt(document.getElementById('prime1').value);
            q = parseInt(document.getElementById('prime2').value);
           
            if (!isPrime(p) || !isPrime(q) || p === q) {
                alert('Please enter two distinct prime numbers under 30.');
                return;
            }
            
            calculateKeys();
            prepareKeyExplanation();
            const message = document.getElementById('message').value;
            if (!message) {
                alert('Please enter a message to encrypt.');
                return;
            }
            prepareEncryptionVisualization(message);
        } //it move to updateEncryptionVisualization 
        
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        currentSlide++;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
        
        updateProgressBar();
        
        if (currentSlide === 2) {
            animateKeyExplanation();
        } else if (currentSlide === 4) {
            prepareDecryptionVisualization();
        } else if (currentSlide === 5) {
            document.getElementById('finalPublicKey').textContent = `(${n}, ${e})`;
            document.getElementById('finalPrivateKey').textContent = `(${n}, ${d})`;
        }
        if (currentSlide === 3) {
            const message = document.getElementById('message').value;
            if (!message.trim()) {
                alert('Please enter a message to encrypt.');
                return;
            }
            prepareEncryptionVisualization(message);
        }
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        currentSlide--;
        document.getElementById(`slide${currentSlide}`).classList.add('active');
        updateProgressBar();
    }
    if (currentSlide === 3) {
        document.getElementById('encryptVisualization').style.display = 'none';
    }
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function calculateKeys() {
    n = p * q;
    phi = (p - 1) * (q - 1);
    e = 3;
    while (gcd(e, phi) !== 1) e++;
    d = 1;
    while ((d * e) % phi !== 1) d++;
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function animateKeyExplanation() {
    const typingText = document.getElementById('typingText');
    let index = 0;
    const text = "Calculating keys...";
    typingText.textContent = "";

    const interval = setInterval(() => {
        typingText.textContent += text.charAt(index);
        index++;
        if (index === text.length) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('keyExplanation').innerHTML = ""; // Clear typing
                prepareKeyExplanation(); 
            }, 500);
        }
    }, 50);
}

function prepareKeyExplanation() {
    const explanationHTML = `
        <div class="explanation">
            <p>1. First we calculate <span class="highlight">n = p × q</span></p>
            <p class="equation">n = ${p} × ${q} = ${n}</p>

            <p>2. Then calculate <span class="highlight">φ(n) = (p - 1) × (q - 1)</span></p>
            <p class="equation">φ(n) = (${p} - 1) × (${q} - 1) = ${phi}</p>

            <p>3. Choose <span class="highlight">e</span>, a number that is coprime with φ(n) and 1 &lt; e &lt; φ(n)</p>
            <p class="equation">e = ${e}</p>

            <p>4. Compute the modular inverse of e to get <span class="highlight">d</span></p>
            <p class="equation">d = ${d}, because (d × e) mod φ(n) = 1</p>
        </div>
    `;
    document.getElementById("keyExplanation").innerHTML = explanationHTML;
    document.getElementById("finalPublicKey").textContent = `(${n}, ${e})`;
    document.getElementById("privateKeyDisplay").textContent = `(${n}, ${d})`;
    document.getElementById("finalKeys").style.display = "block";
}

function validatePrimes() {
    const pInput = document.getElementById('prime1');
    const qInput = document.getElementById('prime2');
    const p = parseInt(pInput.value);
    const q = parseInt(qInput.value);
    // prime check
    if (!isPrime(p) || !isPrime(q)) {
        const messages = [
            "If it divides evenly, I don't want it.",
            "This number has more factors than my dating history.",
            "This number couldn't be prime if it tried."
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
        return false;
    }
    //emtpy or whitespace check
    if (!pInput.value.trim() || !qInput.value.trim()) {
        const messages = [
            "Empty like my patience.",
            "The absence of effort is noted.",
            "You gave me whitespace. I can't encrypt vibes.",
            "Whitespace doesn't count unless you're coding Python. And you're not."
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
        return false;
    }
    // not a number check
    if (isNaN(p) || isNaN(q)) {
        const messages = [
            "This isn't Scrabble. Put a real number in.",
            "Unless '" + (isNaN(p) ? pInput.value : qInput.value) + "' is a new kind of integer, I need digits.",
            "What is that? No, seriously. What is that???",
            "Congratulations, you've unlocked... absolutely nothing. Use a number.",
            "Can't calculate vibes. Numbers only."
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
        return false;
    }
    // same number check
    if (p === q) {
        const messages = [
            "Two primes, one brain cell. Try again.",
            "Plot twist: you need *different* numbers. Wild, I know.",
            "Same number? How original. Try two distinct primes.",
            "I need two primes, not a prime and its shadow.",
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
        return false;
    }
    //size check
    if (p * q < 128) {
        const messages = [
            "We're doing encryption, not preschool math. Try BIGGER.",
            "That number's adorable. Unfortunately, useless. Go BIGGER.",
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
        return false;
    }
    // upper limit check
    if (p > 100 || q > 100) {
        const messages = [
            "I'm not solving Collatz conjecture here. Pick something smaller.",
            "Okay, calm down with the giant numbers.",
            "We get it, you can count. Now pick reasonably."
        ];
        alert(messages[Math.floor(Math.random() * messages.length)]);
        return false;
    }
    
    return true;
}


function updateEncryptionVisualization() {
    const message = document.getElementById('message').value;
    if (!message) {
        alert('Please enter a message first');
        return;
    }
    prepareEncryptionVisualization(message);
}

function prepareEncryptionVisualization(message) {
    const originalBox = document.getElementById('originalMessage');
    const asciiBox = document.getElementById('asciiCodes');
    const resultBox = document.getElementById('encryptedResult');
    
    originalBox.innerHTML = '';
    for (let char of message) {
        const charBox = document.createElement('span');
        charBox.className = 'char-box';
        charBox.textContent = char;
        originalBox.appendChild(charBox);
    }
    

    asciiBox.innerHTML = '';
    for (let char of message) {
        const code = char.charCodeAt(0);
        const codeBox = document.createElement('span');
        codeBox.className = 'number-box';
        codeBox.textContent = code;
        asciiBox.appendChild(codeBox);
    }
    
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
    

    encryptedBox.innerHTML = '';
    for (let num of encryptedNumbers) {
        const numBox = document.createElement('span');
        numBox.className = 'number-box';
        numBox.textContent = num;
        encryptedBox.appendChild(numBox);
    }
    
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