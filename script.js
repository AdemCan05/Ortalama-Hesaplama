/**
 * İSTE Bell Curve Calculator - Application Logic & Interactive Particles
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- PWA Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(err => {
                console.log('SW Registration failed: ', err);
            });
        });
    }

    // --- State ---
    let currentLang = localStorage.getItem('lang') || 'tr';
    let bellCurveChart = null;

    // --- DOM Elements ---
    const langTrBtn = document.getElementById('lang-tr');
    const langEnBtn = document.getElementById('lang-en');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // View Toggles
    const calculatorView = document.getElementById('calculator-view');
    const simulatorView = document.getElementById('simulator-view');
    const tabCalc = document.getElementById('tab-calc');
    const tabSim = document.getElementById('tab-sim');

    // Calculator
    const calcForm = document.getElementById('calc-form');
    const midtermInput = document.getElementById('midterm');
    const finalInput = document.getElementById('final');
    const optionalInput = document.getElementById('optional');
    const calcError = document.getElementById('calc-error');
    const calcResultBox = document.getElementById('calc-result');
    const resAverage = document.getElementById('res-average');
    const resStatusBanner = document.getElementById('res-status-banner');
    const resStatusText = document.getElementById('res-status-text');

    // Simulator
    const simForm = document.getElementById('sim-form');
    const simStudentInput = document.getElementById('sim-student');
    const simClassInput = document.getElementById('sim-class');
    const simStdInput = document.getElementById('sim-std');
    const simError = document.getElementById('sim-error');
    const simResultBox = document.getElementById('sim-result');
    const resZ = document.getElementById('res-z');
    const resT = document.getElementById('res-t');
    const resGrade = document.getElementById('res-grade');
    const visualizationSection = document.getElementById('visualization');

    // Export
    const btnExport = document.getElementById('btn-export');

    // --- View Toggle Logic (Tab System) ---
    tabCalc.addEventListener('click', () => {
        tabCalc.classList.add('active');
        tabSim.classList.remove('active');
        calculatorView.classList.remove('hidden');
        simulatorView.classList.add('hidden');
        
        // Reset animations
        calculatorView.style.animation = 'none';
        calculatorView.offsetHeight; /* trigger reflow */
        calculatorView.style.animation = null; 
    });

    tabSim.addEventListener('click', () => {
        tabSim.classList.add('active');
        tabCalc.classList.remove('active');
        simulatorView.classList.remove('hidden');
        calculatorView.classList.add('hidden');
        
        // Reset animations
        simulatorView.style.animation = 'none';
        simulatorView.offsetHeight; /* trigger reflow */
        simulatorView.style.animation = null;
    });

    // --- i18n Logic ---
    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        
        // Update Buttons
        langTrBtn.classList.toggle('active', lang === 'tr');
        langEnBtn.classList.toggle('active', lang === 'en');
        
        // Update Text
        const dict = window.i18n[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = dict[key];
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });
        
        // Retrigger displays if visible to update dynamic text
        if (!calcResultBox.classList.contains('hidden')) {
            calcForm.dispatchEvent(new Event('submit'));
        }
        if (!simResultBox.classList.contains('hidden')) {
            simForm.dispatchEvent(new Event('submit'));
        }
        
        // Update chart if it exists
        if (bellCurveChart) {
             bellCurveChart.data.datasets[0].label = window.i18n[currentLang]['chart-title'];
             bellCurveChart.update();
        }
    }
    
    langTrBtn.addEventListener('click', () => updateLanguage('tr'));
    langEnBtn.addEventListener('click', () => updateLanguage('en'));
    
    // Initialize Language
    updateLanguage(currentLang);

    // --- Dark/Light Mode ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.replace('dark-mode', 'light-mode');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            document.body.classList.replace('dark-mode', 'light-mode');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.replace('light-mode', 'dark-mode');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'dark');
        }
        
        // Update chart colors if it exists
        if (bellCurveChart) {
            Chart.defaults.color = !isDark ? '#475569' : '#94a3b8';
            bellCurveChart.update();
        }
        // Update canvas colors
        initCanvasTheme();
    });

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('.nav-links a, .footer-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetEl = document.getElementById(targetId);
                
                if (targetEl) {
                    const yOffset = -80; 
                    const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Validators ---
    function validateInput(input) {
        if (!input.value && !input.required) return true; // Optional fields
        const val = parseFloat(input.value);
        return !isNaN(val) && val >= 0 && val <= 100;
    }

    // --- Calculator Logic ---
    function getAbsoluteGrade(avg, finalScore) {
        if (avg < 30 || finalScore < 30) return { letter: 'FF', code: 'status-ff-rule', pass: false, perfCode: 'perf-critical' };
        if (avg >= 90) return { letter: 'AA', code: 'status-passed', pass: true, perfCode: 'perf-excellent' };
        if (avg >= 80) return { letter: 'BA', code: 'status-passed', pass: true, perfCode: 'perf-good' };
        if (avg >= 70) return { letter: 'BB', code: 'status-passed', pass: true, perfCode: 'perf-good' };
        if (avg >= 65) return { letter: 'CB', code: 'status-passed', pass: true, perfCode: 'perf-average' };
        if (avg >= 60) return { letter: 'CC', code: 'status-passed', pass: true, perfCode: 'perf-average' };
        if (avg >= 55) return { letter: 'DC', code: 'status-failed', pass: false, perfCode: 'perf-risk' };
        if (avg >= 50) return { letter: 'DD', code: 'status-failed', pass: false, perfCode: 'perf-risk' };
        if (avg >= 40) return { letter: 'FD', code: 'status-failed', pass: false, perfCode: 'perf-critical' };
        return { letter: 'FF', code: 'status-failed', pass: false, perfCode: 'perf-critical' };
    }

    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const midValid = validateInput(midtermInput);
        const finValid = validateInput(finalInput);
        const optValid = validateInput(optionalInput);

        if (!midValid || !finValid || !optValid) {
            calcError.style.display = 'block';
            return;
        }
        calcError.style.display = 'none';

        const midterm = parseFloat(midtermInput.value);
        const final = parseFloat(finalInput.value);
        const optional = optionalInput.value !== "" ? parseFloat(optionalInput.value) : null;

        let average = 0;
        if (optional !== null) {
            average = (midterm * 0.30) + (optional * 0.10) + (final * 0.60);
        } else {
            average = (midterm * 0.40) + (final * 0.60);
        }

        const gradeInfo = getAbsoluteGrade(average, final);
        resAverage.textContent = average.toFixed(2);
        
        const resPerfText = document.getElementById('res-perf-text');
        const resIcon = document.getElementById('res-icon');
        
        // Use i18n for status text
        resStatusText.textContent = gradeInfo.letter + " | " + window.i18n[currentLang][gradeInfo.code];
        if (resPerfText) {
            resPerfText.textContent = window.i18n[currentLang][gradeInfo.perfCode];
        }
        
        resStatusBanner.className = 'status-banner mt-3 ' + gradeInfo.perfCode;
        
        if (resIcon) {
            let iconHtml = '';
            if (gradeInfo.perfCode === 'perf-excellent') {
                iconHtml = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            } else if (gradeInfo.perfCode === 'perf-good') {
                iconHtml = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
            } else if (gradeInfo.perfCode === 'perf-average') {
                iconHtml = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            } else if (gradeInfo.perfCode === 'perf-risk') {
                iconHtml = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
            } else {
                iconHtml = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            }
            resIcon.innerHTML = iconHtml;
        }

        calcResultBox.classList.remove('hidden');
        
        // Save to local storage for simulator convenience
        localStorage.setItem('lastAverage', average.toFixed(2));
        simStudentInput.value = average.toFixed(2);
    });

    // --- Simulator Logic ---
    function getCurveGrade(tScore) {
        if (tScore >= 70) return 'AA';
        if (tScore >= 65) return 'BA';
        if (tScore >= 60) return 'BB';
        if (tScore >= 55) return 'CB';
        if (tScore >= 50) return 'CC';
        if (tScore >= 45) return 'DC';
        if (tScore >= 40) return 'DD';
        if (tScore >= 35) return 'FD';
        return 'FF';
    }

    simForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const stuValid = validateInput(simStudentInput);
        const clsValid = validateInput(simClassInput);
        const stdValid = validateInput(simStdInput);

        if (!stuValid || !clsValid || !stdValid) {
            simError.style.display = 'block';
            return;
        }
        simError.style.display = 'none';

        const studentAvg = parseFloat(simStudentInput.value);
        const classAvg = parseFloat(simClassInput.value);
        const stdDev = parseFloat(simStdInput.value);

        if (stdDev <= 0) {
            simError.textContent = window.i18n[currentLang]['err-sim-valid'];
            simError.style.display = 'block';
            return;
        }

        // Z = (Student Score - Class Average) / Standard Deviation
        const zScore = (studentAvg - classAvg) / stdDev;
        // T = 60 + (10 × Z)
        const tScore = 60 + (10 * zScore);

        resZ.textContent = zScore.toFixed(2);
        resT.textContent = tScore.toFixed(2);
        resGrade.textContent = getCurveGrade(tScore);

        simResultBox.classList.remove('hidden');
        visualizationSection.classList.remove('hidden');
        
        drawBellCurve(classAvg, stdDev, studentAvg);
    });

    // --- Chart.js Visualization ---
    function drawBellCurve(mean, stdDev, studentScore) {
        const ctx = document.getElementById('bellCurveChart').getContext('2d');
        
        // Generate Data Points for Normal Distribution
        const dataPoints = [];
        const labels = [];
        const minX = Math.max(0, mean - (4 * stdDev));
        const maxX = Math.min(100, mean + (4 * stdDev));
        const step = (maxX - minX) / 100;
        
        for (let x = minX; x <= maxX; x += step) {
            labels.push(x.toFixed(1));
            const exponent = Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
            const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * exponent;
            dataPoints.push(y);
        }

        // Find closest index for student score
        let closestIdx = 0;
        let minDiff = Infinity;
        labels.forEach((val, idx) => {
            const diff = Math.abs(parseFloat(val) - studentScore);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });

        const pointRadii = dataPoints.map((_, idx) => idx === closestIdx ? 8 : 0);
        const pointColors = dataPoints.map((_, idx) => idx === closestIdx ? '#ef4444' : 'rgba(59, 130, 246, 0.5)');

        if (bellCurveChart) {
            bellCurveChart.destroy();
        }

        Chart.defaults.color = document.body.classList.contains('light-mode') ? '#475569' : '#94a3b8';
        Chart.defaults.font.family = 'Inter, sans-serif';

        bellCurveChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: window.i18n[currentLang]['chart-title'],
                    data: dataPoints,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: pointRadii,
                    pointBackgroundColor: pointColors,
                    pointBorderColor: pointColors,
                    pointHoverRadius: pointRadii
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataIndex === closestIdx) {
                                    return window.i18n[currentLang]['chart-your-score'] + ': ' + studentScore;
                                }
                                return 'Density: ' + context.raw.toFixed(4);
                            }
                        }
                    }
                },
                scales: {
                    y: { display: false },
                    x: {
                        ticks: {
                            callback: function(val, index) {
                                return index % 10 === 0 ? this.getLabelForValue(val) : '';
                            }
                        },
                        grid: { color: 'rgba(128, 128, 128, 0.1)' }
                    }
                }
            }
        });
    }

    // --- PDF Export ---
    btnExport.addEventListener('click', () => {
        const element = document.getElementById('exportable-area');
        const opt = {
            margin:       10,
            filename:     'iste_calc_results.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, backgroundColor: document.body.classList.contains('light-mode') ? '#f8fafc' : '#0b1120' },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    });

    // --- Local Storage Initialization ---
    const lastAvg = localStorage.getItem('lastAverage');
    if (lastAvg) {
        simStudentInput.value = lastAvg;
    }

    // ==========================================================================
    // Interactive Particle Background (Neural Network Style)
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    let particleColor = 'rgba(59, 130, 246, 0.5)';
    let lineColorBase = '59, 130, 246'; // RGB for opacity calculation

    function initCanvasTheme() {
        if (document.body.classList.contains('light-mode')) {
            particleColor = 'rgba(37, 99, 235, 0.4)';
            lineColorBase = '37, 99, 235';
        } else {
            particleColor = 'rgba(59, 130, 246, 0.5)';
            lineColorBase = '59, 130, 246';
        }
    }
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let particleCount = 80;
        let connectionDistance = 120;
        let mouse = { x: null, y: null, radius: 150 };

        initCanvasTheme();

        function resizeCanvas() {
            const heroSection = document.querySelector('.hero');
            canvas.width = window.innerWidth;
            canvas.height = heroSection.offsetHeight;
            
            if (window.innerWidth < 768) {
                particleCount = 40;
                connectionDistance = 80;
            } else {
                particleCount = 80;
                connectionDistance = 120;
            }
            initParticles();
        }

        window.addEventListener('resize', resizeCanvas);
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Magnetic UI Elements Effect
        const interactiveElements = document.querySelectorAll('.glass-panel, .btn-primary, .btn-action, .tab-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                // Spring magnetic effect
                el.style.transform = `perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg) translateZ(10px)`;
                
                // Add glass ripple / glow
                el.style.boxShadow = `
                    ${-deltaX * 10}px ${-deltaY * 10}px 30px rgba(59, 130, 246, 0.2),
                    0 8px 32px rgba(0, 0, 0, 0.1)
                `;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.boxShadow = '';
            });
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5; 
                this.vy = (Math.random() - 0.5) * 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2.5 + 1;
                this.friction = 0.95;
                this.springFactor = 0.02;
            }

            update() {
                // Return to base slowly (spring animation)
                const dx = this.baseX - this.x;
                const dy = this.baseY - this.y;
                this.vx += dx * this.springFactor;
                this.vy += dy * this.springFactor;

                if (mouse.x != null && mouse.y != null) {
                    let dmx = mouse.x - this.x;
                    let dmy = mouse.y - this.y;
                    let distance = Math.sqrt(dmx * dmx + dmy * dmy);
                    
                    if (distance < mouse.radius) {
                        // Magnetic attraction + subtle gravity distortion
                        const forceDirectionX = dmx / distance;
                        const forceDirectionY = dmy / distance;
                        
                        // Inverse square law for gravity distortion
                        const force = (mouse.radius - distance) / mouse.radius;
                        
                        // Push away if too close, pull if at edge (ripple)
                        let pushFactor = (distance < mouse.radius * 0.5) ? -2 : 1.5;
                        
                        this.vx += forceDirectionX * force * pushFactor;
                        this.vy += forceDirectionY * force * pushFactor;
                    }
                }
                
                this.vx *= this.friction;
                this.vy *= this.friction;
                
                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = particleColor;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        let opacity = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity * 0.4})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                if (mouse.x != null && mouse.y != null) {
                    let dx = particles[i].x - mouse.x;
                    let dy = particles[i].y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let opacity = 1 - (distance / mouse.radius);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity * 0.6})`;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animateParticles);
        }

        setTimeout(() => {
            resizeCanvas();
            animateParticles();
        }, 100); 
    }
});
