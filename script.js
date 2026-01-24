const state = {
    profile: null,
    lang: 'pt',
    devMode: 'dark',
    data: null,
    // Armazena dados reais do GitHub para não perder na troca de idioma
    githubStats: {
        repos: null,
        commits: null,
        years: null
    }
};

const iconMap = {
    "NestJS": "devicon-nestjs-plain", "Spring": "devicon-spring-plain",
    "Go": "devicon-go-original-wordmark", "Java": "devicon-java-plain",
    "Python": "devicon-python-plain", "Csharp": "devicon-csharp-plain",
    "React": "devicon-react-original", "Next.js": "devicon-nextjs-plain",
    "TypeScript": "devicon-typescript-plain", "Docker": "devicon-docker-plain",
    "PostgreSQL": "devicon-postgresql-plain", "AWS": "devicon-amazonwebservices-plain-wordmark",
    "Unity": "devicon-unity-original", "Unreal": "devicon-unrealengine-original",
    "Blender": "devicon-blender-original", "Maya": "devicon-maya-plain",
    "Threejs": "devicon-threejs-original", "Photoshop": "devicon-photoshop-plain"
};

document.addEventListener('DOMContentLoaded', () => {
    
    checkUrlParams();

    const profileButtons = document.querySelectorAll('[data-profile]');
    profileButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const profileId = btn.getAttribute('data-profile');
            initProfile(profileId);
        });
    });

    const langBtn = document.getElementById('lang-toggle');
    if(langBtn) {
        langBtn.addEventListener('click', () => {
            state.lang = state.lang === 'pt' ? 'en' : 'pt';
            if(state.data) renderAll();
        });
    }

    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            state.devMode = state.devMode === 'dark' ? 'light' : 'dark';
            handleDevThemeLogic();
        });
    }

    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    if(mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
});

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileParam = urlParams.get('profile');

    if (profileParam && ['dev', 'game', 'art3d'].includes(profileParam)) {
        initProfile(profileParam);
    }
}

async function initProfile(profileId) {
    try {
        const response = await fetch('themes.json');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        state.data = await response.json();
        state.profile = profileId;
        state.devMode = 'dark';

        // Tenta buscar dados do GitHub apenas uma vez na inicialização
        if(!state.githubStats.commits) {
            fetchGitHubRepos('LucasXIIISousa');
            fetchGitHubCommits('LucasXIIISousa');
        }

        renderAll();

        const overlay = document.getElementById('intro-overlay');
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.classList.add('hidden');
            document.getElementById('main-layout').classList.remove('hidden');
            
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        }, 500);

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar 'themes.json'.");
    }
}

function renderAll() {
    if (!state.data) return;

    const profileData = state.data.profiles[state.profile];
    const uiData = state.data.ui[state.lang];
    const contentData = profileData[state.lang];

    document.documentElement.style.setProperty('--primary', profileData.themeColor);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (uiData[key]) el.textContent = uiData[key];
    });

    document.getElementById('lang-toggle').textContent = uiData.lang_btn;

    document.getElementById('brand-text').textContent = contentData.brandName;
    document.getElementById('hero-role').textContent = contentData.role;
    document.getElementById('hero-title').textContent = contentData.heroTitle;
    document.getElementById('hero-subtitle').textContent = contentData.heroSubtitle;

    // --- RENDERIZAÇÃO DE STATS ---
    // Clientes (Fixo do JSON)
    document.getElementById('stat-clients').textContent = profileData.stats.clients;
    
    // Anos (Prioriza API, senão usa fallback do JSON)
    document.getElementById('stat-years').textContent = state.githubStats.years || profileData.stats.xp_years;
    
    // Repos (Prioriza API, sem fallback no JSON atual, usa '--')
    if(state.githubStats.repos) {
        document.getElementById('stat-repos').textContent = state.githubStats.repos;
    }

    // Commits (Prioriza API, senão usa fallback do JSON)
    document.getElementById('stat-commits').textContent = state.githubStats.commits || profileData.stats.commits_fallback;


    const stackContainer = document.getElementById('stack-container');
    stackContainer.innerHTML = '';
    profileData.stats.mainStack.forEach(tech => {
        const iconClass = iconMap[tech] || "fas fa-code";
        const badge = document.createElement('div');
        badge.className = 'tech-badge';
        badge.innerHTML = `<i class="${iconClass}" style="color: ${profileData.themeColor}"></i> <span>${tech}</span>`;
        stackContainer.appendChild(badge);
    });

    const eduContainer = document.getElementById('education-container');
    eduContainer.innerHTML = '';
    if(contentData.education) {
        contentData.education.forEach(edu => {
            eduContainer.innerHTML += `
                <div class="edu-card">
                    <h4>${edu.school}</h4>
                    <span>${edu.course}</span>
                    <p>${edu.date}</p>
                </div>`;
        });
    }

    const resumeContainer = document.getElementById('resume-container');
    resumeContainer.innerHTML = '';
    contentData.resume.forEach(job => {
        const card = document.createElement('div');
        card.className = 'resume-card';
        card.innerHTML = `
            <h4>${job.role}</h4>
            <span style="color: ${profileData.themeColor}">${job.company} | ${job.date}</span>
            <p>${job.desc}</p>
        `;
        resumeContainer.appendChild(card);
    });

    const langContainer = document.getElementById('languages-container');
    langContainer.innerHTML = '';
    if(contentData.languages) {
        contentData.languages.forEach(lang => {
            langContainer.innerHTML += `<div class="lang-card">${lang}</div>`;
        });
    }

    renderProjects(contentData.projects, profileData.themeColor);
    handleDevThemeLogic();
}

function renderProjects(projects, color) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    if(!projects) return;

    projects.forEach(proj => {
        let imagesHtml = '';
        if(proj.images) {
            proj.images.forEach(img => {
                imagesHtml += `
                    <div class="project-img-slot">
                        ${img.includes('/') ? `<img src="${img}" alt="Project">` : '<i class="fas fa-image"></i>'}
                    </div>`;
            });
        }

        let stackHtml = '';
        if(proj.stack) {
            proj.stack.forEach(tech => {
                const iconClass = iconMap[tech] || "fas fa-code";
                stackHtml += `
                    <div class="tech-badge">
                        <i class="${iconClass}" style="color: ${color}"></i> <span>${tech}</span>
                    </div>`;
            });
        }

        container.innerHTML += `
            <div class="project-block">
                <div class="project-header">
                    <h3>${proj.title}</h3>
                    <p>${proj.desc}</p>
                </div>
                <div class="project-gallery">
                    ${imagesHtml}
                </div>
                <div class="project-stack">
                    ${stackHtml}
                </div>
            </div>`;
    });
}

function handleDevThemeLogic() {
    const themeBtn = document.getElementById('theme-toggle');
    const iframe = document.getElementById('anim-frame');
    const body = document.body;

    if (state.profile !== 'dev') {
        themeBtn.classList.add('hidden');
        body.classList.remove('light-mode');
        
        iframe.classList.remove('hidden');
        
        if(state.profile === 'game') {
             if(!iframe.src.includes("animations/Star.html")) iframe.src = "animations/Star.html";
        }
        if(state.profile === 'art3d') {
            if(!iframe.src.includes("animations/wing.html")) iframe.src = "animations/wing.html";
       }
       return;
    }

    themeBtn.classList.remove('hidden');
    
    if (state.devMode === 'light') {
        body.classList.add('light-mode');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        
        iframe.classList.remove('hidden');
        if(!iframe.src.includes("animations/wing.html")) iframe.src = "animations/wing.html";

    } else {
        body.classList.remove('light-mode');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        
        iframe.classList.remove('hidden');
        if(!iframe.src.includes("animations/Star.html")) iframe.src = "animations/Star.html";
    }
}

async function fetchGitHubRepos(username) {
    const reposEl = document.getElementById('stat-repos');
    try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if(res.ok) {
            const data = await res.json();
            
            if (data.public_repos) {
                const val = data.public_repos + "+";
                state.githubStats.repos = val; // SALVA NO ESTADO
                reposEl.textContent = val;
                
                // Calcula anos
                const created = new Date(data.created_at);
                const now = new Date();
                const diffYears = (Math.abs(now - created) / (1000 * 60 * 60 * 24 * 365)).toFixed(1) + "+";
                state.githubStats.years = diffYears; // SALVA NO ESTADO
                document.getElementById('stat-years').textContent = diffYears;
            }
        }
    } catch (e) {
        console.log("GitHub API (Repos) Falhou:", e);
    }
}

async function fetchGitHubCommits(username) {
    const commitsEl = document.getElementById('stat-commits');
    
    try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        
        if(res.ok) {
            const data = await res.json();
            
            let totalCommits = 0;

            const years = Object.keys(data.total);
            years.forEach(year => {
                totalCommits += data.total[year];
            });

            if (totalCommits > 0) {
                let displayVal = totalCommits;
                if(totalCommits > 1000) {
                     displayVal = (totalCommits / 1000).toFixed(1) + "k+";
                }
                
                state.githubStats.commits = displayVal; 
                commitsEl.textContent = displayVal;
            }
        }
    } catch (e) {
        console.log("API de Commits falhou.", e);
    }
}