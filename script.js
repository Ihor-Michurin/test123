document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Учитываем высоту фиксированного навбара
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Закрыть мобильное меню, если оно открыто и используется
                // closeMobileMenu();
            }
        });
    });

    // Кнопка "Наверх"
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.onscroll = function() {
        scrollFunction();
        handleNavScroll(); // Для скрытия/показа навбара
        handleNavActiveState(); // Для подсветки активного пункта меню
    };

    function scrollFunction() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollTopBtn.style.display = 'block';
            setTimeout(() => scrollTopBtn.style.opacity = '1', 10); // Для плавного появления
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => scrollTopBtn.style.display = 'none', 300); // Скрыть после затухания
        }
    }

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Анимация при скролле (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Раскомментировать, если анимация нужна только один раз
            } else {
                 // entry.target.classList.remove('is-visible'); // Раскомментировать, если анимация должна повторяться при выходе из видимости
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // Элемент считается видимым при появлении на 10%
    });

    animatedElements.forEach(el => observer.observe(el));


    // Управление навигацией при скролле (появление/скрытие)
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    function handleNavScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight * 2) {
            // Scroll Down
            navbar.classList.add('nav-hidden');
        } else {
            // Scroll Up
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

        if (scrollTop > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    }

    // Подсветка активного пункта меню при скролле
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbar ul li a');

    function handleNavActiveState() {
        let currentSection = '';
        const navbarHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50; // Добавляем небольшой отступ
            if (window.pageYOffset >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Если мы в самом верху, активным должен быть #hero (или первый пункт)
        if (window.pageYOffset < (document.getElementById('about')?.offsetTop || window.innerHeight) - navbarHeight - 50 ) {
             currentSection = 'hero';
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    }
    handleNavActiveState(); // Вызвать при загрузке

    // Кастомный курсор
    const cursorDot = document.querySelector("[data-cursor-dot]");
    const cursorOutline = document.querySelector("[data-cursor-outline]");

    if (cursorDot && cursorOutline) { // Проверка, что элементы существуют
        // Проверка на тач-устройство, чтобы не показывать кастомный курсор
        const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        if (!isTouchDevice()) {
            window.addEventListener("mousemove", function (e) {
                const posX = e.clientX;
                const posY = e.clientY;

                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;

                // cursorOutline.style.left = `${posX}px`;
                // cursorOutline.style.top = `${posY}px`;
                // Плавное следование для outline
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 300, fill: "forwards" });
            });

            document.querySelectorAll('a, button, .skill-card, .interactive-hobby, .nav-logo, .theme-toggle-button').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.borderColor = 'var(--accent-color)'; // Можно менять цвет обводки при наведении
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.borderColor = 'var(--accent-color)'; // Возвращаем стандартный цвет
                });
            });
        } else {
            // Скрываем кастомный курсор на тач-устройствах
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
        }
    }


    // Переключение темы
    const themeToggleButton = document.querySelector('.theme-toggle-button');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'light') {
            themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } else { // Если тема не сохранена, ставим темную по умолчанию
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    }


    themeToggleButton.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Эффект "пишущей машинки" для тэга (опционально, если хотите)
    // const tagline = document.querySelector('.tagline');
    // if (tagline) {
    //     const text = tagline.textContent;
    //     tagline.textContent = '';
    //     let i = 0;
    //     function typeWriter() {
    //         if (i < text.length) {
    //             tagline.textContent += text.charAt(i);
    //             i++;
    //             setTimeout(typeWriter, 70); // Скорость печати
    //         }
    //     }
    //     // Начать анимацию после небольшой задержки, чтобы страница прогрузилась
    //     setTimeout(typeWriter, 1000);
    // }

});