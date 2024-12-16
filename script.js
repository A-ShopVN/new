let words = JSON.parse(localStorage.getItem('words')) || []; // Lấy từ đã lưu trong localStorage
let currentWord = {};
let currentAnswers = [];

document.getElementById('addWordBtn').addEventListener('click', function() {
    const word = document.getElementById('word').value;
    const definition = document.getElementById('definition').value;
    
    if (word && definition) {
        words.push({ word, definition });
        localStorage.setItem('words', JSON.stringify(words)); // Lưu vào localStorage
        document.getElementById('word').value = '';
        document.getElementById('definition').value = '';
        showToast('Từ đã được thêm!', 'success');
        displayWordList(); // Cập nhật danh sách từ đã nhập
    } else {
        showToast('Vui lòng nhập đầy đủ từ và nghĩa.', 'error');
    }
});

// Hiển thị danh sách từ đã nhập
function displayWordList() {
    const wordListContainer = document.getElementById('wordList');
    wordListContainer.innerHTML = '';
    words.forEach(wordObj => {
        const item = document.createElement('div');
        item.classList.add('word-item');
        item.innerText = `${wordObj.word}: ${wordObj.definition}`;
        wordListContainer.appendChild(item);
    });
}

// Khởi tạo câu hỏi và trả lời
function generateQuiz() {
    if (words.length === 0) {
        showToast('Vui lòng thêm ít nhất một từ vựng.', 'error');
        return;
    }
    
    currentWord = words[Math.floor(Math.random() * words.length)];
    const questionText = `Từ vựng: ${currentWord.word}. Nghĩa của từ là gì?`;
    document.getElementById('question').innerText = questionText;
    
    currentAnswers = createAnswers(currentWord);
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    currentAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('answer-btn');
        button.innerText = answer;
        button.onclick = function() {
            if (answer === currentWord.definition) {
                showToast('Chính xác!', 'success');
            } else {
                showToast('Sai, thử lại!', 'error');
            }
            nextQuestion(); // Tự động chuyển câu hỏi tiếp theo
        };
        answersContainer.appendChild(button);
    });
}

// Tạo các câu trả lời ngẫu nhiên cho câu hỏi
function createAnswers(wordObj) {
    const answers = [wordObj.definition];
    while (answers.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (!answers.includes(randomWord.definition) && randomWord.word !== wordObj.word) {
            answers.push(randomWord.definition);
        }
    }
    return shuffleArray(answers);
}

// Trộn mảng câu trả lời
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Chuyển sang câu hỏi tiếp theo
function nextQuestion() {
    setTimeout(generateQuiz, 1000); // Chờ 1 giây trước khi chuyển câu hỏi mới
}

// Hiển thị thông báo Toast
function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? "green" : "red",
        stopOnFocus: true,
    }).showToast();
}

// Khởi tạo khi trang được tải
window.onload = function() {
    displayWordList();
    generateQuiz(); // Bắt đầu câu hỏi ngay khi trang được tải
};
