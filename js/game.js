// game.js - Исправлены кнопка проверки и границы перетаскивания

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация игры
    initGame();
    
    // Установка обработчиков событий
    setupEventListeners();
});

// Инициализация игры
function initGame() {
    // Получение имени игрока
    const playerName = localStorage.getItem('circuitPlayerName') || 'Игрок';
    currentGameState.playerName = playerName;
    
    // Обновляем имя в новом месте
    const displayName = document.getElementById('displayPlayerName');
    if (displayName) displayName.textContent = playerName;
    
    // Обновляем отображение очков
    updateScore();
    
    // Инициализация первого уровня
    initLevel(1);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка проверки задания - ОБЯЗАТЕЛЬНО проверяем, что элемент существует
    const checkTaskBtn = document.getElementById('checkTaskBtn');
    if (checkTaskBtn) {
        console.log('Кнопка проверки найдена, добавляем обработчик');
        checkTaskBtn.addEventListener('click', function() {
            console.log('Кнопка проверки нажата');
            checkTask();
        });
    } else {
        console.error('Кнопка checkTaskBtn не найдена в DOM!');
    }
    
    // Кнопка следующего задания
    const nextTaskBtn = document.getElementById('nextTaskBtn');
    if (nextTaskBtn) {
        nextTaskBtn.addEventListener('click', function() {
            console.log('Кнопка следующего задания нажата');
            loadNextTask();
        });
    }
    
    // Кнопка очистки рабочей области
    const clearBtn = document.getElementById('clearWorkspaceBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearWorkspace);
    }
    
    // Кнопка завершения игры
    const finishBtn = document.getElementById('finishGameBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', finishGame);
    }
    
    // Кнопка сохранения и выхода
    const saveBtn = document.getElementById('saveAndExitBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAndExit);
    }
    
    // Вкладки уровней
    document.querySelectorAll('.level-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const level = parseInt(this.dataset.level);
            if (level !== currentGameState.currentLevel) {
                initLevel(level);
            }
        });
    });
    
    // Обработка горячих клавиш
    document.addEventListener('keydown', handleKeyPress);
    
    // Инициализация бургер-меню
    initBurgerMenu();
}

// Инициализация бургер-меню
function initBurgerMenu() {
    const burgerIcon = document.getElementById('burgerIcon');
    const burgerNav = document.getElementById('burgerNav');
    
    if (!burgerIcon || !burgerNav) return;
    
    burgerIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        const isVisible = burgerNav.style.display === 'block';
        burgerNav.style.display = isVisible ? 'none' : 'block';
        burgerIcon.classList.toggle('active');
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!burgerIcon.contains(event.target) && !burgerNav.contains(event.target)) {
            burgerNav.style.display = 'none';
            burgerIcon.classList.remove('active');
        }
    });
    
    // Обработчики для уровней в бургер-меню
    document.querySelectorAll('.burger-level').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const level = parseInt(this.dataset.level);
            if (level !== currentGameState.currentLevel) {
                initLevel(level);
            }
            burgerNav.style.display = 'none';
            burgerIcon.classList.remove('active');
        });
    });
    
    // Перезапуск игры
    const restartBtn = document.getElementById('restartGame');
    if (restartBtn) {
        restartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Начать игру заново?')) {
                localStorage.removeItem(`circuitGameState_${currentGameState.playerName}`);
                location.reload();
            }
        });
    }
}

// Переменные для drag & drop
let draggedElement = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Инициализация drag and drop
function initDragAndDrop() {
    console.log('Инициализация drag & drop');
    
    // Удаляем все старые обработчики
    removeAllDragHandlers();
    
    // Получаем элементы панели и рабочую область
    const panelElements = document.querySelectorAll('.panel-element');
    const workspace = document.getElementById('circuitWorkspace');
    
    if (!workspace) {
        console.error('Рабочая область circuitWorkspace не найдена!');
        return;
    }
    
    console.log('Найдено элементов на панели:', panelElements.length);
    
    // Добавляем обработчики для элементов панели
    panelElements.forEach(element => {
        // Для мыши
        element.addEventListener('mousedown', startElementDrag);
        // Для сенсорных экранов
        element.addEventListener('touchstart', startElementDragTouch, { passive: false });
        
        // Предотвращаем стандартное поведение drag & drop
        element.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        // Добавляем курсор
        element.style.cursor = 'grab';
    });
    
    // Добавляем обработчики для всего документа (чтобы элемент не выходил за границы)
    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', dropElement);
    
    // Для сенсорных экранов
    document.addEventListener('touchmove', dragElementTouch, { passive: false });
    document.addEventListener('touchend', dropElementTouch);
    
    console.log('Drag & drop инициализирован');
}

// Удаление всех обработчиков drag & drop
function removeAllDragHandlers() {
    const panelElements = document.querySelectorAll('.panel-element');
    
    panelElements.forEach(element => {
        element.removeEventListener('mousedown', startElementDrag);
        element.removeEventListener('touchstart', startElementDragTouch);
    });
    
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', dropElement);
    document.removeEventListener('touchmove', dragElementTouch);
    document.removeEventListener('touchend', dropElementTouch);
}

// Начало перетаскивания элемента (мышь) - ИСПРАВЛЕНО масштабирование
function startElementDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target.closest('.panel-element');
    if (!element) return;
    
    draggedElement = element;
    isDragging = true;
    
    // Создаем клон для перетаскивания - БЕЗ масштабирования!
    const clone = element.cloneNode(true);
    clone.classList.add('dragging-clone');
    clone.style.position = 'fixed';
    clone.style.zIndex = '10000';
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.7';
    clone.style.width = '80px';
    clone.style.height = '80px';
    clone.style.borderRadius = '10px';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.background = 'rgba(0, 210, 255, 0.2)';
    clone.style.border = '2px solid rgba(0, 210, 255, 0.4)';
    clone.style.boxShadow = '0 5px 15px rgba(0, 210, 255, 0.3)';
    
    // Сохраняем оригинальный контент
    const icon = element.querySelector('.element-icon').cloneNode(true);
    const name = element.querySelector('.element-name').cloneNode(true);
    
    clone.innerHTML = '';
    clone.appendChild(icon);
    clone.appendChild(name);
    
    // Вычисляем смещение относительно мыши
    const rect = element.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    
    // Позиционируем клон
    clone.style.left = `${e.clientX - dragOffsetX}px`;
    clone.style.top = `${e.clientY - dragOffsetY}px`;
    
    document.body.appendChild(clone);
    
    // Изменяем курсор
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('dragging');
    
    // Предотвращаем выделение текста
    e.preventDefault();
    return false;
}

// Начало перетаскивания элемента (сенсорный экран)
function startElementDragTouch(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target.closest('.panel-element');
    if (!element) return;
    
    draggedElement = element;
    isDragging = true;
    
    // Создаем клон для перетаскивания - БЕЗ масштабирования!
    const clone = element.cloneNode(true);
    clone.classList.add('dragging-clone');
    clone.style.position = 'fixed';
    clone.style.zIndex = '10000';
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '0.7';
    clone.style.width = '80px';
    clone.style.height = '80px';
    clone.style.borderRadius = '10px';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.background = 'rgba(0, 210, 255, 0.2)';
    clone.style.border = '2px solid rgba(0, 210, 255, 0.4)';
    clone.style.boxShadow = '0 5px 15px rgba(0, 210, 255, 0.3)';
    
    // Сохраняем оригинальный контент
    const icon = element.querySelector('.element-icon').cloneNode(true);
    const name = element.querySelector('.element-name').cloneNode(true);
    
    clone.innerHTML = '';
    clone.appendChild(icon);
    clone.appendChild(name);
    
    // Вычисляем смещение относительно касания
    const touch = e.touches[0];
    const rect = element.getBoundingClientRect();
    dragOffsetX = touch.clientX - rect.left;
    dragOffsetY = touch.clientY - rect.top;
    
    // Позиционируем клон
    clone.style.left = `${touch.clientX - dragOffsetX}px`;
    clone.style.top = `${touch.clientY - dragOffsetY}px`;
    
    document.body.appendChild(clone);
    
    document.body.classList.add('dragging');
    
    return false;
}

// Перетаскивание элемента (мышь) - ИСПРАВЛЕНО: ограничение границами
function dragElement(e) {
    if (!isDragging || !draggedElement) return;
    
    const clone = document.querySelector('.dragging-clone');
    if (!clone) return;
    
    // Получаем границы рабочей области
    const workspace = document.getElementById('circuitWorkspace');
    if (!workspace) return;
    
    const workspaceRect = workspace.getBoundingClientRect();
    
    // Ограничиваем координаты границами рабочей области
    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;
    
    // Минимальные координаты (верхний левый угол рабочей области)
    const minX = workspaceRect.left;
    const minY = workspaceRect.top;
    
    // Максимальные координаты (правый нижний угол рабочей области минус размер элемента)
    const maxX = workspaceRect.right - 80;
    const maxY = workspaceRect.bottom - 80;
    
    // Применяем ограничения
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    // Обновляем позицию клона
    clone.style.left = `${newX}px`;
    clone.style.top = `${newY}px`;
    
    e.preventDefault();
}

// Перетаскивание элемента (сенсорный экран) - ИСПРАВЛЕНО: ограничение границами
function dragElementTouch(e) {
    if (!isDragging || !draggedElement) return;
    
    const touch = e.touches[0];
    const clone = document.querySelector('.dragging-clone');
    if (!clone) return;
    
    // Получаем границы рабочей области
    const workspace = document.getElementById('circuitWorkspace');
    if (!workspace) return;
    
    const workspaceRect = workspace.getBoundingClientRect();
    
    // Ограничиваем координаты границами рабочей области
    let newX = touch.clientX - dragOffsetX;
    let newY = touch.clientY - dragOffsetY;
    
    // Минимальные координаты (верхний левый угол рабочей области)
    const minX = workspaceRect.left;
    const minY = workspaceRect.top;
    
    // Максимальные координаты (правый нижний угол рабочей области минус размер элемента)
    const maxX = workspaceRect.right - 80;
    const maxY = workspaceRect.bottom - 80;
    
    // Применяем ограничения
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    
    // Обновляем позицию клона
    clone.style.left = `${newX}px`;
    clone.style.top = `${newY}px`;
    
    e.preventDefault();
}

// Сброс элемента (мышь) - ИСПРАВЛЕНО: проверка нахождения в рабочей области
function dropElement(e) {
    if (!isDragging || !draggedElement) return;
    
    const clone = document.querySelector('.dragging-clone');
    if (clone) {
        clone.remove();
    }
    
    // Проверяем, находится ли курсор над рабочей областью
    const workspace = document.getElementById('circuitWorkspace');
    if (workspace) {
        const rect = workspace.getBoundingClientRect();
        
        // Всегда добавляем элемент, так как он ограничен границами рабочей области
        // Вычисляем координаты относительно рабочей области
        const x = e.clientX - rect.left - 40;
        const y = e.clientY - rect.top - 40;
        
        // Получаем тип элемента
        const elementType = draggedElement.dataset.element;
        
        // Добавляем элемент в рабочую область
        addElementToWorkspace(elementType, x, y);
    }
    
    // Сбрасываем состояние
    resetDragState();
    
    e.preventDefault();
}

// Сброс элемента (сенсорный экран)
function dropElementTouch(e) {
    if (!isDragging || !draggedElement) return;
    
    const clone = document.querySelector('.dragging-clone');
    if (clone) {
        clone.remove();
    }
    
    // Проверяем, находится ли касание над рабочей областью
    const workspace = document.getElementById('circuitWorkspace');
    if (workspace && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = workspace.getBoundingClientRect();
        
        // Всегда добавляем элемент, так как он ограничен границами
        const x = touch.clientX - rect.left - 40;
        const y = touch.clientY - rect.top - 40;
        
        // Получаем тип элемента
        const elementType = draggedElement.dataset.element;
        
        // Добавляем элемент в рабочую область
        addElementToWorkspace(elementType, x, y);
    }
    
    // Сбрасываем состояние
    resetDragState();
    
    e.preventDefault();
}

// Отмена перетаскивания
function cancelDrag() {
    if (!isDragging) return;
    
    const clone = document.querySelector('.dragging-clone');
    if (clone) {
        clone.remove();
    }
    
    resetDragState();
}

// Сброс состояния перетаскивания
function resetDragState() {
    isDragging = false;
    draggedElement = null;
    dragOffsetX = 0;
    dragOffsetY = 0;
    document.body.style.cursor = '';
    document.body.classList.remove('dragging');
}

// Добавление элемента в рабочую область
function addElementToWorkspace(elementType, x, y) {
    const workspace = document.getElementById('circuitWorkspace');
    if (!workspace) return;
    
    // Проверяем, не выходит ли элемент за границы
    const maxX = workspace.clientWidth - 80;
    const maxY = workspace.clientHeight - 80;
    
    const clampedX = Math.max(10, Math.min(x, maxX - 10));
    const clampedY = Math.max(10, Math.min(y, maxY - 10));
    
    // Создаем уникальный ID для элемента
    const elementId = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Создаем элемент
    const elementDiv = document.createElement('div');
    elementDiv.className = 'workspace-element';
    elementDiv.dataset.type = elementType;
    elementDiv.dataset.id = elementId;
    elementDiv.style.left = `${clampedX}px`;
    elementDiv.style.top = `${clampedY}px`;
    
    elementDiv.innerHTML = `
        <div class="element-icon">${getElementIcon(elementType)}</div>
        <div class="element-name">${getElementName(elementType)}</div>
        <div class="delete-element" title="Удалить элемент">×</div>
    `;
    
    workspace.appendChild(elementDiv);
    
    // Добавляем в состояние
    if (!currentGameState.workspaceElements) {
        currentGameState.workspaceElements = [];
    }
    
    currentGameState.workspaceElements.push({
        type: elementType,
        x: clampedX,
        y: clampedY,
        id: elementId,
        element: elementDiv
    });
    
    // Делаем элемент перетаскиваемым внутри рабочей области
    makeElementDraggable(elementDiv, elementId);
    
    // Добавляем обработчик удаления
    const deleteBtn = elementDiv.querySelector('.delete-element');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Удаляем элемент из DOM
        elementDiv.remove();
        
        // Удаляем из состояния
        currentGameState.workspaceElements = currentGameState.workspaceElements.filter(
            el => el.id !== elementId
        );
        
        console.log('Элемент удален. Осталось элементов:', currentGameState.workspaceElements.length);
    });
    
    // Анимация появления
    elementDiv.style.transform = 'scale(0)';
    elementDiv.style.opacity = '0';
    
    setTimeout(() => {
        elementDiv.style.transition = 'all 0.3s ease';
        elementDiv.style.transform = 'scale(1)';
        elementDiv.style.opacity = '1';
    }, 10);
    
    console.log('Элемент добавлен в рабочую область:', elementType);
}

// Делает элемент перетаскиваемым внутри рабочей области
function makeElementDraggable(element, elementId) {
    let isDraggingElement = false;
    let elementOffsetX, elementOffsetY;
    
    element.addEventListener('mousedown', startElementMove);
    element.addEventListener('touchstart', startElementMoveTouch, { passive: false });
    
    function startElementMove(e) {
        if (e.target.classList.contains('delete-element')) {
            return;
        }
        
        isDraggingElement = true;
        
        const rect = element.getBoundingClientRect();
        elementOffsetX = e.clientX - rect.left;
        elementOffsetY = e.clientY - rect.top;
        
        document.addEventListener('mousemove', moveElement);
        document.addEventListener('mouseup', stopElementMove);
        
        element.style.cursor = 'grabbing';
        element.style.zIndex = '100';
        e.preventDefault();
    }
    
    function startElementMoveTouch(e) {
        if (e.target.classList.contains('delete-element')) {
            return;
        }
        
        const touch = e.touches[0];
        isDraggingElement = true;
        
        const rect = element.getBoundingClientRect();
        elementOffsetX = touch.clientX - rect.left;
        elementOffsetY = touch.clientY - rect.top;
        
        document.addEventListener('touchmove', moveElementTouch, { passive: false });
        document.addEventListener('touchend', stopElementMove);
        
        element.style.zIndex = '100';
        e.preventDefault();
    }
    
    function moveElement(e) {
        if (!isDraggingElement) return;
        
        const workspace = document.getElementById('circuitWorkspace');
        if (!workspace) return;
        
        const workspaceRect = workspace.getBoundingClientRect();
        const maxX = workspace.clientWidth - element.offsetWidth;
        const maxY = workspace.clientHeight - element.offsetHeight;
        
        let x = e.clientX - workspaceRect.left - elementOffsetX;
        let y = e.clientY - workspaceRect.top - elementOffsetY;
        
        // Ограничиваем перемещение в пределах рабочей области
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        
        e.preventDefault();
    }
    
    function moveElementTouch(e) {
        if (!isDraggingElement) return;
        
        const touch = e.touches[0];
        const workspace = document.getElementById('circuitWorkspace');
        if (!workspace) return;
        
        const workspaceRect = workspace.getBoundingClientRect();
        const maxX = workspace.clientWidth - element.offsetWidth;
        const maxY = workspace.clientHeight - element.offsetHeight;
        
        let x = touch.clientX - workspaceRect.left - elementOffsetX;
        let y = touch.clientY - workspaceRect.top - elementOffsetY;
        
        // Ограничиваем перемещение в пределах рабочей области
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        
        e.preventDefault();
    }
    
    function stopElementMove() {
        isDraggingElement = false;
        
        document.removeEventListener('mousemove', moveElement);
        document.removeEventListener('mouseup', stopElementMove);
        document.removeEventListener('touchmove', moveElementTouch);
        document.removeEventListener('touchend', stopElementMove);
        
        element.style.cursor = 'grab';
        element.style.zIndex = '10';
        
        // Обновляем позицию в состоянии
        if (currentGameState.workspaceElements) {
            const index = currentGameState.workspaceElements.findIndex(el => el.id === elementId);
            if (index !== -1) {
                currentGameState.workspaceElements[index].x = parseInt(element.style.left);
                currentGameState.workspaceElements[index].y = parseInt(element.style.top);
            }
        }
    }
}

// Проверка задания - ИСПРАВЛЕНО: добавлены проверки на существование элементов
function checkTask() {
    console.log('Функция checkTask вызвана');
    
    const levelConfig = LEVELS_CONFIG.find(l => l.id === currentGameState.currentLevel);
    if (!levelConfig) {
        console.error('Конфигурация уровня не найдена');
        return;
    }
    
    let isCorrect = false;
    let message = '';
    
    switch(levelConfig.type) {
        case 'assembly':
            console.log('Проверка сборки схемы');
            isCorrect = checkAssemblyTask();
            message = isCorrect ? 'Схема собрана правильно!' : 'Схема собрана неправильно!';
            break;
            
        case 'calculation':
            console.log('Проверка расчета (новый формат)');
            isCorrect = checkCalculationTask();
            message = isCorrect ? 'Формула заполнена правильно!' : 'Ошибки в заполнении формулы!';
            break;
            
        case 'quiz':
            console.log('Проверка теста');
            isCorrect = checkQuizTask();
            message = isCorrect ? 'Ответ правильный!' : 'Ответ неправильный!';
            break;
    }
    
    console.log('Результат проверки:', isCorrect, message);
    
    if (isCorrect) {
        // Начисляем очки
        const score = levelConfig.baseScore;
        currentGameState.score = (currentGameState.score || 0) + score;
        currentGameState.tasksCompleted = (currentGameState.tasksCompleted || 0) + 1;
        
        showMessage(`${message} +${score} очков`, 'success');
        updateScore();
        
        // Показываем модальное окно успеха
        showTaskCompleteModal(score);
        
        // Сохраняем прогресс
        saveGameState();
        
        // Показываем кнопку "Следующее задание"
        const nextBtn = document.getElementById('nextTaskBtn');
        const checkBtn = document.getElementById('checkTaskBtn');
        if (nextBtn) nextBtn.style.display = 'block';
        if (checkBtn) checkBtn.style.display = 'none';
    } else {
        // Уменьшаем попытки
        if (currentGameState.currentAttempts > 0) {
            currentGameState.currentAttempts--;
        }
        
        // Штраф - половина от возможных баллов за задание
        const penalty = Math.floor(levelConfig.baseScore / 2);
        currentGameState.penalty = (currentGameState.penalty || 0) + penalty;
        
        if (currentGameState.currentAttempts > 0) {
            showMessage(`${message} Осталось попыток: ${currentGameState.currentAttempts}. Штраф: -${penalty} очков`, 'error');
        } else {
            showMessage(`${message} Попытки закончились! Задание не выполнено. Штраф: -${penalty} очков`, 'error');
            const checkBtn = document.getElementById('checkTaskBtn');
            if (checkBtn) checkBtn.disabled = true;
            
            // Через 2 секунды переходим к следующему заданию
            setTimeout(() => {
                loadNextTask();
                const checkBtn = document.getElementById('checkTaskBtn');
                if (checkBtn) checkBtn.disabled = false;
            }, 500);
        }
        
        // Обновляем отображение попыток и штрафа
        if (typeof updateAttemptsDisplay === 'function') {
            updateAttemptsDisplay();
        }
        updateScore();
    }
}

// game.js - Обновленная функция checkAssemblyTask

function checkAssemblyTask() {
    console.log('Проверка сборки схемы');
    
    const taskData = currentGameState.currentTaskData;
    const correctPlacement = currentGameState.correctAnswer;
    const userPlacement = currentGameState.circuitPlacements || {};
    
    if (!taskData || !correctPlacement) {
        console.error('Нет данных о задании');
        return false;
    }
    
    let isCorrect = true;
    
    // Проверяем все слоты
    for (const slotId in correctPlacement) {
        const correctElement = correctPlacement[slotId];
        const userElement = userPlacement[slotId];
        
        console.log(`Слот ${slotId}: должно быть ${correctElement}, есть ${userElement}`);
        
        if (!userElement || userElement !== correctElement) {
            isCorrect = false;
            break;
        }
    }
    
    // Проверяем, что все нужные элементы размещены
    const placedElements = Object.values(userPlacement);
    const requiredElements = Object.values(correctPlacement);
    
    for (const required of requiredElements) {
        if (!placedElements.includes(required)) {
            isCorrect = false;
            break;
        }
    }
    
    // Проверяем, что нет лишних элементов
    const extraElements = placedElements.filter(el => !requiredElements.includes(el));
    if (extraElements.length > 0) {
        console.log('Есть лишние элементы:', extraElements);
        isCorrect = false;
    }
    
    console.log('Результат проверки:', isCorrect ? 'Правильно' : 'Неправильно');
    return isCorrect;
}

// Проверка расчета (чистый формат)
function checkCalculationTask() {
    const task = currentGameState.currentTaskData;
    if (!task) return false;
    
    let allCorrect = true;
    
    // Проверяем известные переменные
    for (const [variable, info] of Object.entries(task.variables)) {
        const userValue = currentGameState.formulaValues[variable];
        const tolerance = info.value * 0.01; // 1% погрешность
        
        if (userValue === undefined || Math.abs(userValue - info.value) > tolerance) {
            allCorrect = false;
        }
    }
    
    // Проверяем целевую переменную
    const targetValue = currentGameState.formulaValues[task.targetVariable];
    const targetTolerance = task.answer * 0.01;
    
    if (targetValue === undefined || Math.abs(targetValue - task.answer) > targetTolerance) {
        allCorrect = false;
    }
    
    return allCorrect;
}
// Проверка теста
// Проверка теста (обновленная для множественного выбора)
function checkQuizTask() {
    const isMultiple = currentGameState.isMultipleChoice === true;
    
    if (isMultiple) {
        // Для множественного выбора
        const selectedOptions = currentGameState.selectedAnswers || [];
        
        if (selectedOptions.length === 0) {
            showMessage('Выберите хотя бы один вариант ответа!', 'error');
            return false;
        }
        
        const correctAnswers = Array.isArray(currentGameState.correctAnswer) 
            ? currentGameState.correctAnswer 
            : [currentGameState.correctAnswer];
        
        // Проверяем, что выбраны все правильные и нет неправильных
        let allCorrect = true;
        
        // Проверяем все выбранные ответы
        selectedOptions.forEach(selectedIndex => {
            if (!correctAnswers.includes(selectedIndex)) {
                allCorrect = false;
            }
        });
        
        // Проверяем, что все правильные ответы выбраны
        correctAnswers.forEach(correctIndex => {
            if (!selectedOptions.includes(correctIndex)) {
                allCorrect = false;
            }
        });
        
        return allCorrect;
        
    } else {
        // Для одиночного выбора (старая логика)
        const selectedOption = document.querySelector('.answer-option.selected');
        
        if (!selectedOption) {
            showMessage('Выберите вариант ответа!', 'error');
            return false;
        }
        
        const userAnswer = parseInt(selectedOption.dataset.index);
        const correctAnswer = currentGameState.correctAnswer;
        
        return userAnswer === correctAnswer;
    }
}

// Очистка рабочей области
function clearWorkspace() {
    // Очищаем состояние
    currentGameState.workspaceElements = [];
    
    // Очищаем рабочую область
    const workspace = document.getElementById('circuitWorkspace');
    if (workspace) {
        workspace.innerHTML = '';
    }
    
    console.log('Рабочая область очищена');
}

// Завершение игры
function finishGame() {
    if (currentGameState.timerInterval) {
        clearInterval(currentGameState.timerInterval);
    }
    
    // Сохраняем результат
    saveGameResult();
    
    // Показываем модальное окно
    const finalScore = document.getElementById('finalScore');
    const totalTasksCompleted = document.getElementById('totalTasksCompleted');
    const totalTime = document.getElementById('totalTime');
    const gameOverModal = document.getElementById('gameOverModal');
    
    if (finalScore) finalScore.textContent = currentGameState.score || 0;
    if (totalTasksCompleted) totalTasksCompleted.textContent = currentGameState.tasksCompleted || 0;
    if (totalTime) totalTime.textContent = document.getElementById('currentTime')?.textContent || '00:00';
    if (gameOverModal) gameOverModal.style.display = 'flex';
    
    // Обработчики для модального окна
    const playAgainBtn = document.getElementById('playAgainBtn');
    const goToRatingBtn = document.getElementById('goToRatingBtn');
    const goToHomeBtn = document.getElementById('goToHomeBtn');
    
    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            location.reload();
        };
    }
    
    if (goToRatingBtn) {
        goToRatingBtn.onclick = function() {
            window.location.href = 'rating.html';
        };
    }
    
    if (goToHomeBtn) {
        goToHomeBtn.onclick = function() {
            window.location.href = 'index.html';
        };
    }
}

// Сохранение и выход
function saveAndExit() {
    saveGameState();
    saveGameResult();
    window.location.href = 'index.html';
}

// Сохранение состояния игры
function saveGameState() {
    const gameState = {
        playerName: currentGameState.playerName,
        currentLevel: currentGameState.currentLevel,
        currentTask: currentGameState.currentTask,
        score: currentGameState.score || 0,
        penalty: currentGameState.penalty || 0,
        tasksCompleted: currentGameState.tasksCompleted || 0
    };
    
    localStorage.setItem(`circuitGameState_${currentGameState.playerName}`, JSON.stringify(gameState));
}

// Сохранение результата игры
function saveGameResult() {
    const gameResult = {
        playerName: currentGameState.playerName,
        score: currentGameState.score || 0,
        penalty: currentGameState.penalty || 0,
        tasksCompleted: currentGameState.tasksCompleted || 0,
        date: new Date().toISOString(),
        time: document.getElementById('currentTime')?.textContent || '00:00'
    };
    
    const existingResults = JSON.parse(localStorage.getItem('circuitGameResults') || '[]');
    existingResults.push(gameResult);
    
    if (existingResults.length > 50) {
        existingResults.shift();
    }
    
    localStorage.setItem('circuitGameResults', JSON.stringify(existingResults));
}

// Показать сообщение
function showMessage(text, type) {
    console.log('Показ сообщения:', text, type);
    
    const messageBox = document.getElementById('messageBox');
    if (!messageBox) {
        console.error('messageBox не найден');
        return;
    }
    
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'flex';
    
    setTimeout(() => {
        messageBox.className = 'message-box';
    }, 3000);
}

// Обновление счета
function updateScore() {
    const scoreElement = document.querySelector('.score-levels strong');
    const penaltyElement = document.getElementById('penalty');
    const tasksElement = document.getElementById('tasksCompleted');
    
    if (scoreElement) {
        scoreElement.textContent = currentGameState.score || 0;
    }
    
    if (penaltyElement) {
        penaltyElement.textContent = currentGameState.penalty || 0;
    }
    
    if (tasksElement) {
        tasksElement.textContent = currentGameState.tasksCompleted || 0;
    }
}

// Показать модальное окно успешного выполнения задания
function showTaskCompleteModal(score) {
    const taskScoreElement = document.getElementById('taskScore');
    const countdownElement = document.getElementById('countdown');
    const modal = document.getElementById('taskCompleteModal');
    
    if (taskScoreElement) {
        taskScoreElement.textContent = score;
    }
    
    if (modal) {
        modal.style.display = 'flex';
        
        let countdown = 3;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                modal.style.display = 'none';
                loadNextTask();
            }
        }, 1000);
    }
}

// Обработка горячих клавиш
function handleKeyPress(event) {
    switch(event.key) {
        case 'Enter':
            if (event.target.id !== 'calculationInput') {
                checkTask();
            } else {
                checkTask();
            }
            break;
        case 'Escape':
            clearWorkspace();
            break;
        case 'Delete':
            const selectedElements = document.querySelectorAll('.workspace-element:hover');
            selectedElements.forEach(el => {
                const deleteBtn = el.querySelector('.delete-element');
                if (deleteBtn) deleteBtn.click();
            });
            break;
    }
}

// Таймер
function startTimer() {
    if (currentGameState.timerInterval) {
        clearInterval(currentGameState.timerInterval);
    }
    
    currentGameState.timerInterval = setInterval(() => {
        if (currentGameState.timeLeft <= 0) {
            clearInterval(currentGameState.timerInterval);
            showMessage('Время вышло!', 'error');
            loadNextTask();
            return;
        }
        
        currentGameState.timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentGameState.timeLeft / 60);
    const seconds = currentGameState.timeLeft % 60;
    
    const timerElement = document.getElementById('timer');
    const currentTimeElement = document.getElementById('currentTime');
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timerElement) {
        timerElement.textContent = timeString;
    }
    
    if (currentTimeElement) {
        currentTimeElement.textContent = timeString;
    }
}

// Вспомогательные функции
function getElementName(elementId) {
    const names = {
        'battery': 'Батарея',
        'resistor': 'Резистор',
        'lamp': 'Лампочка',
        'switch': 'Выключатель',
        'led': 'Светодиод',
        'relay': 'Реле'
    };
    return names[elementId] || elementId;
}

function getElementIcon(elementId) {
    const icons = {
        'battery': '🔋',
        'resistor': '⏚',
        'lamp': '💡',
        'switch': '🔘',
        'led': '🔴',
        'relay': '🔄'
    };
    return icons[elementId] || '⚡';
}

// Экспорт функций
window.initDragAndDrop = initDragAndDrop;
window.checkTask = checkTask;
window.loadNextTask = loadNextTask;
window.updateScore = updateScore;
window.showMessage = showMessage;
window.startTimer = startTimer;
window.updateTimerDisplay = updateTimerDisplay;
window.clearWorkspace = clearWorkspace;