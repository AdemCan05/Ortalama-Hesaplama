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
        if (avg < 30 || finalScore < 30) return { letter: 'FF', code: 'status-ff-rule', pass: false };
        if (avg >= 90) return { letter: 'AA', code: 'status-success', pass: true };
        if (avg >= 80) return { letter: 'BA', code: 'status-success', pass: true };
        if (avg >= 70) return { letter: 'BB', code: 'status-success', pass: true };
        if (avg >= 65) return { letter: 'CB', code: 'status-success', pass: true };
        if (avg >= 60) return { letter: 'CC', code: 'status-success', pass: true };
        if (avg >= 55) return { letter: 'DC', code: 'status-success', pass: true };
        if (avg >= 50) return { letter: 'DD', code: 'status-success', pass: true };
        if (avg >= 40) return { letter: 'FD', code: 'status-fail', pass: false };
        return { letter: 'FF', code: 'status-fail', pass: false };
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
        
        // Use i18n for status text
        resStatusText.textContent = window.i18n[currentLang][gradeInfo.code] + " (" + gradeInfo.letter + ")";
        
        resStatusBanner.className = 'status-banner mt-3';
        if (gradeInfo.pass) {
            resStatusBanner.classList.add('success');
        } else {
            resStatusBanner.classList.add('fail');
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

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 1; 
                this.vy = (Math.random() - 0.5) * 1;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        const pushX = forceDirectionX * force * 1.5;
                        const pushY = forceDirectionY * force * 1.5;
                        
                        this.x -= pushX;
                        this.y -= pushY;
                    }
                }
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
