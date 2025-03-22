document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleLang");

    toggleButton.addEventListener("click", function () {
        const isEnglish = toggleButton.textContent === "Switch to English";

        toggleButton.textContent = isEnglish ? "Mudar para Português" : "Switch to English";

        document.getElementById("name").textContent = isEnglish ? "Lucas Sousa" : "Lucas Sousa";
        document.getElementById("occupation").textContent = isEnglish ? "Developer and Systems Analyst" : "Desenvolvedor e Analista de Sistemas";
        document.getElementById("sobreTitle").textContent = isEnglish ? "About Me" : "Sobre Mim";
        document.getElementById("sobreContent").textContent = isEnglish
            ? "Developer and systems analyst with experience in software development..."
            : "Desenvolvedor e analista de sistemas com experiência em desenvolvimento de software...";
        document.getElementById("city").innerHTML = isEnglish ? "<strong>City:</strong> Franca - SP" : "<strong>Cidade:</strong> Franca - SP";
        document.getElementById("formacaoTitle").textContent = isEnglish ? "Education" : "Formação";
        document.getElementById("formacaoItem1").innerHTML = isEnglish
            ? "<strong>Senac, Franca — Technical (2017-2018)</strong>: Technical course in IT."
            : "<strong>Senac, Franca — Técnico (2017-2018)</strong>: Curso técnico de TI.";
        document.getElementById("formacaoItem2").innerHTML = isEnglish
            ? "<strong>FATEC — Technologist (2022-2025)</strong>: Studying Systems Analysis and Development."
            : "<strong>FATEC — Tecnólogo (2022-2025)</strong>: Cursando Análise e Desenvolvimento de Sistemas.";
        document.getElementById("formacaoItem3").innerHTML = isEnglish
            ? "<strong>Udemy — JAVA Course (2023-2024)</strong>: Learning Java from basic to advanced."
            : "<strong>Udemy — Curso JAVA (2023-2024)</strong>: Aprendizado de Java do básico ao avançado.";
    });

    const nameElement = document.querySelector(".name");
    const fullName = "Lucas Sousa";  
    let index = 0;

    // Cria o cursor piscante
    const cursor = document.createElement("span");
    cursor.classList.add("cursor");
    cursor.textContent = "|";
    nameElement.appendChild(cursor); 

    function typeEffect() {
        if (index < fullName.length) {
            nameElement.firstChild.textContent = fullName.slice(0, index + 1);
            index++;
            setTimeout(typeEffect, 400);
        } else {
            cursor.style.display = "none";
        }
    }

    document.querySelector(".profile-image").addEventListener("mouseenter", function() {
        nameElement.firstChild.textContent = "";
        index = 0;
        cursor.style.display = "inline-block"; 
        setTimeout(typeEffect, 500);
    });

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.fade-section');
        const scrollPos = window.innerHeight + window.scrollY;

        sections.forEach(section => {
            const sectionPos = section.offsetTop;
            if (scrollPos > sectionPos + 100) {
                section.classList.add('fade-in');
            }
        });
    });
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function scrollTimeline() {
    const timelines = document.querySelectorAll('.timeline');
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    timelines.forEach((timeline) => {
        const line = timeline.querySelector('.line');
        const timelineOffset = timeline.offsetTop;

        if (scrollTop + windowHeight >= timelineOffset) {
            const newHeight = Math.min(200, (scrollTop + windowHeight - timelineOffset) / 2); 
            line.style.height = newHeight + 'px';
        }
    });
}

// Evento de scroll
window.addEventListener('scroll', scrollTimeline);

document.addEventListener('DOMContentLoaded', scrollTimeline);

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Função para ativar a animação de entrada lateral das seções
function animateSections() {
    const sections = document.querySelectorAll('.section-content');
    
    sections.forEach(section => {
        if (isElementInViewport(section)) {
            section.classList.add('active');
        }
    });
}

window.addEventListener('scroll', animateSections);

document.addEventListener('DOMContentLoaded', animateSections);

// Função para verificar se o elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight && rect.bottom >= 0
    );
}

// Função para ativar/desativar a animação das seções com base no scroll
function toggleSectionVisibility() {
    const sections = document.querySelectorAll('.section-content');
    
    sections.forEach(section => {
        if (isElementInViewport(section)) {
            section.classList.add('active');  
        } else {
            section.classList.remove('active');  
        }
    });
}

window.addEventListener('scroll', toggleSectionVisibility);

document.addEventListener('DOMContentLoaded', toggleSectionVisibility);

document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.timeline-container');
    setTimeout(() => {
        timelineContainer.classList.add('visible');
    }, 500);
});


document.addEventListener("scroll", function () {
    const sections = document.querySelectorAll(".section-content");
    const timelines = document.querySelectorAll(".timeline");
    const years = document.querySelectorAll(".year");
    const windowHeight = window.innerHeight;

    // Animação para as seções
    sections.forEach(function (section) {
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < windowHeight - 100) {
            section.classList.add("active");
        } else {
            section.classList.remove("active");
        }
    });

    // Animação para a timeline
    timelines.forEach(function (timeline) {
        const timelineTop = timeline.getBoundingClientRect().top;

        if (timelineTop < windowHeight - 100) {
            timeline.classList.add("active");
        } else {
            timeline.classList.remove("active");
        }
    });

    // Animação para o ano da timeline
    years.forEach(function (year) {
        const yearTop = year.getBoundingClientRect().top;

        if (yearTop < windowHeight - 100) {
            year.classList.add("active");
        } else {
            year.classList.remove("active");
        }
    });
});


document.addEventListener("scroll", function () {
    const projects = document.querySelectorAll(".projeto");
    const windowHeight = window.innerHeight;
    const container = document.querySelector('.projects-container');
    const containerTop = container.getBoundingClientRect().top;
    const containerBottom = container.getBoundingClientRect().bottom;

    // Verifica se o container está visível
    if (containerTop < windowHeight - 100 && containerBottom > 100) {
        projects.forEach(function (project) {
            project.classList.add("active");
        });
    } else {
        projects.forEach(function (project) {
            project.classList.remove("active");
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const iconContainer = document.querySelector('.icon-container');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          iconContainer.classList.add('visible');
        } else {
          iconContainer.classList.remove('visible'); 
        }
      });
    });
  
    observer.observe(iconContainer);
  });
  
