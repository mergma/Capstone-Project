document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const userInfoStep = document.getElementById('user-info');
    const questionsStep = document.getElementById('questions');
    const progressBar = document.querySelector('.progress');
    const questionNumber = document.querySelector('.question-number');
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentQuestion = 0;
    const questions = [
        {
            text: "In a social situation, you tend to:",
            options: [
                { text: "Start conversations and introduce yourself", value: "E" },
                { text: "Wait for others to approach you", value: "I" },
                { text: "Observe the room before engaging", value: "I" },
                { text: "Look for familiar faces first", value: "E" }
            ]
        },
        {
            text: "When making decisions, you primarily rely on:",
            options: [
                { text: "Facts and logical analysis", value: "T" },
                { text: "How it affects people involved", value: "F" },
                { text: "Your gut feeling", value: "F" },
                { text: "Past experiences and data", value: "T" }
            ]
        },
        {
            text: "How do you prefer to plan your day?",
            options: [
                { text: "Structured schedule with clear tasks", value: "J" },
                { text: "Flexible and open to changes", value: "P" },
                { text: "Mix of planned and spontaneous activities", value: "P" },
                { text: "Detailed to-do lists", value: "J" }
            ]
        },
        {
            text: "When learning something new, you prefer:",
            options: [
                { text: "Practical, hands-on experience", value: "S" },
                { text: "Understanding theoretical concepts", value: "N" },
                { text: "Following step-by-step instructions", value: "S" },
                { text: "Exploring possibilities and patterns", value: "N" }
            ]
        },
        {
            text: "In a group project, you typically:",
            options: [
                { text: "Take charge and delegate tasks", value: "E" },
                { text: "Focus on your assigned part", value: "I" },
                { text: "Mediate between team members", value: "F" },
                { text: "Analyze and solve problems", value: "T" }
            ]
        }
    ];

    let answers = new Array(questions.length).fill(null);
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(userForm);
        const userData = {
            name: formData.get('name'),
            age: formData.get('age'),
            gender: formData.get('gender')
        };
        
        localStorage.setItem('mbtiUserData', JSON.stringify(userData));
        
        userInfoStep.style.display = 'none';
        questionsStep.style.display = 'block';
        updateQuestion();
    });

    function updateQuestion() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        questionNumber.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
        questionText.textContent = questions[currentQuestion].text;       
        optionsContainer.innerHTML = '';
        questions[currentQuestion].options.forEach((option, index) => {
            const label = document.createElement('label');
            label.className = 'option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'q' + currentQuestion;
            input.value = option.value;
            
            const span = document.createElement('span');
            span.textContent = option.text;
            
            if (answers[currentQuestion] === option.value) {
                input.checked = true;
            }
            
            label.appendChild(input);
            label.appendChild(span);
            optionsContainer.appendChild(label);
        });

        prevBtn.disabled = currentQuestion === 0;
        nextBtn.textContent = currentQuestion === questions.length - 1 ? 'Finish' : 'Next';
    }

    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            updateQuestion();
        }
    });

    nextBtn.addEventListener('click', function() {
        const selectedOption = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
        if (!selectedOption) {
            alert('Please select an answer before proceeding.');
            return;
        }

        answers[currentQuestion] = selectedOption.value;

        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            updateQuestion();
        } else {
            calculateResults();
        }
    });

    function calculateResults() {
        const counts = {
            E: 0, I: 0,
            S: 0, N: 0,
            T: 0, F: 0,
            J: 0, P: 0
        };

        answers.forEach(answer => {
            if (answer) counts[answer]++;
        });

        const type = [
            counts.E > counts.I ? 'E' : 'I',
            counts.S > counts.N ? 'S' : 'N',
            counts.T > counts.F ? 'T' : 'F',
            counts.J > counts.P ? 'J' : 'P'
        ].join('');

        alert(`Your MBTI type is: ${type}`);
    }

    // hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
});
