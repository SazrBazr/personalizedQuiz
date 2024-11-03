function displayContent() {
    const urlParams = new URLSearchParams(window.location.search);

    const aboutMeData = JSON.parse(urlParams.get('aboutMe') || '[]');
    const aboutMeTextDiv = document.getElementById('aboutMeText');
    aboutMeData.forEach(text => {
        const para = document.createElement('li');
        para.textContent = decodeURIComponent(text);
        aboutMeTextDiv.appendChild(para);
    });

    const quizData = JSON.parse(urlParams.get('quiz') || '[]');
    const quizDisplay = document.getElementById('filled-questions');
    quizData.forEach((quizItem, index) => {
        const question = quizItem.question; // Get the question text
        const answers = quizItem.answers; // Get the array of answers
        const correctAnswerIndex = quizItem.correctAnswerIndex; // Correct answer index

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');
        questionDiv.innerHTML = `
            <h3>${index + 1}. ${decodeURIComponent(question)}:</h3>
            ${answers.map((answer, idx) => `
                <label class="custom-heart">
                    <input type="radio" name="question${index}" value="${decodeURIComponent(answer)}" hidden ${decodeURIComponent(correctAnswerIndex) === idx ? 'checked' : ''}>
                    <svg width="24" height="24" viewBox="0 0 24 24" class="heart-radio" onclick="selectRadio('question${index}', '${decodeURIComponent(answer)}', this);">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" stroke="#ff5722" stroke-width="2"/>
                    </svg>
                    ${decodeURIComponent(answer)}
                </label><br>
            `).join('')}
        `;
        quizDisplay.appendChild(questionDiv);
    });
}

function selectRadio(questionName, value, svgElement) {
    const radioButton = document.querySelector(`input[name="${questionName}"][value="${value}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }

    const svgs = document.querySelectorAll(`input[name="${questionName}"] + svg`);
    svgs.forEach(svg => {
        svg.querySelector('path').setAttribute('fill', 'white');
    });

    svgElement.querySelector('path').setAttribute('fill', '#ff5722');
}

function checkAnswers() {
    const correctAnswers = {
        question0: "Iceland",
        question1: "Dog",
        question2: "ComputerScience" // Change these as per your quiz
    };
    let score = 0;

    for (let question in correctAnswers) {
        const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
        if (selectedOption && selectedOption.value === correctAnswers[question]) {
            score++;
        }
    }

    const resultDiv = document.getElementById('quizResults');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<h3>You got ${score} out of ${Object.keys(correctAnswers).length} correct!</h3>`;

    const alertTitle = document.getElementById('alert-title');
    const alertMsg = document.getElementById('alert-msg');
    document.getElementById('responseAlert').style.display = 'flex';
    if (score === Object.keys(correctAnswers).length) {
        alertTitle.innerHTML = `<h1>WOW!</h1>`;
    } else {
        if (score === Object.keys(correctAnswers).length - 1) {
            alertTitle.innerHTML = `<h1>Nice Try!</h1>`;
        } else {
            alertTitle.innerHTML = `<h1>Try Again!</h1>`;
        }
    }
    alertMsg.innerHTML = `<h2>You got ${score} out of ${Object.keys(correctAnswers).length} correct!</h2>`;
}

function closeAlert() {
    document.getElementById('responseAlert').style.display = 'none';
}

function shareResults() {
    const element = document.getElementById('responseAlert');
    if (element) {
        const canvas = document.createElement('canvas');
        const width = 1200;
        const height = 800;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        // Create gradient background
        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#AECBEB');
        gradient.addColorStop(1, '#83B0E1');
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        // Add border
        context.strokeStyle = '#71a5de';
        context.lineWidth = 20;
        context.strokeRect(10, 10, width - 20, height - 20);

        // Set up text styling
        context.textAlign = 'center';
        const fontFamily = "'Comic Sans MS', 'Comic Sans', sans-serif";

        // Draw decorative header
        context.fillStyle = '#E1ECF7';
        context.fillRect(40, 40, width - 80, 140);
        context.strokeStyle = '#71A5DE';
        context.lineWidth = 8;
        context.strokeRect(40, 40, width - 80, 140);

        // Title text
        context.font = `bold 56px ${fontFamily}`;
        context.fillStyle = '#4682b4';
        context.fillText('My Quiz Results! 🎉', width / 2, 130);

        // Create result card background
        context.fillStyle = '#E1ECF7';
        context.fillRect(80, 220, width - 160, height - 300);
        context.strokeStyle = '#71A5DE';
        context.lineWidth = 8;
        context.strokeRect(80, 220, width - 160, height - 300);

        // Get content from the alert - Updated selectors to match your HTML
        const titleText = element.querySelector('#alert-title').innerText;
        const msgText = element.querySelector('#alert-msg').innerText;

        // Draw emoji decoration
        context.font = '80px Arial';
        context.fillText('💌', width / 2, 280);  // Changed to match your modal icon

        // Draw title text with wrapping
        context.font = `48px ${fontFamily}`;
        context.fillStyle = '#4682b4';
        wrapText(context, titleText, width / 2, 380, width - 240, 60);

        // Draw message text
        context.font = `40px ${fontFamily}`;
        context.fillStyle = '#333333';
        wrapText(context, msgText, width / 2, 560, width - 240, 60);

        // Add decorative elements
        context.font = '60px Arial';
        context.fillText('✨', 100, 100);
        context.fillText('🌟', width - 100, 100);
        context.fillText('✨', 100, height - 60);
        context.fillText('🌟', width - 100, height - 60);

        // Share the image
        canvas.toBlob(blob => {
            if (navigator.share) {
                const file = new File([blob], 'quiz-results.png', { type: 'image/png' });
                navigator.share({
                    files: [file],
                    title: 'My Quiz Results! 🎉',
                    text: 'Check out how well I know my friend!'
                }).catch(error => {
                    console.error('Error sharing:', error);
                    alert('Could not share the image. Try saving it instead!');
                });
            } else {
                // Fallback for browsers that don't support sharing
                const link = document.createElement('a');
                link.download = 'quiz-results.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        });
    } else {
        console.error('Element not found: responseAlert');
    }
}

// Helper function for text wrapping
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

// Initialize content
displayContent();
