document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalBody = document.querySelector('.terminal-body');

    if (!terminalInput || !terminalHistory) return;

    const commands = {
        'help': 'Available commands: help, clear, whoami, ls, projects, skills, contact, social',
        'whoami': 'Aryan Yadav - CS Student, Web Developer, and Cybersecurity Enthusiast.',
        'ls': 'about.txt  projects/  skills/  certifications/',
        'projects': 'Featured: Property Shodh, Virtual Office. Type "ls projects" for details.',
        'skills': 'Languages: Python, JS, TS, Java, C++. Frontend: React, Next.js. Backend: Node.js, Express.',
        'contact': 'Email: aryan.yadav.prof@gmail.com',
        'social': 'GitHub: github.com/Aryan20051  |  LinkedIn: linkedin.com/in/aryan-yadav01',
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.toLowerCase().trim();
            executeCommand(input);
            terminalInput.value = '';
        }
    });

    // Keep focus on input when clicking terminal
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    function executeCommand(cmd) {
        // Add to history
        const historyLine = document.createElement('div');
        historyLine.className = 'terminal-history-line';
        historyLine.innerHTML = `<span class="terminal-prompt">aryan@dev</span><span class="terminal-text">:~$</span> <span>${cmd}</span>`;
        terminalHistory.appendChild(historyLine);

        if (cmd === '') return;

        if (cmd === 'clear') {
            terminalHistory.innerHTML = '';
            // Also clear the default output if desired, or just leave it
            return;
        }

        const output = document.createElement('div');
        output.className = 'terminal-output';
        output.style.marginBottom = '12px';

        if (commands[cmd]) {
            output.textContent = commands[cmd];
        } else {
            output.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        terminalHistory.appendChild(output);

        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
});
