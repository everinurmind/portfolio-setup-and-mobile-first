// ─── СВЕЧЕНИЕ КУРСОРА ───
// Плавно перемещаем светящийся круг за курсором мыши
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
});

// Скрываем свечение когда мышь уходит за пределы окна
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// ─── ГАМБУРГЕР-МЕНЮ ───
// Переключаем мобильное меню по клику
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Блокируем прокрутку при открытом меню
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Закрываем меню при клике на ссылку
navMenu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ─── ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ───
// Рекурсивно печатает и стирает слова из массива
const typewriterEl = document.getElementById('typewriter');
const roles = ['Data Analyst', 'Python Developer', 'ML Engineer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typewrite() {
    const currentWord = roles[roleIndex];

    if (isDeleting) {
        // Стираем по одному символу
        charIndex--;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
    } else {
        // Печатаем по одному символу
        charIndex++;
        typewriterEl.textContent = currentWord.substring(0, charIndex);
    }

    // Определяем задержку в зависимости от направления
    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        // Слово напечатано — пауза перед стиранием
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Слово стёрто — переходим к следующему
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 500;
    }

    // Рекурсивный вызов через setTimeout
    setTimeout(typewrite, delay);
}

// Запускаем печатную машинку
typewrite();

// ─── СЧЁТЧИКИ СТАТИСТИКИ ───
// Анимируем числа от 0 до целевого значения через requestAnimationFrame
function animateCounters() {
    const counters = document.querySelectorAll('.stats__number');

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000; // Длительность анимации в мс
        let startTime = null;

        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Функция замедления — ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Запускаем счётчики когда секция попадает в видимую область
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounters();
                // Отключаем наблюдатель после первого срабатывания
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ─── МОДАЛЬНЫЕ ОКНА ───
// Открытие модалки по клику на карточку проекта
const projectCards = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');

projectCards.forEach((card) => {
    card.addEventListener('click', () => {
        const modalId = card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Закрытие модалки — по кнопке крестика
modals.forEach((modal) => {
    const closeBtn = modal.querySelector('.modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Закрытие по клику на затемнённый фон
    if (backdrop) {
        backdrop.addEventListener('click', () => closeModal(modal));
    }
});

// Закрытие модалки по нажатию Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach((modal) => {
            if (modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    }
});

// Функция закрытия модального окна
function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ─── ПРОГРЕСС-БАРЫ НАВЫКОВ ───
// Анимируем ширину полосок при попадании секции в видимую область
const skillBars = document.querySelectorAll('.skill__bar');
const skillsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Устанавливаем ширину из data-атрибута
                const bars = entry.target.querySelectorAll('.skill__bar');
                bars.forEach((bar) => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                });
                // Отключаем наблюдатель после срабатывания
                skillsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

// Наблюдаем за секцией навыков
const skillsGrid = document.querySelector('.skills__grid');
if (skillsGrid) {
    skillsObserver.observe(skillsGrid);
}

// ─── ТАБЫ КОДА ───
// Переключаем между JavaScript и Python
const codeTabs = document.querySelectorAll('.code-tab');
const codePanels = {
    js: document.getElementById('code-js'),
    python: document.getElementById('code-python'),
};

codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const lang = tab.getAttribute('data-lang');

        // Обновляем активный таб
        codeTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Показываем нужную панель
        Object.values(codePanels).forEach((panel) => {
            if (panel) panel.classList.add('hidden');
        });
        if (codePanels[lang]) codePanels[lang].classList.remove('hidden');

        // Скрываем вывод при переключении
        const output = document.getElementById('codeOutput');
        if (output) output.classList.add('hidden');
    });
});

// ─── КОПИРОВАНИЕ КОДА ───
// Копируем видимый код в буфер обмена через Clipboard API
const copyBtn = document.getElementById('copyBtn');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        // Находим видимую панель кода
        const visiblePanel = document.querySelector('.code-panel:not(.hidden) code');
        if (visiblePanel) {
            navigator.clipboard.writeText(visiblePanel.textContent).then(() => {
                // Показываем подтверждение копирования
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        }
    });
}

// ─── ЗАПУСК КОДА (ИМИТАЦИЯ) ───
// Показываем заготовленный результат выполнения
const runBtn = document.getElementById('runBtn');
const codeOutput = document.getElementById('codeOutput');
const codeOutputText = document.getElementById('codeOutputText');

// Заготовленные результаты для каждого языка
const mockOutputs = {
    js: 'Mean: 38.00\nMax: 89, Min: 7',
    python: 'Mean: 38.00\nMax: 89, Min: 7',
};

if (runBtn) {
    runBtn.addEventListener('click', () => {
        // Определяем активный язык
        const activeTab = document.querySelector('.code-tab.active');
        const lang = activeTab ? activeTab.getAttribute('data-lang') : 'js';

        // Показываем вывод
        if (codeOutput && codeOutputText) {
            codeOutput.classList.remove('hidden');
            codeOutputText.textContent = '';

            // Имитация построчного вывода
            const lines = mockOutputs[lang].split('\n');
            let lineIndex = 0;

            function printLine() {
                if (lineIndex < lines.length) {
                    codeOutputText.textContent +=
                        (lineIndex > 0 ? '\n' : '') + lines[lineIndex];
                    lineIndex++;
                    setTimeout(printLine, 300);
                }
            }

            printLine();
        }
    });
}

// ─── ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ───
// Добавляем класс visible при попадании элемента в видимую область
const fadeElements = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Отключаем наблюдение после появления
                fadeObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

// ─── СКРОЛЛ-ШПИОН ───
// Подсвечиваем ссылку навигации для текущей видимой секции
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[data-section]');

const scrollSpyObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Убираем активный класс со всех ссылок
                navLinks.forEach((link) => link.classList.remove('active'));
                // Добавляем активный класс нужной ссылке
                const activeLink = document.querySelector(
                    `.nav__link[data-section="${id}"]`
                );
                if (activeLink) activeLink.classList.add('active');
            }
        });
    },
    {
        rootMargin: '-50% 0px -50% 0px',
    }
);

sections.forEach((section) => scrollSpyObserver.observe(section));

// ─── ВАЛИДАЦИЯ ФОРМЫ ───
// Проверяем поля формы перед отправкой
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        let isValid = true;

        // Проверяем имя — минимум 2 символа
        if (name.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        } else {
            nameError.textContent = '';
        }

        // Проверяем email — формат адреса
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Проверяем сообщение — минимум 10 символов
        if (message.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            isValid = false;
        } else {
            messageError.textContent = '';
        }

        // Если всё валидно — имитируем отправку
        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Sent!';
            submitBtn.disabled = true;

            // Сбрасываем форму через 3 секунды
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}
