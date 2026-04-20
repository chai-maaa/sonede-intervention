// Fonction de connexion
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password) {
        // Sauvegarder l'utilisateur connecté
        localStorage.setItem('user', JSON.stringify({ email: email, role: 'admin' }));
        window.location.href = 'dashboard.html';
    } else {
        alert('Veuillez remplir tous les champs');
    }
}

// Vérifier si l'utilisateur est connecté
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// Déconnexion
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Charger les interventions depuis localStorage
function loadInterventions() {
    const interventions = localStorage.getItem('interventions');
    return interventions ? JSON.parse(interventions) : [];
}

// Sauvegarder les interventions
function saveInterventions(interventions) {
    localStorage.setItem('interventions', JSON.stringify(interventions));
}

// Ajouter une intervention
function addIntervention() {
    const descInput = document.getElementById('interventionDesc');
    const description = descInput.value.trim();
    
    if (!description) {
        alert('Veuillez entrer une description');
        return;
    }
    
    const interventions = loadInterventions();
    const newIntervention = {
        id: Date.now(),
        description: description,
        status: 'en attente',
        date: new Date().toLocaleDateString('fr-FR'),
        technicien: 'Non affecté'
    };
    
    interventions.push(newIntervention);
    saveInterventions(interventions);
    descInput.value = '';
    displayInterventions();
}

// Supprimer une intervention
function deleteIntervention(id) {
    let interventions = loadInterventions();
    interventions = interventions.filter(i => i.id !== id);
    saveInterventions(interventions);
    displayInterventions();
}

// Changer le statut
function changeStatus(id, newStatus) {
    let interventions = loadInterventions();
    const intervention = interventions.find(i => i.id === id);
    if (intervention) {
        intervention.status = newStatus;
        saveInterventions(interventions);
        displayInterventions();
    }
}

// Afficher les interventions dans le tableau
function displayInterventions() {
    const interventions = loadInterventions();
    const tbody = document.getElementById('interventionsTable');
    
    if (!tbody) return;
    
    if (interventions.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="5"> Aucune intervention pour le moment</td></tr>';
        return;
    }
    
    const statusLabels = {
        'en attente': ' En attente',
        'en cours': 'En cours',
        'terminé': ' Terminé'
    };
    
    const statusClasses = {
        'en attente': 'status-pending',
        'en cours': 'status-progress',
        'terminé': 'status-done'
    };
    
    tbody.innerHTML = interventions.map(inter => `
        <tr>
            <td>${inter.id}</td>
            <td>${inter.description}</td>
            <td>${inter.date}</td>
            <td>${inter.technicien}</td>
            <td>
                <span class="status ${statusClasses[inter.status]}">${statusLabels[inter.status]}</span>
            </td>
            <td>
                <select onchange="changeStatus(${inter.id}, this.value)" class="action-btn" style="width: auto; padding: 5px;">
                    <option value="en attente" ${inter.status === 'en attente' ? 'selected' : ''}> En attente</option>
                    <option value="en cours" ${inter.status === 'en cours' ? 'selected' : ''}> En cours</option>
                    <option value="terminé" ${inter.status === 'terminé' ? 'selected' : ''}>Terminé</option>
                </select>
                <button onclick="deleteIntervention(${inter.id})" class="action-btn delete-btn"></button>
            </td>
        </tr>
    `).join('');
    
    // Mettre à jour les statistiques
    updateStats(interventions);
}

// Mettre à jour les statistiques
function updateStats(interventions) {
    const statsSpan = document.getElementById('stats');
    if (statsSpan) {
        const total = interventions.length;
        const enAttente = interventions.filter(i => i.status === 'en attente').length;
        const enCours = interventions.filter(i => i.status === 'en cours').length;
        const termine = interventions.filter(i => i.status === 'terminé').length;
        statsSpan.innerHTML = ` Total: ${total} |  En attente: ${enAttente} | En cours: ${enCours} |  Terminé: ${termine}`;
    }
}

// Initialisation au chargement de dashboard
if (window.location.pathname.includes('dashboard.html')) {
    checkAuth();
    displayInterventions();
}