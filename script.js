const state = {
    profile: null,
    lang: 'pt',
    devMode: 'dark',
    data: null,
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
            window.history.pushState({}, '', `?profile=${profileId}`);
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
            handleVisuals(); // Atualiza apenas o visual
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
        
        // Reseta para o modo dark ao trocar de perfil, se quiser
        state.devMode = 'dark';

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

    // Define a cor primária (CSS Variable)
    document.documentElement.style.setProperty('--primary', profileData.themeColor);
    
    // Textos da UI
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (uiData[key]) el.textContent = uiData[key];
    });

    document.getElementById('lang-toggle').textContent = uiData.lang_btn;

    // Conteúdo do Hero
    document.getElementById('brand-text').textContent = contentData.brandName;
    document.getElementById('hero-role').textContent = contentData.role;
    document.getElementById('hero-title').textContent = contentData.heroTitle;
    document.getElementById('hero-subtitle').textContent = contentData.heroSubtitle;

    // Métricas
    document.getElementById('stat-clients').textContent = profileData.stats.clients;
    document.getElementById('stat-years').textContent = profileData.stats.xp_years;
    
    if(state.githubStats.repos) {
        document.getElementById('stat-repos').textContent = state.githubStats.repos;
    }
    document.getElementById('stat-commits').textContent = state.githubStats.commits || profileData.stats.commits_fallback;

    // Stack
    const stackContainer = document.getElementById('stack-container');
    stackContainer.innerHTML = '';
    profileData.stats.mainStack.forEach(tech => {
        const iconClass = iconMap[tech] || "fas fa-code";
        const badge = document.createElement('div');
        badge.className = 'tech-badge';
        badge.innerHTML = `<i class="${iconClass}" style="color: ${profileData.themeColor}"></i> <span>${tech}</span>`;
        stackContainer.appendChild(badge);
    });

    // Educação
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

    // Carreira
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

    // Projetos
    renderProjects(contentData.projects, profileData.themeColor);
    
    // Atualiza os Visuais (Iframe e Temas)
    handleVisuals();
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
                <div class="project-gallery">${imagesHtml}</div>
                <div class="project-stack">${stackHtml}</div>
            </div>`;
    });
}

// --- LÓGICA DE VISUAIS (IFRAME DE SIDEBAR vs BACKGROUND) ---
function handleVisuals() {
    const themeBtn = document.getElementById('theme-toggle');
    const sidebarFrame = document.getElementById('anim-frame'); // Iframe pequeno
    const sidebarVisualDiv = document.getElementById('sidebar-visual'); // Div pai do iframe pequeno
    const bgFrame = document.getElementById('game-bg-frame'); // Iframe gigante
    const body = document.body;

    // Função auxiliar para carregar src sem piscar
    const loadAnim = (iframe, file) => {
        const path = `animations/${file}`;
        if (!iframe.src.includes(path)) {
            iframe.src = path;
        }
    };

    // 1. Perfil GAME: Fundo Total (Elden Ring)
    if (state.profile === 'game') {
        themeBtn.classList.add('hidden'); 
        body.classList.remove('light-mode');
        body.classList.add('game-mode-active'); // Classe CSS para deixar fundo transparente

        // Esconde visual da sidebar
        sidebarVisualDiv.classList.add('hidden');
        
        // Mostra e Carrega background full screen
        bgFrame.classList.remove('hidden');
        loadAnim(bgFrame, 'EldenRing.html');
        return;
    }

    // Se não for game, remove modo game
    body.classList.remove('game-mode-active');
    bgFrame.classList.add('hidden'); // Esconde BG gigante
    bgFrame.src = ""; // Limpa src para economizar recurso

    // Mostra visual da sidebar
    sidebarVisualDiv.classList.remove('hidden');

    // 2. Perfil DEV: Sidebar (Star/Wing)
    if (state.profile === 'dev') {
        themeBtn.classList.remove('hidden'); 
        
        if (state.devMode === 'light') {
            body.classList.add('light-mode');
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            loadAnim(sidebarFrame, 'wing.html');
        } else {
            body.classList.remove('light-mode');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            loadAnim(sidebarFrame, 'Star.html');
        }
        return;
    }

    // 3. Perfil ART3D: Sidebar (Wing/Outro)
    if (state.profile === 'art3d') {
        themeBtn.classList.add('hidden');
        body.classList.remove('light-mode');
        loadAnim(sidebarFrame, 'wing.html');
        return;
    }
}

// --- GITHUB API ---
async function fetchGitHubRepos(username) {
    const reposEl = document.getElementById('stat-repos');
    try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if(res.ok) {
            const data = await res.json();
            if (data.public_repos) {
                state.githubStats.repos = data.public_repos + "+";
                reposEl.textContent = state.githubStats.repos;
            }
        }
    } catch (e) { console.log("GitHub Repos Error", e); }
}

async function fetchGitHubCommits(username) {
    const commitsEl = document.getElementById('stat-commits');
    try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if(res.ok) {
            const data = await res.json();
            const years = Object.keys(data.total).map(Number).sort((a, b) => a - b);
            years.pop(); // Remove ano atual incompleto
            let totalCommits = 0;
            years.forEach(year => totalCommits += data.total[year]);
            
            if (totalCommits > 0) {
                let displayVal = totalCommits;
                if(totalCommits > 1000) displayVal = (totalCommits / 1000).toFixed(1) + "k+";
                state.githubStats.commits = displayVal;
                commitsEl.textContent = displayVal;
            }
        }
    } catch (e) { console.log("GitHub Commits Error", e); }
}

// --- SISTEMA DE RADAR DO MOUSE (PARENT TO IFRAME) ---
// Isso permite que o efeito funcione mesmo com o mouse sobre textos/botões
document.addEventListener('mousemove', (e) => {
    // Só envia se o perfil GAME estiver ativo
    if (state.profile !== 'game') return;

    const bgFrame = document.getElementById('game-bg-frame');
    if (bgFrame && bgFrame.contentWindow) {
        // Calcula a porcentagem X e Y da tela inteira
        const posX = (e.clientX / window.innerWidth) * 100;
        const posY = (e.clientY / window.innerHeight) * 100;

        // Envia mensagem segura para o iframe
        bgFrame.contentWindow.postMessage({
            type: 'MOUSE_MOVE',
            x: posX,
            y: posY
        }, '*'); // '*' permite envio local, ideal para desenvolvimento
    }
});