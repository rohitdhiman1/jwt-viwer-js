document.addEventListener('DOMContentLoaded', function() {
    const decodeBtn = document.getElementById('decode-btn');
    const jwtTokenInput = document.getElementById('jwtToken');
    const headerOutput = document.getElementById('headerJson');
    const payloadOutput = document.getElementById('payloadJson');
    const errorOutput = document.getElementById('error');
    const themeToggle = document.getElementById('theme-toggle');

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
// ...existing code...
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
});