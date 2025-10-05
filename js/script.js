document.addEventListener('DOMContentLoaded', () => {

    let isQuizActive = false;
    let audioCtx;

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timerInterval;
    const QUIZ_LENGTH = 10;
    const TIME_LIMIT = 10;
    const PASS_PERCENTAGE = 70;

    const appRoot = document.getElementById('app-root');
    
    const quizData = {
        engineer: [
            { question: "What is Ohm's Law?", options: ["V=IR", "F=ma", "E=mc^2", "P=VI"], answer: "V=IR" },
            { question: "A pointer in C programming stores what?", options: ["A character value", "An integer value", "The value of a variable", "The memory address of a variable"], answer: "The memory address of a variable" },
            { question: "What is the primary function of a transformer?", options: ["Convert AC to DC", "Store energy", "Step up or step down voltage", "Increase power"], answer: "Step up or step down voltage" },
            { question: "In thermodynamics, what is entropy a measure of?", options: ["Heat", "Work", "Pressure", "Disorder"], answer: "Disorder" },
            { question: "Which logic gate is known as a universal gate?", options: ["AND", "OR", "XOR", "NAND"], answer: "NAND" },
            { question: "What does CPU stand for?", options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Computer System Unit"], answer: "Central Processing Unit" },
            { question: "The rate of change of velocity is called what?", options: ["Speed", "Momentum", "Acceleration", "Force"], answer: "Acceleration" },
            { question: "What is the SI unit of frequency?", options: ["Hertz", "Watt", "Joule", "Newton"], answer: "Hertz" },
            { question: "Which material has the highest thermal conductivity?", options: ["Steel", "Copper", "Aluminum", "Diamond"], answer: "Diamond" },
            { question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Application Protocol Interface", "Automated Program Interaction"], answer: "Application Programming Interface" },
        ],
        doctor: [
            { question: "Which is the largest organ in the human body?", options: ["Liver", "Brain", "Heart", "Skin"], answer: "Skin" },
            { question: "What does 'CPR' stand for in medical emergencies?", options: ["Cardio-Pulmonary Resuscitation", "Cardiac-Pneumatic Response", "Cerebral-Patient Recovery", "Cardio-Pulmonary Recovery"], answer: "Cardio-Pulmonary Resuscitation" },
            { question: "Which vitamin is synthesized in the skin by sunlight?", options: ["Vitamin C", "Vitamin A", "Vitamin K", "Vitamin D"], answer: "Vitamin D" },
            { question: "Dengue fever is transmitted by which mosquito?", options: ["Anopheles", "Culex", "Aedes aegypti", "Mansonia"], answer: "Aedes aegypti" },
            { question: "How many bones are in the adult human body?", options: ["206", "212", "201", "221"], answer: "206" },
            { question: "What is the medical term for a heart attack?", options: ["Myocardial Infarction", "Cerebral Stroke", "Hypertension", "Arrhythmia"], answer: "Myocardial Infarction" },
            { question: "Which part of the brain is responsible for balance and coordination?", options: ["Cerebrum", "Cerebellum", "Brainstem", "Thalamus"], answer: "Cerebellum" },
            { question: "What is the main function of red blood cells?", options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"], answer: "Carry oxygen" },
            { question: "The deficiency of which mineral causes Goitre?", options: ["Iron", "Calcium", "Iodine", "Potassium"], answer: "Iodine" },
            { question: "What is the study of the heart and its diseases called?", options: ["Nephrology", "Neurology", "Cardiology", "Oncology"], answer: "Cardiology" },
        ],
        lawyer: [
            { question: "What does 'Habeas Corpus' literally mean?", options: ["To have the body", "A guilty mind", "The thing speaks for itself", "Against the world"], answer: "To have the body" },
            { question: "What is a 'plaintiff' in a civil case?", options: ["The person who is being sued", "The person who brings the case to court", "The judge", "The jury"], answer: "The person who brings the case to court" },
            { question: "Article 14 of the Indian Constitution guarantees what?", options: ["Freedom of Speech", "Right to Life", "Equality before Law", "Freedom of Religion"], answer: "Equality before Law" },
            { question: "What is the term for a law made by a legislature?", options: ["Ordinance", "Statute", "Decree", "Precedent"], answer: "Statute" },
            { question: "Who is the final interpreter of the Indian Constitution?", options: ["The President", "The Parliament", "The Prime Minister", "The Supreme Court"], answer: "The Supreme Court" },
            { question: "'Mens Rea' refers to what aspect of a crime?", options: ["The physical act", "The guilty mind or intent", "The evidence", "The punishment"], answer: "The guilty mind or intent" },
            { question: "What type of law deals with disputes between individuals or organizations?", options: ["Criminal Law", "Civil Law", "Administrative Law", "Constitutional Law"], answer: "Civil Law" },
            { question: "A written statement made under oath is called an:", options: ["Affidavit", "Allegation", "Subpoena", "Indictment"], answer: "Affidavit" },
            { question: "In India, what is the retirement age for a Supreme Court judge?", options: ["60 years", "62 years", "65 years", "70 years"], answer: "65 years" },
            { question: "What does 'Lok Adalat' mean?", options: ["People's Court", "High Court", "Fast Court", "Supreme Court"], answer: "People's Court" },
        ],
        jee: [
            { question: "The dimensional formula for gravitational constant 'G' is:", options: ["M L^2 T^-2", "M^-1 L^3 T^-2", "M L T^-2", "M^-1 L^2 T^-1"], answer: "M^-1 L^3 T^-2" },
            { question: "Which of the following is a Lewis acid?", options: ["NH3", "H2O", "BF3", "CH4"], answer: "BF3" },
            { question: "The value of sin(30°) + cos(60°) is:", options: ["0", "1", "1/2", "sqrt(3)/2"], answer: "1" },
            { question: "What is the escape velocity of Earth?", options: ["9.8 m/s", "11.2 km/s", "1.6 km/s", "2.38 km/s"], answer: "11.2 km/s" },
            { question: "The shape of the PCl5 molecule is:", options: ["Tetrahedral", "Trigonal bipyramidal", "Square planar", "Octahedral"], answer: "Trigonal bipyramidal" },
            { question: "What is the derivative of x^3 with respect to x?", options: ["3x^2", "3x", "x^2", "3x^3"], answer: "3x^2" },
            { question: "Which color of light has the shortest wavelength?", options: ["Red", "Green", "Blue", "Violet"], answer: "Violet" },
            { question: "The process of coating iron with zinc is called:", options: ["Galvanization", "Electroplating", "Annealing", "Corrosion"], answer: "Galvanization" },
            { question: "What is the value of the integral of 1/x dx?", options: ["-1/x^2 + C", "ln|x| + C", "x + C", "1 + C"], answer: "ln|x| + C" },
            { question: "A concave lens always forms what type of image?", options: ["Real, inverted", "Virtual, erect", "Real, erect", "Virtual, inverted"], answer: "Virtual, erect" },
        ],
        neet: [
            { question: "Which of these is known as the 'powerhouse of the cell'?", options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"], answer: "Mitochondrion" },
            { question: "The pH of human blood is typically around:", options: ["6.4", "7.0", "7.4", "8.0"], answer: "7.4" },
            { question: "What is the final product of glycolysis?", options: ["Glucose", "Acetyl CoA", "Pyruvate", "Lactic Acid"], answer: "Pyruvate" },
            { question: "Which blood group is known as the universal donor?", options: ["A", "B", "AB", "O"], answer: "O" },
            { question: "Photosynthesis primarily occurs in which part of the plant cell?", options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], answer: "Chloroplast" },
            { question: "What is the study of insects called?", options: ["Botany", "Zoology", "Entomology", "Geology"], answer: "Entomology" },
            { question: "How many chambers are there in the human heart?", options: ["Two", "Three", "Four", "Five"], answer: "Four" },
            { question: "The law of dominance was proposed by which scientist?", options: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Robert Hooke"], answer: "Gregor Mendel" },
            { question: "Which of these is NOT a part of the small intestine?", options: ["Duodenum", "Jejunum", "Ileum", "Cecum"], answer: "Cecum" },
            { question: "Which gas do plants absorb from the atmosphere during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
        ],
        student: [
            { question: "What is the chemical formula for table salt?", options: ["H2O", "CO2", "NaCl", "C6H12O6"], answer: "NaCl"},
            { question: "Who is known as the father of geometry?", options: ["Aristotle", "Euclid", "Pythagoras", "Archimedes"], answer: "Euclid"},
            { question: "What force keeps the planets in orbit around the Sun?", options: ["Magnetic Force", "Frictional Force", "Gravitational Force", "Tension Force"], answer: "Gravitational Force"},
            { question: "In which year did India gain independence?", options: ["1942", "1945", "1947", "1950"], answer: "1947" },
            { question: "What is the capital of India?", options: ["Mumbai", "Kolkata", "Chennai", "New Delhi"], answer: "New Delhi" },
            { question: "The metal which is liquid at room temperature is?", options: ["Sodium", "Bromine", "Mercury", "Calcium"], answer: "Mercury" },
            { question: "Who wrote the Indian national anthem?", options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Mahatma Gandhi"], answer: "Rabindranath Tagore" },
            { question: "What is the largest desert in the world?", options: ["Thar Desert", "Sahara Desert", "Gobi Desert", "Antarctic Polar Desert"], answer: "Antarctic Polar Desert" },
            { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Ganga", "Yangtze"], answer: "Nile" },
            { question: "What is 7 multiplied by 8?", options: ["48", "54", "56", "64"], answer: "56" },
        ]
    };

    const getUsers = () => JSON.parse(localStorage.getItem('quizUsers')) || [];
    const saveUsers = (users) => localStorage.setItem('quizUsers', JSON.stringify(users));
    const getLeaderboard = () => JSON.parse(localStorage.getItem('leaderboard')) || [];
    const saveLeaderboard = (board) => localStorage.setItem('leaderboard', JSON.stringify(board));
    const getCurrentUser = () => localStorage.getItem('currentUser');
    const setCurrentUser = (email) => localStorage.setItem('currentUser', email);
    const clearCurrentUser = () => localStorage.removeItem('currentUser');
    
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    const isLoggedIn = () => getCurrentUser() !== null;

    const loadPage = async (page) => {
        if (isQuizActive && page !== 'quiz') {
            const wantsToExit = confirm("Are you sure? Your current quiz will be forfeited, and your score will be updated as a fail.");
            if (wantsToExit) {
                clearInterval(timerInterval); score = 0; updateLeaderboard(false);
                isQuizActive = false; await loadPage(page); return;
            } else { return; }
        }
        const protectedPages = ['quiz', 'leaderboard', 'profile', 'change-password', 'logout'];
        if (protectedPages.includes(page) && !isLoggedIn()) {
            await loadPage('home');
            document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' }); return;
        }
        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Page not found');
            appRoot.innerHTML = await response.text();
            
            if (page === 'home' && isLoggedIn()) {
                const authSection = document.getElementById('auth-section');
                const welcomeSection = document.getElementById('welcome-back-section');
                if (authSection) authSection.classList.add('hidden');
                if (welcomeSection) {
                    const user = getUsers().find(u => u.email === getCurrentUser());
                    document.getElementById('welcome-user-name').textContent = user.firstName;
                    welcomeSection.classList.remove('hidden');
                }
            }
            initializePageEventListeners(page);
        } catch (error) {
            console.error('Error loading page:', error);
            appRoot.innerHTML = `<div class="main-container"><div class="content-body text-center"><h2>Error</h2><p>Page not found.</p></div></div>`;
        }
    };
    
    const playBeep = () => {
        if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { console.error("Web Audio API not supported"); return; } }
        if (audioCtx && audioCtx.state !== 'running') { audioCtx.resume(); }
        if (audioCtx) {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.connect(g); g.connect(audioCtx.destination); o.type = 'sine';
            o.frequency.setValueAtTime(800, audioCtx.currentTime);
            g.gain.setValueAtTime(0.1, audioCtx.currentTime);
            o.start(audioCtx.currentTime); o.stop(audioCtx.currentTime + 0.1);
        }
    };

    const initializePageEventListeners = (page) => {
        const profileDropdown = document.getElementById('profile-dropdown');
        const loginNavButton = document.getElementById('login-nav-button');
        const mainNavLinksList = document.getElementById('main-nav-links');
        const navbarToggler = document.querySelector('.navbar-toggler');
        updateAuthStateUI(profileDropdown, loginNavButton, mainNavLinksList, navbarToggler);

        document.querySelectorAll('.navbar .nav-link, .navbar .dropdown-item, .navbar .navbar-brand').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); const page = link.dataset.page; if (page) loadPage(page);
            });
        });
        loginNavButton?.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('home').then(() => {
                document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        switch (page) {
            case 'home':
                document.getElementById('login-form')?.addEventListener('submit', handleLogin);
                document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
                document.getElementById('auth-switch-to-signup')?.addEventListener('click', toggleAuthForms);
                document.getElementById('auth-switch-to-login')?.addEventListener('click', toggleAuthForms);
                document.getElementById('welcome-start-quiz-btn')?.addEventListener('click', () => loadPage('quiz'));
                break;
            case 'quiz':
                setupQuizPrompts();
                document.getElementById('play-again-btn')?.addEventListener('click', () => loadPage('quiz'));
                break;
            case 'leaderboard': renderLeaderboard(); break;
            case 'profile': renderProfilePage(); break;
            case 'logout':
                document.getElementById('confirm-logout-btn')?.addEventListener('click', handleLogout);
                document.getElementById('cancel-logout-btn')?.addEventListener('click', () => loadPage('quiz'));
                break;
        }
    };
    
    const updateAuthStateUI = (profileDropdown, loginNavButton, mainNavLinksList, navbarToggler) => {
        if (isLoggedIn()) {
            profileDropdown?.classList.remove('hidden');
            loginNavButton?.classList.add('hidden');
            mainNavLinksList?.classList.remove('hidden');
            navbarToggler?.classList.remove('hidden');
        } else {
            profileDropdown?.classList.add('hidden');
            loginNavButton?.classList.remove('hidden');
            mainNavLinksList?.classList.add('hidden');
            navbarToggler?.classList.add('hidden');
            const navCollapse = document.getElementById('navbarNav');
            if (navCollapse?.classList.contains('show')) {
                navCollapse.classList.remove('show');
            }
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value, password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        const user = getUsers().find(u => u.email === email && u.password === password);
        if (user) { setCurrentUser(email); updateAuthStateUI(document.getElementById('profile-dropdown'), document.getElementById('login-nav-button'), document.getElementById('main-nav-links'), document.querySelector('.navbar-toggler')); loadPage('quiz'); }
        else { errorDiv.textContent = 'Invalid email or password.'; errorDiv.classList.remove('hidden'); }
    };
    
    const handleSignup = (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('signup-error');
        const newUser = {
            firstName: document.getElementById('signup-firstname').value, lastName: document.getElementById('signup-lastname').value,
            email: document.getElementById('signup-email').value, phone: document.getElementById('signup-phone').value,
            password: document.getElementById('signup-password').value, age: document.getElementById('signup-age').value,
            gender: document.getElementById('signup-gender').value, state: document.getElementById('signup-state').value,
        };
        if (Object.values(newUser).some(val => val === '') || !newUser.password) {
             errorDiv.textContent = 'Please fill out all required fields.'; errorDiv.classList.remove('hidden'); return;
        }
        const users = getUsers();
        if (users.some(user => user.email === newUser.email)) {
            errorDiv.textContent = 'An account with this email already exists.'; errorDiv.classList.remove('hidden'); return;
        }
        users.push(newUser); saveUsers(users);
        const leaderboard = getLeaderboard();
        leaderboard.push({ email: newUser.email, name: `${newUser.firstName} ${newUser.lastName}`, points: 0 });
        saveLeaderboard(leaderboard);
        showLoginAfterRegistration();
    };

    const showLoginAfterRegistration = () => {
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        const successAlert = document.getElementById('signup-success');
        successAlert.classList.remove('hidden');
        setTimeout(() => successAlert.classList.add('hidden'), 5000);
    };

    const handleLogout = () => { isQuizActive = false; clearCurrentUser(); loadPage('home'); };

    const toggleAuthForms = (e) => {
        e.preventDefault();
        document.getElementById('login-form').classList.toggle('hidden');
        document.getElementById('signup-form').classList.toggle('hidden');
        document.getElementById('signup-success').classList.add('hidden');
    };

    const setupQuizPrompts = () => {
        document.querySelectorAll('#prompt-status .setup-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.choice;
                document.getElementById('prompt-status').classList.add('hidden');
                if (choice === 'student') {
                    startQuiz('student');
                } else {
                    document.getElementById(`prompt-${choice}`).classList.remove('hidden');
                }
            });
        });
        document.querySelectorAll('#quiz-setup .category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { console.error("Could not create audio context"); } }
                startQuiz(btn.dataset.category);
            });
        });
    };

    const startQuiz = (category) => {
        isQuizActive = true;
        questions = shuffleArray([...quizData[category] || []]).slice(0, QUIZ_LENGTH);
        if (questions.length < 1) {
            alert("Could not start quiz. No questions found for this category.");
            isQuizActive = false; loadPage('quiz'); return;
        }
        currentQuestionIndex = 0; score = 0;
        document.getElementById('quiz-setup').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        updateScore(); loadQuestion();
    };

    const loadQuestion = () => {
        resetTimer();
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            document.getElementById('question-text').innerText = question.question;
            const optionsGrid = document.getElementById('options-grid'); optionsGrid.innerHTML = '';
            shuffleArray([...question.options]).forEach(option => {
                const button = document.createElement('button'); button.innerText = option;
                button.className = 'btn option-btn';
                button.addEventListener('click', () => selectAnswer(button, option, question.answer));
                optionsGrid.appendChild(button);
            });
            updateProgress(); startTimer();
        } else { showResults(); }
    };

    const selectAnswer = (button, selectedOption, correctAnswer) => {
        clearInterval(timerInterval);
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.innerText === correctAnswer) btn.classList.add('correct');
            else if (btn.innerText === selectedOption) btn.classList.add('wrong');
        });
        if (selectedOption === correctAnswer) { score++; updateScore(); }
        setTimeout(() => { currentQuestionIndex++; loadQuestion(); }, 1500);
    };

    const startTimer = () => {
        const timerEl = document.getElementById('timer');
        timer = TIME_LIMIT; timerEl.innerText = timer;
        timerInterval = setInterval(() => {
            timer--; timerEl.innerText = timer;
            if (timer <= 3 && timer > 0) { timerEl.classList.add('timer-warning'); playBeep(); }
            if (timer <= 0) { clearInterval(timerInterval); handleTimeOut(); }
        }, 1000);
    };

    const resetTimer = () => { clearInterval(timerInterval); document.getElementById('timer')?.classList.remove('timer-warning'); };

    const handleTimeOut = () => {
        const correctAnswer = questions[currentQuestionIndex].answer;
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true; if (btn.innerText === correctAnswer) btn.classList.add('correct');
        });
        setTimeout(() => { currentQuestionIndex++; loadQuestion(); }, 1500);
    };
    
    const updateProgress = () => {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('question-counter').innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    };

    const updateScore = () => { document.getElementById('score').innerText = `Correct: ${score}`; };

    const updateLeaderboard = (isPass) => {
        const points = isPass ? 100 : -150, leaderboard = getLeaderboard(), userEmail = getCurrentUser();
        const userIndex = leaderboard.findIndex(u => u.email === userEmail);
        if (userIndex > -1) {
            leaderboard[userIndex].points = Math.max(0, leaderboard[userIndex].points + points);
            saveLeaderboard(leaderboard);
        }
    };

    const showResults = () => {
        isQuizActive = false;
        document.getElementById('quiz-screen').classList.add('hidden');
        const resultsScreen = document.getElementById('results-screen');
        resultsScreen.classList.remove('hidden');
        const userScorePercent = (questions.length > 0 ? (score / questions.length) : 0) * 100;
        const isPass = userScorePercent >= PASS_PERCENTAGE; updateLeaderboard(isPass);
        document.getElementById('result-heading').innerText = isPass ? "Congratulations! You Passed!" : "Better Luck Next Time!";
        const iconEl = document.getElementById('result-status-icon');
        iconEl.innerHTML = isPass ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
        iconEl.className = isPass ? 'result-icon pass' : 'result-icon fail';
        document.getElementById('final-score').innerText = `${userScorePercent.toFixed(1)}%`;
        const pointsEl = document.getElementById('points-earned');
        pointsEl.innerText = isPass ? '+100 Points' : '-150 Points';
        pointsEl.className = isPass ? 'points-display points-positive' : 'points-display points-negative';
    };
    
    const renderLeaderboard = () => {
        const board = getLeaderboard();
        const boardBody = document.getElementById('leaderboard-body');
        if (!boardBody) return; boardBody.innerHTML = ''; 
        board.sort((a, b) => b.points - a.points);
        board.forEach((user, index) => {
            const rank = index + 1, row = document.createElement('tr'); row.className = 'leaderboard-row';
            row.innerHTML = `<td class="rank">${rank === 1 ? '<i class="fas fa-crown"></i> 1' : rank}</td><td>${user.name}</td><td class="points">${user.points}</td>`;
            boardBody.appendChild(row);
        });
    };
    
    const renderProfilePage = () => {
        const user = getUsers().find(u => u.email === getCurrentUser()); if(!user) return;
        document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-phone').textContent = user.phone;
        document.getElementById('profile-age').value = user.age;
        document.getElementById('profile-gender').textContent = user.gender;
        document.getElementById('profile-state').textContent = user.state;
        
        const editBtn = document.getElementById('edit-profile-btn'), saveBtn = document.getElementById('save-profile-btn'), cancelBtn = document.getElementById('cancel-edit-btn');
        const editableFields = ['profile-age'];

        editBtn.addEventListener('click', () => {
            editableFields.forEach(id => document.getElementById(id).disabled = false);
            editBtn.classList.add('hidden'); saveBtn.classList.remove('hidden'); cancelBtn.classList.remove('hidden');
        });
        cancelBtn.addEventListener('click', () => {
            renderProfilePage(); 
            editableFields.forEach(id => document.getElementById(id).disabled = true);
            editBtn.classList.remove('hidden'); saveBtn.classList.add('hidden'); cancelBtn.classList.add('hidden');
        });
        saveBtn.addEventListener('click', () => {
            const allUsers = getUsers(), userIndex = allUsers.findIndex(u => u.email === getCurrentUser());
            allUsers[userIndex].age = document.getElementById('profile-age').value;
            saveUsers(allUsers);
            editableFields.forEach(id => document.getElementById(id).disabled = true);
            editBtn.classList.remove('hidden'); saveBtn.classList.add('hidden'); cancelBtn.classList.add('hidden');
            const successAlert = document.getElementById('profile-success-alert');
            successAlert.classList.remove('hidden');
            setTimeout(() => successAlert.classList.add('hidden'), 3000);
        });
    };

    (async () => {
        await loadPage('home');
        const profileDropdown = document.getElementById('profile-dropdown');
        const loginNavButton = document.getElementById('login-nav-button');
        const mainNavLinksList = document.getElementById('main-nav-links');
        const navbarToggler = document.querySelector('.navbar-toggler');
        updateAuthStateUI(profileDropdown, loginNavButton, mainNavLinksList, navbarToggler);
    })();
});