// ─── 1. HAMBURGER MENU ────────────────────────────────────────────────────────
// querySelector находит первый элемент с данным классом в DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navigation-menu');

// addEventListener слушает события. 'click' — клик мышью или тач
hamburger.addEventListener('click', () => {
  // classList.toggle добавляет класс если его нет, удаляет если есть
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');

  // aria-expanded — атрибут доступности (accessibility):
  // говорит скринридерам открыто ли меню
  const isOpen = hamburger.classList.contains('active');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Закрываем меню когда пользователь нажал на ссылку (UX для мобильных)
document.querySelectorAll('.navigation').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ─── 2. ACCORDION (сворачиваемые секции) ──────────────────────────────────────
// Находим все заголовки аккордиона
document.querySelectorAll('.accordion-header').forEach((header) => {
  header.addEventListener('click', () => {
    // closest() ищет ближайшего родителя с данным классом
    const section = header.closest('.accordion-section');
    const isOpen = section.classList.contains('open');

    // Закрываем все открытые секции (только одна открыта за раз)
    document.querySelectorAll('.accordion-section').forEach((s) => {
      s.classList.remove('open');
      s.querySelector('.accordion-header button').setAttribute('aria-expanded', 'false');
    });

    // Открываем кликнутую (если она была закрыта)
    if (!isOpen) {
      section.classList.add('open');
      header.querySelector('button').setAttribute('aria-expanded', 'true');
    }
  });
});

// ─── 3. АНИМАЦИИ ПРИ СКРОЛЛЕ (IntersectionObserver) ─────────────────────────
// IntersectionObserver — современный API для определения видимости элементов.
// Он намного эффективнее чем scroll event + getBoundingClientRect()!
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // isIntersecting = true когда элемент входит в область видимости
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // unobserve — перестаём следить после первой анимации (оптимизация)
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12, // 12% элемента должно быть видно для срабатывания
    rootMargin: '0px 0px -40px 0px', // сдвигаем триггер на 40px вверх
  }
);

// Добавляем наблюдение за всеми элементами с классом fade-in
document.querySelectorAll('.fade-in').forEach((el) => fadeObserver.observe(el));

// ─── 4. АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ ПРИ СКРОЛЛЕ ──────────────────────────────
// Ещё один IntersectionObserver — следим за разделами страницы
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('a.navigation');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Убираем active со всех ссылок
        navLinks.forEach((link) => link.classList.remove('active'));

        // Находим ссылку которая ссылается на текущий раздел
        const activeLink = document.querySelector(
          `.navigation[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  { threshold: 0.4 } // 40% раздела должно быть видно
);

sections.forEach((section) => navObserver.observe(section));

// ─── 5. ВАЛИДАЦИЯ ФОРМЫ ───────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const msgInput = document.getElementById('msg');

    // Убираем пробелы по краям и проверяем минимальную длину
    if (nameInput.value.trim().length < 2) {
      e.preventDefault(); // останавливаем отправку формы
      nameInput.focus();
      showError(nameInput, 'Имя должно быть не менее 2 символов');
      return;
    }

    if (msgInput.value.trim().length < 10) {
      e.preventDefault();
      msgInput.focus();
      showError(msgInput, 'Сообщение слишком короткое (минимум 10 символов)');
    }
  });

  // Убираем стиль ошибки когда пользователь начинает печатать
  ['name', 'email', 'msg'].forEach((id) => {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('input-error');
    });
  });
}

// Вспомогательная функция для показа ошибки
function showError(input, message) {
  input.classList.add('input-error');

  // Ищем или создаём элемент для сообщения об ошибке
  let errorEl = input.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('error-msg')) {
    errorEl = document.createElement('span');
    errorEl.classList.add('error-msg');
    input.parentNode.insertBefore(errorEl, input.nextSibling);
  }
  errorEl.textContent = message;

  // Удаляем сообщение через 3 секунды
  setTimeout(() => errorEl.remove(), 3000);
}
