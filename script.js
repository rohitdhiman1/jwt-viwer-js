document.addEventListener('DOMContentLoaded', function() {
    const decodeBtn = document.getElementById('decode-btn');
    const jwtTokenInput = document.getElementById('jwtToken');
    const headerOutput = document.getElementById('headerJson');
    const payloadOutput = document.getElementById('payloadJson');
    const errorOutput = document.getElementById('error');
    const themeToggle = document.getElementById('theme-toggle');

    // Tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tab = link.dataset.tab;

            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
        });
    });

    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.checked = false;
            localStorage.setItem('theme', 'light');
        }
    }

    themeToggle.addEventListener('change', () => {
        setDarkMode(themeToggle.checked);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
    }


    function syntaxHighlight(json) {
        if (!json) return '';
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)|(\b(true|false|null)\b)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    decodeBtn.addEventListener('click', () => {
        const token = jwtTokenInput.value;
        const isSigned = document.querySelector('input[name="jwtType"]:checked').value === 'signed';
        errorOutput.textContent = '';
        headerOutput.innerHTML = '';
        payloadOutput.innerHTML = '';

        if (!token) {
            errorOutput.textContent = 'Please paste a JWT token.';
            return;
        }

        try {
            if (isSigned) {
                // Use the correct global variable for jwt-decode
                var decodeFn = window.jwt_decode || window.jwtDecode;
                if (!decodeFn) throw new Error('jwt-decode library not loaded.');
                const decodedHeader = decodeFn(token, { header: true });
                const decodedPayload = decodeFn(token);

                const headerStr = JSON.stringify(decodedHeader, null, 2);
                const payloadStr = JSON.stringify(decodedPayload, null, 2);

                headerOutput.innerHTML = syntaxHighlight(headerStr);
                payloadOutput.innerHTML = syntaxHighlight(payloadStr);
            } else {
                // Unsigned token handling
                const parts = token.split('.');
                if (parts.length < 2) {
                    throw new Error('Invalid unsigned JWT token.');
                }
                const decodedHeader = JSON.parse(atob(parts[0]));
                const decodedPayload = JSON.parse(atob(parts[1]));

                const headerStr = JSON.stringify(decodedHeader, null, 2);
                const payloadStr = JSON.stringify(decodedPayload, null, 2);

                headerOutput.innerHTML = syntaxHighlight(headerStr);
                payloadOutput.innerHTML = syntaxHighlight(payloadStr);
            }
        } catch (e) {
            errorOutput.textContent = e.message;
        }
    });

    // Encode functionality
    const addPairBtn = document.getElementById('add-pair-btn');
    const payloadKvPairs = document.getElementById('payload-kv-pairs');
    const encodeBtn = document.getElementById('encode-btn');
    const generatedJwt = document.getElementById('generated-jwt');
    const secretKeyInput = document.getElementById('secret-key');
    const secretKeyWrapper = document.getElementById('secret-key-wrapper');
    const encodeJwtTypeRadios = document.querySelectorAll('input[name="encodeJwtType"]');

    function createKvPair() {
        const pairDiv = document.createElement('div');
        pairDiv.className = 'kv-pair';
        pairDiv.innerHTML = `
            <input type="text" class="key" placeholder="Key">
            <input type="text" class="value" placeholder="Value">
            <button class="remove-pair-btn">-</button>
        `;
        payloadKvPairs.appendChild(pairDiv);
        pairDiv.querySelector('.remove-pair-btn').addEventListener('click', () => {
            pairDiv.remove();
        });
    }

    addPairBtn.addEventListener('click', createKvPair);

    encodeJwtTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            secretKeyWrapper.style.display = radio.value === 'signed' ? 'block' : 'none';
        });
    });


    encodeBtn.addEventListener('click', () => {
        const payload = {};
        const pairs = payloadKvPairs.querySelectorAll('.kv-pair');
        pairs.forEach(pair => {
            const key = pair.querySelector('.key').value;
            const value = pair.querySelector('.value').value;
            if (key) {
                payload[key] = value;
            }
        });

        const isSigned = document.querySelector('input[name="encodeJwtType"]:checked').value === 'signed';
        
        try {
            let token;
            if (isSigned) {
                const secret = secretKeyInput.value;
                if (!secret) {
                    alert('Please provide a secret key for a signed token.');
                    return;
                }
                const header = { alg: 'HS256', typ: 'JWT' };
                token = KJUR.jws.JWS.sign('HS256', JSON.stringify(header), JSON.stringify(payload), secret);
            } else {
                const header = { alg: 'none', typ: 'JWT' };
                const sHeader = JSON.stringify(header);
                const sPayload = JSON.stringify(payload);
                token = btoa(sHeader).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_') + '.' +
                        btoa(sPayload).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_') + '.';
            }
            generatedJwt.value = token;
        } catch (e) {
            alert('Error generating token: ' + e.message);
        }
    });

    // Initial state
    createKvPair();
    secretKeyWrapper.style.display = 'block';
});