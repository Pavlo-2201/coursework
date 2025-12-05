// utils.js - Вспомогательные функции: таймер, анимации, форматирование

// Таймер игры
function startTimer() {
    clearInterval(currentGameState.timerInterval);
    
    currentGameState.timerInterval = setInterval(function() {
        if (currentGameState.timeLeft <= 0) {
            clearInterval(currentGameState.timerInterval);
            showMessage('Время вышло! Уровень не пройден.', 'error');
            finishLevel();
            return;
        }
        
        currentGameState.timeLeft--;
        updateTimerDisplay();
        
        // Ускорение таймера на высоких уровнях
        if (currentGameState.currentLevel >= 2 && currentGameState.timeLeft < 60) {
            document.getElementById('timer').style.color = 'var(--danger-color)';
            document.getElementById('timer').classList.add('pulse');
        }
    }, 1000);
}

// Обновление отображения таймера
function updateTimerDisplay() {
    const minutes = Math.floor(currentGameState.timeLeft / 60);
    const seconds = currentGameState.timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Форматирование времени
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Анимации
function animateElement(element, animation) {
    element.style.animation = `${animation} 0.5s ease`;
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function pulseElement(element) {
    animateElement(element, 'pulse');
}

function shakeElement(element) {
    animateElement(element, 'shake');
}

// Создание соединения между элементами
function createConnection(point1, point2) {
    // Проверка, что это разные точки
    if (point1 === point2) return;
    
    const workspace = document.getElementById('workspaceArea');
    const rect1 = point1.getBoundingClientRect();
    const rect2 = point2.getBoundingClientRect();
    const workspaceRect = workspace.getBoundingClientRect();
    
    // Вычисление координат
    const x1 = rect1.left - workspaceRect.left + rect1.width / 2;
    const y1 = rect1.top - workspaceRect.top + rect1.height / 2;
    const x2 = rect2.left - workspaceRect.left + rect2.width / 2;
    const y2 = rect2.top - workspaceRect.top + rect2.height / 2;
    
    // Вычисление длины и угла линии
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Создание линии
    const line = document.createElement('div');
    line.className = 'connection-line';
    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    workspace.appendChild(line);
    
    // Добавление соединения в состояние
    currentGameState.connections.push({
        from: point1,
        to: point2,
        element: line
    });
    
    addToActionLog('Создано соединение между элементами');
}

// Очистка рабочей области
function clearWorkspace() {
    const workspace = document.getElementById('workspaceArea');
    workspace.innerHTML = '<div class="drop-zone"></div>';
    
    currentGameState.elementsInWorkspace = [];
    currentGameState.connections = [];
    
    addToActionLog('Рабочая область очищена');
}

// Проверка расчета (для уровня 2)
function checkCalculation() {
    const answerInput = document.getElementById('calculationAnswer');
    const resultDiv = document.getElementById('calculationResult');
    
    if (!answerInput.value) {
        resultDiv.innerHTML = '<span style="color: var(--warning-color)">Введите ответ!</span>';
        return;
    }
    
    const userAnswer = parseFloat(answerInput.value);
    const correctAnswer = currentGameState.correctAnswer;
    
    // Допустимая погрешность 1%
    const tolerance = correctAnswer * 0.01;
    
    if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
        // Правильный ответ
        const pointsEarned = 150; // Базовый счет для уровня 2
        currentGameState.score += pointsEarned;
        currentGameState.levelCompleted = true;
        
        resultDiv.innerHTML = `
            <span style="color: var(--success-color)">
                ✓ Правильно! ${correctAnswer} ${currentGameState.currentUnits}<br>
                +${pointsEarned} очков
            </span>
        `;
        
        showMessage(`Верно! +${pointsEarned} очков`, 'success');
        addToActionLog('Расчет выполнен правильно');
        
        document.getElementById('nextLevelBtn').disabled = false;
        updateScore();
        saveGameState();
    } else {
        // Неправильный ответ
        currentGameState.currentAttempts--;
        currentGameState.penalty += 15;
        
        resultDiv.innerHTML = `
            <span style="color: var(--danger-color)">
                ✗ Неправильно. Правильный ответ: ${correctAnswer} ${currentGameState.currentUnits}<br>
                Формула: ${document.querySelector('.task-description p:nth-child(3)').textContent.replace('Используйте формулу: ', '')}
            </span>
        `;
        
        showMessage(`Неправильно! Осталось попыток: ${currentGameState.currentAttempts}`, 'error');
        addToActionLog('Ошибка в расчете');
        
        updateScore();
        document.getElementById('attempts').textContent = currentGameState.currentAttempts;
        
        if (currentGameState.currentAttempts <= 0) {
            showMessage('Попытки закончились!', 'error');
            document.getElementById('checkCalculationBtn').disabled = true;
        }
    }
}

// Проверка ответа на вопрос (для уровня 3)
function checkQuizAnswer() {
    const selectedOption = document.querySelector('.answer-option.selected');
    const resultDiv = document.querySelector('.question-container');
    
    if (!selectedOption) {
        showMessage('Выберите вариант ответа!', 'error');
        return;
    }
    
    const userAnswer = parseInt(selectedOption.dataset.answer);
    const correctAnswer = currentGameState.correctAnswer;
    
    // Показать правильность ответов
    document.querySelectorAll('.answer-option').forEach((option, index) => {
        if (index === correctAnswer) {
            option.classList.add('correct');
        } else if (index === userAnswer && index !== correctAnswer) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none';
    });
    
    if (userAnswer === correctAnswer) {
        // Правильный ответ
        const pointsEarned = 120; // Базовый счет для уровня 3
        currentGameState.score += pointsEarned;
        currentGameState.levelCompleted = true;
        
        showMessage(`Верно! +${pointsEarned} очков`, 'success');
        addToActionLog('Ответ на вопрос правильный');
        
        document.getElementById('nextLevelBtn').disabled = false;
        updateScore();
        saveGameState();
    } else {
        // Неправильный ответ
        currentGameState.currentAttempts--;
        currentGameState.penalty += 8;
        
        showMessage(`Неправильно! Осталось попыток: ${currentGameState.currentAttempts}`, 'error');
        addToActionLog('Ошибка в ответе на вопрос');
        
        updateScore();
        document.getElementById('attempts').textContent = currentGameState.currentAttempts;
        
        if (currentGameState.currentAttempts <= 0) {
            showMessage('Попытки закончились!', 'error');
            document.getElementById('checkAnswerBtn').disabled = true;
        }
    }
}
// utils.js - Вспомогательные функции

// Функция для создания сообщения об ошибке
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--danger-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 500);
    }, 3000);
}

// Функция для создания сообщения об успехе
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 500);
    }, 3000);
}

// Добавить стили для анимаций
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);

// Экспорт функций для использования в других файлах
window.startTimer = startTimer;
window.formatTime = formatTime;
window.clearWorkspace = clearWorkspace;
window.checkCalculation = checkCalculation;
window.checkQuizAnswer = checkQuizAnswer;