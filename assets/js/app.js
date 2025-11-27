// --- State Management ---
let appState = {
    activeCategoryId: 'foundational',
    activeTechniqueId: null,
    favorites: JSON.parse(localStorage.getItem('promptGuideFavorites')) || []
};

// --- Core DOM Elements ---
const categoryNav = document.getElementById('category-nav');
const categoryHeader = document.getElementById('category-header');
const techniqueGrid = document.getElementById('technique-grid');
const categoryInsight = document.getElementById('category-insight');
const categoryTags = document.getElementById('category-tags');
const totalTechniquesCount = document.getElementById('total-techniques-count');
const modal = document.getElementById('simulation-modal');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');

// --- Search Management ---
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.trim() === '') {
            renderApp();
        } else {
            searchTechniques(query);
        }
    });
}

function searchTechniques(query) {
    // Flatten all techniques
    const allTechniques = reportData.categories.flatMap(cat =>
        cat.techniques.map(t => ({...t, categoryIcon: cat.icon}))
    );

    const matches = allTechniques.filter(tech =>
        tech.title.toLowerCase().includes(query) ||
        tech.definition.toLowerCase().includes(query) ||
        tech.bestUse.toLowerCase().includes(query)
    );

    // Update Header for Search Mode
    categoryHeader.innerHTML = '';

    const headerWrapper = document.createElement('div');
    headerWrapper.className = 'flex items-start justify-between';

    const contentDiv = document.createElement('div');

    const badgeWrapper = document.createElement('div');
    badgeWrapper.className = 'flex items-center gap-2 mb-2';

    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide';
    badgeSpan.textContent = 'Search Results';

    badgeWrapper.appendChild(badgeSpan);

    const titleH2 = document.createElement('h2');
    titleH2.className = 'text-3xl font-bold text-gray-900 dark:text-white serif-font mb-3';
    titleH2.textContent = `Found ${matches.length} matches for "${query}"`;

    contentDiv.appendChild(badgeWrapper);
    contentDiv.appendChild(titleH2);
    headerWrapper.appendChild(contentDiv);

    categoryHeader.appendChild(headerWrapper);

    // Clear Insight/Tags/Chart in search mode
    categoryInsight.textContent = '';
    categoryTags.innerHTML = '';
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    document.querySelector('.chart-container').style.display = 'none';

    // Render Grid
    techniqueGrid.innerHTML = '';
    if (matches.length === 0) {
        techniqueGrid.innerHTML = `<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No techniques found matching your query.</p>`;
        return;
    }

    matches.forEach(tech => {
        const card = document.createElement('div');
        card.className = 'technique-card bg-white dark:bg-darkCard rounded-xl p-6 border border-gray-200 dark:border-darkBorder shadow-sm flex flex-col h-full cursor-pointer hover:border-orange-200 dark:hover:border-orange-500/50';
        card.onclick = () => openDetails(tech);

        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-gray-600">
                    ${tech.categoryIcon || '📄'}
                </div>
                <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-600 px-2 py-1 rounded-md">
                    ${tech.complexity}
                </span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 serif-font">${tech.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">${tech.definition}</p>
            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span class="text-xs text-teal-600 dark:text-teal-400 font-medium truncate pr-2">Best for: ${tech.bestUse.split(',')[0]}...</span>
                <span class="text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1 group">
                    View Example
                    <span class="transition-transform group-hover:translate-x-1">→</span>
                </span>
            </div>
        `;
        techniqueGrid.appendChild(card);
    });
}

// --- Theme Management ---
themeToggle.onclick = () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
    updateChartTheme(); // Update chart on toggle
};

// --- Chart Management ---
let chartInstance = null;

function getChartColors() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
        scaleColor: isDark ? '#4B5563' : '#E5E7EB', // Grid lines
        textColor: isDark ? '#9CA3AF' : '#6B7280', // Text
        pointBg: isDark ? 'rgba(234, 88, 12, 1)' : 'rgba(234, 88, 12, 1)',
        fill: isDark ? 'rgba(234, 88, 12, 0.4)' : 'rgba(234, 88, 12, 0.2)'
    };
}

function initChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const colors = getChartColors();

    chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Complexity', 'Reliability', 'Speed', 'Cost Efficiency', 'Creativity'],
            datasets: [{
                label: 'Technique Profile',
                data: [0, 0, 0, 0, 0],
                backgroundColor: colors.fill,
                borderColor: 'rgba(234, 88, 12, 1)',
                pointBackgroundColor: colors.pointBg,
                pointBorderColor: isDarkTheme() ? '#1F2937' : '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(234, 88, 12, 1)'
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                r: {
                    angleLines: { color: colors.scaleColor },
                    grid: { color: colors.scaleColor },
                    pointLabels: {
                        font: { size: 10, family: "'Inter', sans-serif" },
                        color: colors.textColor
                    },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: { display: false, backdropColor: 'transparent' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDarkTheme() ? '#374151' : '#1F2937',
                    titleFont: { family: "'Merriweather', serif" },
                    bodyFont: { family: "'Inter', sans-serif" }
                }
            }
        }
    });
}

function isDarkTheme() {
    return document.documentElement.classList.contains('dark');
}

function updateChartTheme() {
    if (chartInstance) {
        const colors = getChartColors();
        chartInstance.data.datasets[0].backgroundColor = colors.fill;
        chartInstance.data.datasets[0].pointBorderColor = isDarkTheme() ? '#1F2937' : '#fff';

        chartInstance.options.scales.r.angleLines.color = colors.scaleColor;
        chartInstance.options.scales.r.grid.color = colors.scaleColor;
        chartInstance.options.scales.r.pointLabels.color = colors.textColor;
        chartInstance.options.plugins.tooltip.backgroundColor = isDarkTheme() ? '#374151' : '#1F2937';

        chartInstance.update();
    }
}

function updateChart(data) {
    if (chartInstance) {
        chartInstance.data.datasets[0].data = data;
        chartInstance.update();
    }
}

// --- Render Functions ---

function renderNav() {
    categoryNav.innerHTML = '';

    // Favorites Nav Item
    const favLi = document.createElement('li');
    const favBtn = document.createElement('button');
    favBtn.className = `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 mb-1 ${appState.activeCategoryId === 'favorites' ? 'active-tab' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`;
    favBtn.innerHTML = `<span class="text-base">❤️</span> <span>Favorites</span> <span class="ml-auto text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">${appState.favorites.length}</span>`;
    favBtn.onclick = () => {
        appState.activeCategoryId = 'favorites';
        renderApp();
        document.getElementById('main-scroll').scrollTop = 0;
    };
    favLi.appendChild(favBtn);
    categoryNav.appendChild(favLi);

    // Quiz Nav Item
    const quizLi = document.createElement('li');
    const quizBtn = document.createElement('button');
    quizBtn.className = `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 mb-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800`;
    quizBtn.innerHTML = `<span class="text-base">❓</span> <span>Quiz Mode</span>`;
    quizBtn.onclick = () => {
        openQuizModal();
    };
    quizLi.appendChild(quizBtn);
    categoryNav.appendChild(quizLi);

    // Separator
    const sep = document.createElement('hr');
    sep.className = 'my-2 border-gray-100 dark:border-darkBorder';
    categoryNav.appendChild(sep);

    let totalTechs = 0;

    reportData.categories.forEach(cat => {
        totalTechs += cat.techniques.length;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${appState.activeCategoryId === cat.id ? 'active-tab' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`;
        // Usage of innerHTML here is safe as cat.icon and cat.title are from static trusted data
        btn.innerHTML = `<span class="text-base">${cat.icon}</span> <span>${cat.title}</span>`;
        btn.onclick = () => {
            appState.activeCategoryId = cat.id;
            renderApp();
            // Scroll to top of main on switch
            document.getElementById('main-scroll').scrollTop = 0;
        };
        li.appendChild(btn);
        categoryNav.appendChild(li);
    });

    totalTechniquesCount.textContent = `${totalTechs} Techniques`;
}

function renderCategoryHeader(category) {
    // Usage of innerHTML here is safe as data is static and trusted.
    // Using template literals for large HTML blocks is efficient for this SPA size.
    categoryHeader.innerHTML = `
        <div class="flex items-start justify-between">
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Category Focus</span>
                </div>
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white serif-font mb-3">${category.title}</h2>
                <p class="text-gray-600 dark:text-gray-300 max-w-2xl text-lg">${category.description}</p>
            </div>
            <div class="hidden lg:block text-6xl opacity-10 grayscale select-none dark:opacity-20 dark:grayscale-0">
                ${category.icon}
            </div>
        </div>
    `;

    categoryInsight.textContent = category.insight;

    // Dynamic Tags based on chart data logic (simplified for visual)
    const tags = [];
    if(category.chartData[0] > 7) tags.push({text: 'High Complexity', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'});
    else tags.push({text: 'Beginner Friendly', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'});

    if(category.chartData[1] > 7) tags.push({text: 'High Reliability', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'});

    categoryTags.innerHTML = tags.map(t => `<span class="${t.color} px-2 py-1 rounded text-xs font-semibold">${t.text}</span>`).join('');

    updateChart(category.chartData);
}

function renderTechniques(category) {
    techniqueGrid.innerHTML = '';

    if (category.techniques.length === 0) {
        techniqueGrid.innerHTML = `<p class="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No techniques found in this category.</p>`;
        return;
    }

    category.techniques.forEach(tech => {
        const isFav = appState.favorites.includes(tech.id);
        const card = document.createElement('div');
        card.className = 'technique-card bg-white dark:bg-darkCard rounded-xl p-6 border border-gray-200 dark:border-darkBorder shadow-sm flex flex-col h-full cursor-pointer hover:border-orange-200 dark:hover:border-orange-500/50 relative group/card';

        // Favorite Button
        const favBtn = document.createElement('button');
        favBtn.className = `absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10 transition-colors ${isFav ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`;
        favBtn.innerHTML = isFav ? '❤️' : '🤍';
        favBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(tech.id);
        };
        card.appendChild(favBtn);

        card.onclick = () => openDetails(tech);

        // Note: Using innerHTML for card template. Content is trusted static data.
        const icon = tech.categoryIcon || category.icon || '📄';

        const content = document.createElement('div');
        content.className = "flex flex-col h-full";
        content.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-gray-600">
                    ${icon}
                </div>
                <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-600 px-2 py-1 rounded-md mr-8">
                    ${tech.complexity}
                </span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 serif-font">${tech.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-3">${tech.definition}</p>
            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span class="text-xs text-teal-600 dark:text-teal-400 font-medium truncate pr-2">Best for: ${tech.bestUse.split(',')[0]}...</span>
                <span class="text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1 group">
                    View Example
                    <span class="transition-transform group-hover:translate-x-1">→</span>
                </span>
            </div>
        `;
        card.appendChild(content);
        techniqueGrid.appendChild(card);
    });
}

function toggleFavorite(id) {
    if (appState.favorites.includes(id)) {
        appState.favorites = appState.favorites.filter(fid => fid !== id);
    } else {
        appState.favorites.push(id);
    }
    localStorage.setItem('promptGuideFavorites', JSON.stringify(appState.favorites));
    renderNav(); // Update count
    if (appState.activeCategoryId === 'favorites') {
        renderApp(); // Re-render if in favorites view
    } else {
        renderTechniques(reportData.categories.find(c => c.id === appState.activeCategoryId)); // Re-render current view to update icon
    }
}

// --- Detail Modal Logic ---

function openDetails(tech) {
    appState.activeTechniqueId = tech;

    document.getElementById('modal-title').textContent = tech.title;
    document.getElementById('modal-subtitle').textContent = `Best for: ${tech.bestUse}`;
    document.getElementById('modal-definition').textContent = tech.definition;

    // Safer: Use textContent for dynamic text insertion to avoid XSS patterns
    document.getElementById('modal-mechanism-text').textContent = tech.mechanism;

    const promptEl = document.getElementById('example-prompt');
    promptEl.textContent = tech.exampleInput;
    promptEl.setAttribute('contenteditable', 'true'); // Enable editing
    promptEl.classList.add('outline-none', 'focus:ring-2', 'focus:ring-orange-500', 'p-2', 'rounded');

    const outputEl = document.getElementById('example-output');
    outputEl.textContent = tech.exampleOutput;

    // Reset button logic
    let resetBtn = document.getElementById('reset-prompt-btn');
    if (!resetBtn) {
        // Create Reset button if it doesn't exist
        const copyBtn = document.getElementById('copy-prompt-btn');
        resetBtn = document.createElement('button');
        resetBtn.id = 'reset-prompt-btn';
        resetBtn.className = 'text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-3 transition-colors';
        resetBtn.textContent = 'Reset';
        copyBtn.parentNode.insertBefore(resetBtn, copyBtn);
    }

    resetBtn.onclick = () => {
        promptEl.textContent = tech.exampleInput;
    };

    // Copy logic (copies current edited text)
    document.getElementById('copy-prompt-btn').onclick = () => {
        navigator.clipboard.writeText(promptEl.textContent).then(() => {
            const btn = document.getElementById('copy-prompt-btn');
            const originalText = btn.innerHTML;
            btn.textContent = 'Copied!';
            btn.classList.add('text-green-600', 'dark:text-green-400');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('text-green-600', 'dark:text-green-400');
            }, 2000);
        });
    };

    modal.classList.remove('hidden');
}

// --- Init & Event Listeners ---

document.getElementById('close-modal').onclick = () => {
    modal.classList.add('hidden');
};

// Close modal on outside click
modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add('hidden');
};

// --- Quiz Logic ---
const quizModal = document.getElementById('quiz-modal');
const quizContent = document.getElementById('quiz-content');
const quizScoreEl = document.getElementById('quiz-score');
const nextQuestionBtn = document.getElementById('next-question-btn');
const closeQuizBtn = document.getElementById('close-quiz-modal');
let quizScore = 0;
let quizQuestionsAnswered = 0;

if (closeQuizBtn) {
    closeQuizBtn.onclick = () => {
        quizModal.classList.add('hidden');
    };
}
if (quizModal) {
    quizModal.onclick = (e) => {
        if (e.target === quizModal) quizModal.classList.add('hidden');
    };
}

function openQuizModal() {
    quizScore = 0;
    quizQuestionsAnswered = 0;
    quizScoreEl.textContent = `Score: 0`;
    nextQuestionBtn.classList.add('hidden');
    quizModal.classList.remove('hidden');
    loadNewQuestion();
}

function loadNewQuestion() {
    nextQuestionBtn.classList.add('hidden');

    // Pick random technique
    const allTechniques = reportData.categories.flatMap(c => c.techniques);
    const correctTech = allTechniques[Math.floor(Math.random() * allTechniques.length)];

    // Pick 3 distractors
    const distractors = [];
    while (distractors.length < 3) {
        const randomTech = allTechniques[Math.floor(Math.random() * allTechniques.length)];
        if (randomTech.id !== correctTech.id && !distractors.find(t => t.id === randomTech.id)) {
            distractors.push(randomTech);
        }
    }

    const options = [correctTech, ...distractors].sort(() => Math.random() - 0.5);

    // Generate Question Type (Definition -> Title OR Title -> Best Use)
    const type = Math.random() > 0.5 ? 'definition' : 'bestUse';

    let questionText = '';
    if (type === 'definition') {
        questionText = `<p class="mb-4 text-gray-600 dark:text-gray-300">Which technique corresponds to this definition?</p>
                        <blockquote class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-orange-500 italic mb-6 text-gray-800 dark:text-gray-200">"${correctTech.definition}"</blockquote>`;
    } else {
         questionText = `<p class="mb-4 text-gray-600 dark:text-gray-300">Which technique is best used for:</p>
                        <blockquote class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-teal-500 italic mb-6 text-gray-800 dark:text-gray-200">"${correctTech.bestUse}"</blockquote>`;
    }

    let optionsHtml = '<div class="space-y-3">';
    options.forEach(opt => {
        optionsHtml += `<button class="quiz-option w-full text-left p-3 rounded-lg border border-gray-200 dark:border-darkBorder hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300" data-id="${opt.id}">${opt.title}</button>`;
    });
    optionsHtml += '</div>';

    quizContent.innerHTML = questionText + optionsHtml;

    // Add listeners
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.onclick = () => checkAnswer(btn, correctTech.id);
    });
}

function checkAnswer(selectedBtn, correctId) {
    const isCorrect = selectedBtn.dataset.id === correctId;

    // Disable all buttons
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.id === correctId) {
            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-800', 'dark:bg-green-900/30', 'dark:border-green-500', 'dark:text-green-200');
        } else if (btn === selectedBtn && !isCorrect) {
            btn.classList.add('bg-red-100', 'border-red-500', 'text-red-800', 'dark:bg-red-900/30', 'dark:border-red-500', 'dark:text-red-200');
        }
    });

    if (isCorrect) {
        quizScore++;
    }
    quizQuestionsAnswered++;
    quizScoreEl.textContent = `Score: ${quizScore} / ${quizQuestionsAnswered}`;

    nextQuestionBtn.classList.remove('hidden');
    nextQuestionBtn.onclick = () => loadNewQuestion();
}

function renderApp() {
    renderNav();
    // Restore chart container if it was hidden by search
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) chartContainer.style.display = 'block';

    // Re-init chart if destroyed
    if (!chartInstance) initChart();

    let activeCategory;

    if (appState.activeCategoryId === 'favorites') {
        // Construct virtual category
        const allTechniques = reportData.categories.flatMap(cat =>
            cat.techniques.map(t => ({...t, categoryIcon: cat.icon}))
        );
        const favTechniques = allTechniques.filter(t => appState.favorites.includes(t.id));

        activeCategory = {
            id: 'favorites',
            title: 'Your Favorites',
            icon: '❤️',
            description: 'A personalized collection of your saved prompt engineering techniques.',
            insight: 'Reviewing your favorite techniques regularly helps reinforce your memory and mastery of them.',
            chartData: [0, 0, 0, 0, 0], // Placeholder or calculate average
            techniques: favTechniques
        };

        // Calculate average stats for chart if favorites exist
        if (favTechniques.length > 0) {
            // This is a rough approximation since we don't have raw stats per technique easily accessible
            // without looking them up in the categories chart data which is aggregated.
            // For now, we'll just show a balanced chart or hidden.
            // Actually, let's hide the chart for Favorites or show a generic one.
            activeCategory.chartData = [5, 5, 5, 5, 5];
        }
    } else {
        activeCategory = reportData.categories.find(c => c.id === appState.activeCategoryId);
    }

    renderCategoryHeader(activeCategory);
    renderTechniques(activeCategory);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    renderApp();
    // Ensure chart theme is correct on load in case dark mode was applied via inline script
    updateChartTheme();
});
