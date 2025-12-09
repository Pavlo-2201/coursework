// levels.js - Упрощенная логика уровней с новым первым уровнем
const LEVELS_CONFIG = [
    {
        id: 1,
        name: "Сборка схемы по образцу",
        type: "assembly",
        timePerTask: 180, // 3 минуты на задание
        attempts: 3, // 3 попытки на задание
        tasks: [
            {
                id: 1,
                title: "Задание 1: Простая цепь",
                description: "Соберите схему в соответствии с образцом",
                instructionImage: 'pics/instruction1.png',
                circuitImage: 'pics/field.png',
                correctPlacement: {
                    slot1: 'switch',
                    slot2: 'ammeter',
                    slot3: 'bulb',
                },
                slotPositions: {
                    slot1: { top: '35%', left: '12%' },
                    slot2: { top: '64%', left: '43%' },
                    slot3: { top: '35%', left: '74%' },
                },
                elements: ["switch", "ammeter", "bulb"]
            },
            {
                id: 2,
                title: "Задание 2: Цепь с амперметром",
                description: "Соберите схему в соответствии с образцом",
                instructionImage: 'pics/instruction2.png',
                circuitImage: 'pics/field.png',
                correctPlacement: {
                    slot1: 'switch',
                    slot2: 'bulb',
                    slot3: 'ammeter',
                },
                slotPositions: {
                    slot1: { top: '35%', left: '12%' },
                    slot2: { top: '64%', left: '43%' },
                    slot3: { top: '35%', left: '74%' },
                },
                elements: ["switch", "bulb", "ammeter", "resistor"]
            },
            {
                id: 3,
                title: "Задание 3: Параллельная цепь",
                description: "Соберите схему в соответствии с образцом",
                instructionImage: 'pics/instruction4.png',
                circuitImage: 'pics/field2.png',
                correctPlacement: {
                    slot1: 'bulb',
                    slot2: 'ammeter',
                    slot3: 'switch',
                },
                slotPositions: {
                    slot2: { top: '20%', left: '74%' },
                    slot1: { top: '75%', left: '42%' },
                    slot3: { top: '48%', left: '74%' },
                },
                elements: ["battery", "bulb", "ammeter", "switch", "resistor"]
            }
        ],
        baseScore: 100
    },
    {
        id: 2,
        name: "Расчеты",
        type: "calculation",
        timePerTask: 120,
        attempts: 3,
        tasks: [
            {
                id: 1,
                question: "Рассчитайте силу тока в цепи с напряжением 12В и сопротивлением 4Ом",
                formula: "I = U / R",
                variables: {
                    'U': { value: 12, unit: 'В' },
                    'R': { value: 4, unit: 'Ом' }
                },
                targetVariable: 'I',
                targetUnit: 'А',
                answer: 3
            },
            // ВТОРОЕ ЗАДАНИЕ - СЛОЖНЕЕ (было: U = I * R)
            {
                id: 2,
                question: "Рассчитайте мощность цепи, если напряжение 24В, сила тока 0.5А, сопротивление 48Ом",
                formula: "P = U * I = I² * R ",
                variables: {
                    'U': { value: 24, unit: 'В' },
                    'I': { value: 0.5, unit: 'А' },
                    'R': { value: 48, unit: 'Ом' }
                },
                targetVariable: 'P',
                targetUnit: 'Вт',
                answer: 12 // P = U * I = 24 * 0.5 = 12 Вт
            },
            // ТРЕТЬЕ ЗАДАНИЕ - ЕЩЕ СЛОЖНЕЕ (было: R = U / I)
            {
                id: 3,
                question: "Рассчитайте общее сопротивление параллельной цепи: R1=6Ом, R2=12Ом, R3=4Ом",
                formula: "1/R = 1/R1 + 1/R2 + 1/R3",
                variables: {
                    'R1': { value: 6, unit: 'Ом' },
                    'R2': { value: 12, unit: 'Ом' },
                    'R3': { value: 4, unit: 'Ом' }
                },
                targetVariable: 'R',
                targetUnit: 'Ом',
                answer: 2 // 1/R = 1/6 + 1/12 + 1/4 = 1/2 → R = 2 Ом
            }
        ],
        baseScore: 150
    },
    {
        id: 3,
        name: "Теория",
        type: "quiz",
        timePerTask: 90,
        attempts: 3,
        tasks: [
            {
                id: 1,
                question: "Для чего нужен резистор в электрической цепи?",
                answers: [
                    "Для ограничения тока",
                    "Для увеличения напряжения", 
                    "Для хранения энергии",
                    "Для переключения цепи"
                ],
                correct: 0
            },
            // ВТОРОЕ ЗАДАНИЕ - СЛОЖНЕЕ (больше вариантов)
            {
                id: 2,
                question: "Выберите ВСЕ правильные утверждения о законе Ома:",
                answers: [
                    "Сила тока прямо пропорциональна напряжению",
                    "Сопротивление измеряется в Омах",
                    "При последовательном соединении напряжения складываются",
                    "Закон Ома применяется только для постоянного тока"
                ],
                correct: [0, 1, 2], // Несколько правильных ответов!
                multiple: true // Флаг множественного выбора
            },
            // ТРЕТЬЕ ЗАДАНИЕ - ЕЩЕ СЛОЖНЕЕ (сложный вопрос)
            {
                id: 3,
                question: "В цепи с последовательным соединением: R1=10Ом, R2=20Ом, Uобщ=60В. Рассчитайте:",
                answers: [
                    "Общее сопротивление: 30 Ом, ток: 2 А, U1: 20 В, U2: 40 В",
                    "Общее сопротивление: 30 Ом, ток: 2 А, U1: 10 В, U2: 50 В", 
                    "Общее сопротивление: 30 Ом, ток: 3 А, U1: 30 В, U2: 30 В",
                    "Общее сопротивление: 15 Ом, ток: 4 А, U1: 40 В, U2: 20 В"
                ],
                correct: 0 // Rобщ = 10+20=30 Ом, I=60/30=2 А, U1=2*10=20 В, U2=2*20=40 В
            }
        ],
        baseScore: 120
    }
];

// Текущее состояние игры
let currentGameState = {
    playerName: "",
    currentLevel: 1,
    currentTask: 0,
    currentAttempts: 3,
    tasksCompleted: 0,
    score: 0,
    penalty: 0,
    timeLeft: 0,
    timerInterval: null,
    workspaceElements: [],
    circuitPlacements: {},
    currentTaskData: null,
    currentAnswer: null,
    selectedAnswer: null
};

// Инициализация уровня
function initLevel(levelId) {
    const levelConfig = LEVELS_CONFIG.find(l => l.id === levelId);
    if (!levelConfig) return;
    
    // Устанавливаем текущий уровень
    currentGameState.currentLevel = levelId;
    currentGameState.currentTask = 0;
    currentGameState.currentAttempts = levelConfig.attempts;
    currentGameState.workspaceElements = [];
    currentGameState.circuitPlacements = {};
    currentGameState.currentTaskData = null;
    currentGameState.currentAnswer = null;
    currentGameState.selectedAnswer = null;
    
    // Обнуляем penalty для нового уровня
    currentGameState.penalty = 0;
    
    // Если это уровень 1, скрываем правую панель элементов
    if (levelId === 1) {
        const elementsPanel = document.getElementById('elementsPanel');
        if (elementsPanel) {
            elementsPanel.style.display = 'none';
        }
    }
    
    // Обновляем UI
    updateLevelUI(levelConfig);
    
    // Загружаем первое задание уровня
    loadNextTask();
    
    // Обновляем активную вкладку
    updateLevelTabs();
}

// Загрузка следующего задания
function loadNextTask() {
    const levelConfig = LEVELS_CONFIG.find(l => l.id === currentGameState.currentLevel);
    if (!levelConfig) return;
    
    // Увеличиваем номер задания
    currentGameState.currentTask++;
    
    // Если задания закончились, завершаем уровень
    if (currentGameState.currentTask > levelConfig.tasks.length) {
        completeLevel();
        return;
    }
    
    // Сбрасываем состояние
    currentGameState.currentAttempts = levelConfig.attempts;
    currentGameState.workspaceElements = [];
    currentGameState.circuitPlacements = {};
    currentGameState.currentTaskData = null;
    
    // Сбрасываем таймер
    currentGameState.timeLeft = levelConfig.timePerTask;
    if (typeof startTimer === 'function') {
        startTimer();
    }
    
    // Получаем текущее задание
    const task = levelConfig.tasks[currentGameState.currentTask - 1];
    
    // Очищаем контент
    const taskContent = document.getElementById('taskContent');
    taskContent.innerHTML = '';
    
    // Генерируем контент в зависимости от типа уровня
    switch(levelConfig.type) {
        case 'assembly':
            generateAssemblyTask(task, taskContent);
            // Скрываем правую панель элементов (она больше не нужна для этого уровня)
            const elementsPanel = document.getElementById('elementsPanel');
            if (elementsPanel) {
                elementsPanel.style.display = 'none';
            }
            break;
        case 'calculation':
            generateCalculationTask(task, taskContent);
            break;
        case 'quiz':
            generateQuizTask(task, taskContent);
            break;
    }
    
    // Обновляем прогресс и попытки
    updateProgress();
    updateAttemptsDisplay();
    
    // Скрываем кнопку "Следующее задание"
    const nextBtn = document.getElementById('nextTaskBtn');
    const checkBtn = document.getElementById('checkTaskBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    if (checkBtn) {
        checkBtn.style.display = 'block';
        checkBtn.disabled = false;
    }
}

// Генерация задания для сборки схемы по образцу
// Генерация задания для сборки схемы по образцу
function generateAssemblyTask(task, container) {
    container.innerHTML = '';
    
    // Создаем контейнер для задания
    const taskDiv = document.createElement('div');
    taskDiv.className = 'circuit-assembly-task';
    
    // Трехколоночная структура
    const threeColumnLayout = document.createElement('div');
    threeColumnLayout.className = 'circuit-three-column-layout';
    
    // ЛЕВАЯ колонка: Образец для сборки
    const leftColumn = document.createElement('div');
    leftColumn.className = 'circuit-column-left';
    leftColumn.innerHTML = `
        <div class="instruction-area">
            <div class="instruction-title">
                <i class="fas fa-eye"></i> Образец для сборки:
            </div>
            <div class="instruction-container">
                <img id="instructionImage" src="${task.instructionImage}" alt="Образец" class="instruction-image">
            </div>
        </div>
    `;
    
    // ЦЕНТРАЛЬНАЯ колонка: Схема для сборки
    const centerColumn = document.createElement('div');
    centerColumn.className = 'circuit-column-center';
    
    // Создаем контейнер схемы
    const circuitContainer = document.createElement('div');
    circuitContainer.className = 'circuit-container';
    
    // Изображение схемы
    const circuitImg = document.createElement('img');
    circuitImg.id = 'circuitImage';
    circuitImg.src = task.circuitImage;
    circuitImg.alt = 'Схема';
    circuitImg.className = 'circuit-image';
    circuitContainer.appendChild(circuitImg);
    
    // Создаем слоты для элементов (3 слота)
    for (let i = 1; i <= 3; i++) {
        const slotId = `slot${i}`;
        const slotDiv = document.createElement('div');
        slotDiv.id = slotId;
        slotDiv.className = 'circuit-slot';
        slotDiv.dataset.slot = slotId;
        
        // Добавляем подсказку внутри слота
        const hintSpan = document.createElement('span');
        hintSpan.className = 'slot-hint';
        hintSpan.textContent = `Слот ${i}`;
        slotDiv.appendChild(hintSpan);
        
        circuitContainer.appendChild(slotDiv);
    }
    
    centerColumn.appendChild(circuitContainer);
    
    // ПРАВАЯ колонка: Элементы для перетаскивания
    const rightColumn = document.createElement('div');
    rightColumn.className = 'circuit-column-right';
    rightColumn.innerHTML = `
        <div class="circuit-elements-container">
            <div class="elements-title">
                <i class="fas fa-arrows-alt"></i> Перетащите элементы:
            </div>
            <div class="elements-grid" id="circuitElements"></div>
        </div>
    `;
    
    // Собираем колонки
    threeColumnLayout.appendChild(leftColumn);
    threeColumnLayout.appendChild(centerColumn);
    threeColumnLayout.appendChild(rightColumn);
    
    taskDiv.appendChild(threeColumnLayout);
    container.appendChild(taskDiv);
    
    // Устанавливаем позиции слотов после рендеринга
    setTimeout(() => {
        setSlotPositions(task.slotPositions);
        
        // Сохраняем правильный ответ
        currentGameState.correctAnswer = task.correctPlacement;
        currentGameState.currentTaskData = task;
        currentGameState.circuitPlacements = {};
        
        // Заполняем контейнер элементов
        const elementsGrid = rightColumn.querySelector('.elements-grid');
        fillCircuitElements(task.elements, elementsGrid);
        
        // Инициализируем drag and drop
        initCircuitDragAndDrop();
    }, 100);
}

function fillCircuitElements(elements, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Все возможные элементы
    const allElements = [
        { id: 'bulb', name: 'Лампочка', img: 'pics/bulb.png' },
        { id: 'switch', name: 'Выключатель', img: 'pics/switch.png' },
        { id: 'ammeter', name: 'Амперметр', img: 'pics/ammeter.png' },
        { id: 'resistor', name: 'Резистор', img: 'pics/resistor.png' },
        { id: 'battery', name: 'Батарея', img: 'pics/battery.png' },
        { id: 'led', name: 'Светодиод', img: 'pics/led.png' },
        { id: 'relay', name: 'Реле', img: 'pics/relay.png' }
    ];
    
    // Добавляем элементы из задачи
    elements.forEach(elementId => {
        const elementData = allElements.find(el => el.id === elementId);
        if (elementData) {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'circuit-element-draggable';
            elementDiv.id = `element-${elementId}`;
            elementDiv.draggable = true;
            elementDiv.dataset.element = elementId;
            
            elementDiv.innerHTML = `
                <div class="element-icon">
                    <img src="${elementData.img}" alt="${elementData.name}" class="element-img" draggable="false">
                </div>
                <div class="element-name">${elementData.name}</div>
            `;
            
            container.appendChild(elementDiv);
        }
    });
}

// Функция для установки позиций слотов
function setSlotPositions(positions) {
    console.log('Установка позиций слотов:', positions);
    
    for (const slotId in positions) {
        const slot = document.getElementById(slotId);
        if (slot) {
            const { top, left } = positions[slotId];
            
            // Сбрасываем стили
            slot.style.position = 'absolute';
            slot.style.top = top;
            slot.style.left = left;
            slot.style.width = '80px';
            slot.style.height = '80px';
            slot.style.zIndex = '10';
            
            // Добавляем контур для видимости
            slot.style.border = '2px dashed rgba(0, 210, 255, 0.7)';
            slot.style.borderRadius = '10px';
            slot.style.backgroundColor = 'rgba(0, 210, 255, 0.08)';
            slot.style.display = 'flex';
            slot.style.alignItems = 'center';
            slot.style.justifyContent = 'center';
            
            console.log(`Слот ${slotId} установлен в позицию:`, top, left);
        } else {
            console.error(`Слот ${slotId} не найден!`);
        }
    }
}

// Функция для инициализации drag and drop
function initCircuitDragAndDrop() {
    // Очищаем старые обработчики
    const oldElements = document.querySelectorAll('.circuit-element-draggable');
    const oldSlots = document.querySelectorAll('.circuit-slot');
    
    oldElements.forEach(el => {
        el.removeEventListener('dragstart', handleCircuitDragStart);
        el.removeEventListener('dragend', handleCircuitDragEnd);
    });
    
    oldSlots.forEach(slot => {
        slot.removeEventListener('dragover', handleCircuitDragOver);
        slot.removeEventListener('drop', handleCircuitDrop);
        slot.removeEventListener('dragleave', handleCircuitDragLeave);
    });
    
    // Получаем элементы
    const draggableElements = document.querySelectorAll('.circuit-element-draggable');
    const dropzones = document.querySelectorAll('.circuit-slot');
    
    console.log('Инициализация drag and drop. Элементов:', draggableElements.length, 'Слотов:', dropzones.length);
    
    // Выводим информацию о слотах
    dropzones.forEach(slot => {
        console.log('Слот найден:', slot.id, 'Позиция:', slot.style.top, slot.style.left);
    });
    
    // Обработчики для элементов
    draggableElements.forEach(element => {
        element.addEventListener('dragstart', handleCircuitDragStart);
        element.addEventListener('dragend', handleCircuitDragEnd);
        
        // Добавляем визуальную обратную связь
        element.addEventListener('dragstart', function() {
            this.classList.add('dragging');
            console.log('Начато перетаскивание:', this.id);
        });
        
        element.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
    });
    
    // Обработчики для слотов
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', handleCircuitDragOver);
        dropzone.addEventListener('drop', handleCircuitDrop);
        dropzone.addEventListener('dragleave', handleCircuitDragLeave);
        
        // Визуальная обратная связь при наведении
        dropzone.addEventListener('dragover', function(e) {
            this.classList.add('drag-over');
            console.log('Перетаскивание над слотом:', this.id);
        });
        
        dropzone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        dropzone.addEventListener('drop', function() {
            this.classList.remove('drag-over');
        });
    });
}

// Обработчики событий для drag and drop
function handleCircuitDragStart(event) {
    // Разрешаем перетаскивание только самого элемента, а не картинки внутри
    if (event.target.classList.contains('element-img') || 
        event.target.classList.contains('element-icon')) {
        event.preventDefault();
        return;
    }
    
    console.log('Drag start event:', event.target.id);
    
    // Сохраняем данные о перетаскиваемом элементе
    const elementId = event.target.dataset.element;
    if (!elementId) {
        // Если кликнули по картинке или иконке, находим родительский элемент
        const elementDiv = event.target.closest('.circuit-element-draggable');
        if (!elementDiv) {
            event.preventDefault();
            return;
        }
        event.dataTransfer.setData('text/plain', elementDiv.dataset.element);
    } else {
        event.dataTransfer.setData('text/plain', elementId);
    }
    
    event.dataTransfer.effectAllowed = 'move';
    
    // Создаем прозрачное изображение для перетаскивания (призрак)
    const dragGhost = event.target.cloneNode(true);
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-1000px';
    dragGhost.style.left = '-1000px';
    dragGhost.style.opacity = '0.7';
    dragGhost.style.transform = 'scale(0.9)';
    dragGhost.style.zIndex = '10000';
    dragGhost.id = 'drag-ghost';
    dragGhost.classList.add('dragging-ghost');
    
    // Удаляем изображение из призрака, чтобы не было двойных картинок
    const img = dragGhost.querySelector('.element-img');
    if (img) {
        img.style.display = 'none';
    }
    
    document.body.appendChild(dragGhost);
    
    // Используем призрак как изображение для перетаскивания
    event.dataTransfer.setDragImage(dragGhost, 55, 55);
    
    // Удаляем призрака после начала перетаскивания
    setTimeout(() => {
        const ghost = document.getElementById('drag-ghost');
        if (ghost) {
            document.body.removeChild(ghost);
        }
    }, 0);
}

function handleCircuitDragEnd(event) {
    console.log('Drag end event');
    // Удаляем призрака, если он еще есть
    const ghost = document.getElementById('drag-ghost');
    if (ghost) {
        document.body.removeChild(ghost);
    }
}

function handleCircuitDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleCircuitDragLeave(event) {
    event.target.classList.remove('drag-over');
}

function handleCircuitDrop(event) {
    event.preventDefault();
    event.target.classList.remove('drag-over');
    
    const elementType = event.dataTransfer.getData('text/plain');
    console.log('Drop event. Element type:', elementType, 'Target:', event.target.id);
    
    if (!elementType) {
        console.error('Нет данных о перетаскиваемом элементе');
        return;
    }
    
    const dropzone = event.target.closest('.circuit-slot');
    if (!dropzone) {
        console.error('Цель не является слотом');
        console.log('Элемент упал на:', event.target);
        return;
    }
    
    console.log('Размещение элемента в слоте:', dropzone.id);
    
    // Очищаем слот перед добавлением нового элемента
    dropzone.innerHTML = '';
    
    // Создаем размещенный элемент
    const placedElement = createPlacedElement(elementType);
    dropzone.appendChild(placedElement);
    
    // Сохраняем размещение в состоянии игры
    const slotId = dropzone.id;
    currentGameState.circuitPlacements[slotId] = elementType;
    
    console.log('Элемент размещен в слоте:', slotId, '->', elementType);
    console.log('Текущие размещения:', currentGameState.circuitPlacements);
}

// Функция создания размещенного элемента
function createPlacedElement(elementType) {
    const placedElement = document.createElement('div');
    placedElement.className = 'placed-element';
    placedElement.dataset.type = elementType;
    
    // Определяем изображение
    let imgSrc = '';
    
    switch(elementType) {
        case 'bulb':
            imgSrc = 'pics/bulb.png';
            break;
        case 'switch':
            imgSrc = 'pics/switch.png';
            break;
        case 'ammeter':
            imgSrc = 'pics/ammeter.png';
            break;
        case 'resistor':
            imgSrc = 'pics/resistor.png';
            break;
        case 'battery':
            imgSrc = 'pics/battery.png';
            break;
    }
    
    placedElement.innerHTML = `
        <div class="placed-element-icon">
            <img src="${imgSrc}" alt="" class="placed-element-img" draggable="false">
        </div>
        <div class="delete-placed-element" title="Удалить элемент">×</div>
    `;
    
    // Добавляем обработчик для кнопки удаления
    const deleteBtn = placedElement.querySelector('.delete-placed-element');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Находим родительский слот
        const slot = this.closest('.circuit-slot');
        if (slot) {
            // Возвращаем подсказку
            slot.innerHTML = '<span class="slot-hint">Слот ' + slot.id.replace('slot', '') + '</span>';
            
            // Удаляем из состояния
            delete currentGameState.circuitPlacements[slot.id];
            console.log('Элемент удален из слота', slot.id);
        }
    });
    
    return placedElement;
}

// Генерация задания для расчетов (новый формат - чистый, по центру)
function generateCalculationTask(task, container) {
    container.innerHTML = '';
    
    // Создаем контейнер для задания
    const taskDiv = document.createElement('div');
    taskDiv.className = 'calculation-task-new';
    
    // Заголовок задачи (центрированный)
    const headerDiv = document.createElement('div');
    headerDiv.className = 'calculation-header';
    headerDiv.innerHTML = `
        <h3>${task.question}</h3>
    `;
    
    // Контейнер для формулы и ввода (всё по центру)
    const formulaContainer = document.createElement('div');
    formulaContainer.className = 'formula-main-container';
    
    // Формула с пустыми полями (чистый вид)
    const formulaDiv = document.createElement('div');
    formulaDiv.className = 'formula-with-inputs-clean';
    
    // Разбираем формулу на части
    const formulaParts = task.formula.split(/([=*/+-])/);
    
    // Создаем элементы формулы
    formulaParts.forEach((part, index) => {
        const trimmedPart = part.trim();
        
        if (task.variables[trimmedPart] || trimmedPart === task.targetVariable) {
            // Это переменная - создаем поле ввода
            const inputWrapper = document.createElement('div');
            inputWrapper.className = 'formula-input-wrapper-clean';
            
            const isTarget = trimmedPart === task.targetVariable;
            
            // Создаем поле ввода
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'formula-input-clean';
            input.dataset.variable = trimmedPart;
            if (isTarget) input.dataset.isTarget = 'true';
            input.placeholder = '?';
            input.step = '1';
            
            // Метка переменной (над полем)
            const label = document.createElement('div');
            label.className = 'variable-label-clean';
            label.textContent = trimmedPart;
            
            // Единицы измерения (под полем)
            const units = document.createElement('div');
            units.className = 'variable-units-clean';
            
            if (isTarget) {
                units.textContent = task.targetUnit;
            } else {
                units.textContent = task.variables[trimmedPart].unit;
            }
            
            inputWrapper.appendChild(label);
            inputWrapper.appendChild(input);
            inputWrapper.appendChild(units);
            
            formulaDiv.appendChild(inputWrapper);
            
        } else if (trimmedPart && !['=', '+', '-', '*', '/'].includes(trimmedPart)) {
            // Это оператор или константа
            const operatorSpan = document.createElement('span');
            operatorSpan.className = 'formula-operator-clean';
            operatorSpan.textContent = trimmedPart;
            formulaDiv.appendChild(operatorSpan);
        } else if (['=', '+', '-', '*', '/'].includes(trimmedPart)) {
            // Математический оператор
            const operatorSpan = document.createElement('span');
            operatorSpan.className = 'math-operator-clean';
            operatorSpan.textContent = trimmedPart;
            formulaDiv.appendChild(operatorSpan);
        }
    });
    
    // Прогресс-бар (чистый вид)
    const progressDiv = document.createElement('div');
    progressDiv.className = 'formula-progress-clean';
    progressDiv.innerHTML = `
        <div class="progress-bar-clean">
            <div class="progress-fill-clean" style="width: 0%"></div>
        </div>
        <div class="progress-percent-clean">0%</div>
    `;
    // Собираем всё вместе
    formulaContainer.appendChild(formulaDiv);
    formulaContainer.appendChild(progressDiv);
    
    taskDiv.appendChild(headerDiv);
    taskDiv.appendChild(formulaContainer);
    
    container.appendChild(taskDiv);
    
    // Сохраняем данные задания
    currentGameState.correctAnswer = task.answer;
    currentGameState.currentTaskData = task;
    currentGameState.formulaProgress = 0;
    currentGameState.formulaValues = {};
    
    // Инициализируем обработчики
    setTimeout(() => {
        initFormulaInputsClean();
        initFormulaProgressClean();
    }, 100);
}

// Инициализация полей ввода формулы (чистый вариант)
function initFormulaInputsClean() {
    const inputs = document.querySelectorAll('.formula-input-clean');
    
    inputs.forEach(input => {
        // Обработчик изменения значения
        input.addEventListener('input', function() {
            const variable = this.dataset.variable;
            const value = parseFloat(this.value);
            
            if (!isNaN(value)) {
                currentGameState.formulaValues[variable] = value;
                this.classList.remove('empty');
            } else {
                delete currentGameState.formulaValues[variable];
                this.classList.add('empty');
            }
            
            // Обновляем прогресс
            updateFormulaProgressClean();
            
            // Проверяем, можно ли активировать кнопку проверки
            checkFormulaCompletionClean();
        });
        
        // Подсветка при фокусе
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
        
        // Изначально помечаем как пустое
        input.classList.add('empty');
    });
}

// Инициализация прогресс-бара формулы (чистый вариант)
function initFormulaProgressClean() {
    const task = currentGameState.currentTaskData;
    if (!task) return;
    
    // Вычисляем общее количество полей для заполнения
    const totalFields = Object.keys(task.variables).length + 1; // +1 для целевой переменной
    currentGameState.totalFormulaFields = totalFields;
    
    updateFormulaProgressClean();
}

// Обновление прогресс-бара (чистый вариант)
function updateFormulaProgressClean() {
    const progressFill = document.querySelector('.progress-fill-clean');
    const progressPercent = document.querySelector('.progress-percent-clean');
    
    if (!progressFill || !progressPercent) return;
    
    const task = currentGameState.currentTaskData;
    if (!task) return;
    
    // Считаем правильно заполненные поля
    let correctFields = 0;
    const allFields = Object.keys(task.variables).length + 1;
    
    // Проверяем известные переменные
    for (const [variable, info] of Object.entries(task.variables)) {
        const userValue = currentGameState.formulaValues[variable];
        if (userValue !== undefined && Math.abs(userValue - info.value) <= info.value * 0.01) {
            correctFields++;
            
            // Подсвечиваем правильное поле
            const input = document.querySelector(`.formula-input-clean[data-variable="${variable}"]`);
            if (input) {
                input.classList.remove('incorrect', 'empty');
                input.classList.add('correct');
            }
        } else if (userValue !== undefined) {
            // Неправильное значение
            const input = document.querySelector(`.formula-input-clean[data-variable="${variable}"]`);
            if (input) {
                input.classList.remove('correct');
                input.classList.add('incorrect');
            }
        }
    }
    
    // Проверяем целевую переменную (ответ)
    const targetValue = currentGameState.formulaValues[task.targetVariable];
    if (targetValue !== undefined && Math.abs(targetValue - task.answer) <= task.answer * 0.01) {
        correctFields++;
        
        const input = document.querySelector(`.formula-input-clean[data-variable="${task.targetVariable}"]`);
        if (input) {
            input.classList.remove('incorrect', 'empty');
            input.classList.add('correct');
        }
    } else if (targetValue !== undefined) {
        const input = document.querySelector(`.formula-input-clean[data-variable="${task.targetVariable}"]`);
        if (input) {
            input.classList.remove('correct');
            input.classList.add('incorrect');
        }
    }
    
    // Вычисляем прогресс
    const progress = Math.round((correctFields / allFields) * 100);
    currentGameState.formulaProgress = progress;
    
    // Обновляем UI
    progressFill.style.width = `${progress}%`;
    progressPercent.textContent = `${progress}%`;
    
    // Меняем цвет в зависимости от прогресса
    if (progress < 33) {
        progressFill.style.background = 'var(--danger-color)';
        progressPercent.style.color = 'var(--danger-color)';
    } else if (progress < 66) {
        progressFill.style.background = 'var(--warning-color)';
        progressPercent.style.color = 'var(--warning-color)';
    } else if (progress < 100) {
        progressFill.style.background = '#ffcc00';
        progressPercent.style.color = '#ffcc00';
    } else {
        progressFill.style.background = 'var(--success-color)';
        progressPercent.style.color = 'var(--success-color)';
    }
}



// Генерация задания для теории
// Генерация задания для теории с поддержкой множественного выбора
function generateQuizTask(task, container) {
    container.innerHTML = '';
    
    const isMultiple = task.multiple === true;
    const correctAnswers = Array.isArray(task.correct) ? task.correct : [task.correct];
    
    const quizDiv = document.createElement('div');
    quizDiv.className = 'quiz-task';
    
    let answersHTML = '';
    
    if (isMultiple) {
        answersHTML = `
            <div class="quiz-instruction">
                <i class="fas fa-info-circle"></i> Выберите ВСЕ правильные варианты (может быть несколько):
            </div>
            <div class="answers multiple-choice">
                ${task.answers.map((answer, index) => `
                    <div class="answer-option" data-index="${index}">
                        <span class="answer-checkbox">
                            <i class="far fa-square"></i>
                        </span>
                        <span class="answer-text">${answer}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        answersHTML = `
            <div class="answers single-choice">
                ${task.answers.map((answer, index) => `
                    <div class="answer-option" data-index="${index}">
                        <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                        <span class="answer-text">${answer}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    quizDiv.innerHTML = `
        <h3>Теоретический вопрос</h3>
        <div class="question">${task.question}</div>
        ${answersHTML}
    `;
    
    container.appendChild(quizDiv);
    
    // Сохраняем правильный ответ
    currentGameState.correctAnswer = task.correct;
    currentGameState.isMultipleChoice = isMultiple;
    currentGameState.selectedAnswers = [];
    
    // Добавляем обработчики для вариантов ответа
    setTimeout(() => {
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                
                if (isMultiple) {
                    // Множественный выбор - переключаем чекбокс
                    const isSelected = this.classList.contains('selected');
                    
                    if (isSelected) {
                        this.classList.remove('selected');
                        const checkbox = this.querySelector('.fa-square');
                        if (checkbox) {
                            checkbox.className = 'far fa-square';
                        }
                        
                        // Удаляем из выбранных
                        const idx = currentGameState.selectedAnswers.indexOf(index);
                        if (idx > -1) {
                            currentGameState.selectedAnswers.splice(idx, 1);
                        }
                    } else {
                        this.classList.add('selected');
                        const checkbox = this.querySelector('.fa-square');
                        if (checkbox) {
                            checkbox.className = 'fas fa-check-square';
                        }
                        
                        // Добавляем в выбранные
                        if (!currentGameState.selectedAnswers.includes(index)) {
                            currentGameState.selectedAnswers.push(index);
                        }
                    }
                } else {
                    // Одиночный выбор - снимаем выделение с других
                    document.querySelectorAll('.answer-option').forEach(opt => {
                        opt.classList.remove('selected');
                        const letter = opt.querySelector('.answer-letter');
                        if (letter) {
                            letter.style.background = 'rgba(0, 210, 255, 0.2)';
                        }
                    });
                    
                    this.classList.add('selected');
                    const letter = this.querySelector('.answer-letter');
                    if (letter) {
                        letter.style.background = 'var(--accent-color)';
                        letter.style.color = 'white';
                    }
                    
                    currentGameState.selectedAnswer = index;
                }
            });
        });
    }, 100);
}

// Обновление UI уровня
function updateLevelUI(levelConfig) {
    // Убрали обновление levelTitle в хедере
    document.getElementById('currentLevelDisplay').textContent = levelConfig.id;
    
    // Обновляем счетчик заданий
    document.getElementById('tasksCompleted').textContent = currentGameState.tasksCompleted || 0;
}

// Обновление прогресс-бара
function updateProgress() {
    const levelConfig = LEVELS_CONFIG.find(l => l.id === currentGameState.currentLevel);
    if (!levelConfig) return;
    
    const progress = (currentGameState.currentTask / levelConfig.tasks.length) * 100;
    const progressBar = document.getElementById('levelProgress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Обновление отображения попыток
function updateAttemptsDisplay() {
    const attemptsElement = document.getElementById('attempts');
    if (attemptsElement) {
        attemptsElement.textContent = currentGameState.currentAttempts;
    }
}

// Обновление вкладок уровней
function updateLevelTabs() {
    document.querySelectorAll('.level-tab').forEach(tab => {
        const level = parseInt(tab.dataset.level);
        if (level === currentGameState.currentLevel) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Обновляем бургер-меню
    document.querySelectorAll('.burger-level').forEach(item => {
        const level = parseInt(item.dataset.level);
        if (level === currentGameState.currentLevel) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Завершение уровня
function completeLevel() {
    // Добавляем бонусные очки за полное прохождение уровня
    const levelConfig = LEVELS_CONFIG.find(l => l.id === currentGameState.currentLevel);
    if (levelConfig) {
        const bonusScore = Math.floor(levelConfig.baseScore * levelConfig.tasks.length * 0.3); // 30% бонус
        currentGameState.score += bonusScore;
        
        if (typeof showMessage === 'function') {
            showMessage(`Уровень ${currentGameState.currentLevel} пройден! Бонус: +${bonusScore} очков`, 'success');
        }
        if (typeof updateScore === 'function') {
            updateScore();
        }
    }
    
    // Если это последний уровень, предлагаем завершить игру
    if (currentGameState.currentLevel >= LEVELS_CONFIG.length) {
        setTimeout(() => {
            if (typeof finishGame === 'function') {
                finishGame();
            }
        }, 2000);
    } else {
        // Предлагаем перейти на следующий уровень
        setTimeout(() => {
            if (confirm(`Уровень ${currentGameState.currentLevel} пройден! Перейти на уровень ${currentGameState.currentLevel + 1}?`)) {
                initLevel(currentGameState.currentLevel + 1);
            }
        }, 1500);
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
        'relay': 'Реле',
        'bulb': 'Лампочка',
        'ammeter': 'Амперметр'
    };
    return names[elementId] || elementId;
}
// Глобальный запрет перетаскивания картинок
document.addEventListener('dragstart', function(event) {
    // Если перетаскивается картинка (не элемент схемы)
    if (event.target.tagName === 'IMG' && 
        !event.target.closest('.circuit-element-draggable') &&
        !event.target.closest('.placed-element')) {
        event.preventDefault();
        return false;
    }
});

// Также для touch событий
document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'IMG' && 
        !event.target.closest('.circuit-element-draggable') &&
        !event.target.closest('.placed-element')) {
        event.preventDefault();
        return false;
    }
}, { passive: false });
function getElementIcon(elementId) {
    const icons = {
        'battery': '🔋',
        'resistor': '⏚',
        'lamp': '💡',
        'switch': '🔘',
        'led': '🔴',
        'relay': '🔄',
        'bulb': '💡',
        'ammeter': '📊'
    };
    return icons[elementId] || '⚡';
}

// Экспорт функций
window.initLevel = initLevel;
window.loadNextTask = loadNextTask;
window.currentGameState = currentGameState;
window.LEVELS_CONFIG = LEVELS_CONFIG;
window.updateAttemptsDisplay = updateAttemptsDisplay;

