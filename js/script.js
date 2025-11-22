/**
 * Script principal pour le Calculateur de Salaire Maroc 2025
 * Implémente les règles de la Loi de Finances 2025.
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- Initialisation des composants ClearableInput ---
    // On initialise les champs avec notre nouveau composant
    new ClearableInput('salaireDeBaseMensuel', { type: 'number', decimals: 2, maxlength: 9, minlength: 0 });
    // new ClearableInput('salaireNetMensuel', { type: 'number', decimals: 2, maxlength: 9, minlength: 0 });
    new ClearableInput('indemniteTransport', { type: 'number', decimals: 0, maxlength: 3, minlength: 0 });
    new ClearableInput('indemnitePanier', { type: 'number', decimals: 0, maxlength: 3, minlength: 0 });
    
    // --- Initialisation des éléments du DOM ---
    const salaireDeBaseMensuelInput = document.getElementById('salaireDeBaseMensuel');
    // const salaireNetMensuelInput = document.getElementById('salaireNetMensuel');
    const dateEmbaucheInput = document.getElementById('dateEmbauche');
    const nbChargesInput = document.getElementById('nbCharges');
    const chkPersonnesCharge = document.getElementById('chkPersonnesCharge');
    const nbChargesContainer = document.getElementById('nbChargesContainer');
    
    const chkIndemniteTransport = document.getElementById('chkIndemniteTransport');
    const indemniteTransportInput = document.getElementById('indemniteTransport');
    const indemniteTransportContainer = document.getElementById('indemniteTransportContainer');
    
    const chkIndemnitePanier = document.getElementById('chkIndemnitePanier');
    const indemnitePanierInput = document.getElementById('indemnitePanier');
    const indemnitePanierContainer = document.getElementById('indemnitePanierContainer');
    
    const chkAMO = document.getElementById('chkAMO');

    const chkCIMR = document.getElementById('chkCIMR');
    const tauxCIMRInput = document.getElementById('tauxCIMR');
    const tauxCIMRContainer = document.getElementById('tauxCIMRContainer');
    const tauxCIMRWrapper = document.getElementById('tauxCIMRWrapper');
    
    const btnCalculer = document.getElementById('btnCalculer');
    const btnReset = document.getElementById('btnReset');
    const resultatCalculDiv = document.getElementById('resultatCalcul');
    const detailsResultatsDiv = document.getElementById('detailsResultats');

    // Initialisation des tooltips Bootstrap
    $('[data-toggle="tooltip"]').tooltip();

    // Initialisation de la date d'embauche à aujourd'hui
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    dateEmbaucheInput.value = formattedToday;
    dateEmbaucheInput.max = formattedToday; // Empêche la sélection d'une date future

    // --- Gestion des Événements ---

    // Checkboxes pour activer/désactiver les champs
    chkPersonnesCharge.addEventListener('change', function() {
        if (this.checked) {
            nbChargesContainer.style.display = 'block';
        } else {
            nbChargesContainer.style.display = 'none';
        }
    });

    chkIndemniteTransport.addEventListener('change', function() {
        indemniteTransportInput.disabled = !this.checked;
        if (this.checked) {
            indemniteTransportContainer.style.display = 'block';
        } else {
            indemniteTransportContainer.style.display = 'none';
        }
        gererChampsSalaireEtBouton();
    });

    chkIndemnitePanier.addEventListener('change', function() {
        indemnitePanierInput.disabled = !this.checked;
        if (this.checked) {
            indemnitePanierContainer.style.display = 'block';
        } else {
            indemnitePanierContainer.style.display = 'none';
        }
        gererChampsSalaireEtBouton();
    });

    chkCIMR.addEventListener('change', function() {
        tauxCIMRInput.disabled = !this.checked;
        if (this.checked) {
            tauxCIMRContainer.style.display = 'block';
            tauxCIMRWrapper.classList.remove('disabled');
        } else {
            tauxCIMRContainer.style.display = 'none';
            tauxCIMRWrapper.classList.add('disabled');
        }
        gererChampsSalaireEtBouton();
    });

    // Initialisation des sliders
    function setupSlider(sliderId, bubbleId) {
        const slider = document.getElementById(sliderId);
        const bubble = document.getElementById(bubbleId);
        
        function updateBubble() {
            const val = slider.value;
            const min = slider.min ? slider.min : 0;
            const max = slider.max ? slider.max : 100;
            const newVal = Number(((val - min) * 100) / (max - min));
            
            bubble.innerHTML = val;
            
            // Ajustement de la position pour suivre le thumb
            // Le thumb a une largeur, donc le centre se déplace de thumbWidth/2 à width - thumbWidth/2
            // On utilise une formule empirique pour centrer la bulle sur le thumb
            bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
        }
        
        slider.addEventListener('input', updateBubble);
        // Initialisation
        updateBubble();
    }

    setupSlider('nbCharges', 'nbChargesBubble');
    setupSlider('tauxCIMR', 'tauxCIMRBubble');

    // Ajout des listeners sur les champs optionnels pour la validation en temps réel
    indemniteTransportInput.addEventListener('input', gererChampsSalaireEtBouton);
    indemnitePanierInput.addEventListener('input', gererChampsSalaireEtBouton);
    tauxCIMRInput.addEventListener('input', gererChampsSalaireEtBouton);

    // Gestion des champs de salaire (Exclusivité mutuelle et activation bouton)
    function gererChampsSalaireEtBouton() {
        const SMIG_2025 = 3266.10;
        const brutVal = parseAndValidateNumber(salaireDeBaseMensuelInput);
        // const netVal = parseAndValidateNumber(salaireNetMensuelInput);
        
        const isBrutValid = !isNaN(brutVal) && brutVal >= SMIG_2025;
        // const isNetValid = !isNaN(netVal);
        const isBrutFilled = salaireDeBaseMensuelInput.value.trim() !== '';
        // const isNetFilled = salaireNetMensuelInput.value.trim() !== '';

        // Gestion de l'exclusivité et des erreurs visuelles
        if (isBrutFilled) {
            // salaireNetMensuelInput.disabled = true;
            // if (salaireNetMensuelInput.value !== '') salaireNetMensuelInput.value = '';
            
            if (!isBrutValid) {
                salaireDeBaseMensuelInput.classList.add('is-invalid');
            } else {
                salaireDeBaseMensuelInput.classList.remove('is-invalid');
            }
            // salaireNetMensuelInput.classList.remove('is-invalid');

        /* } else if (isNetFilled) {
            salaireDeBaseMensuelInput.disabled = true;
            if (salaireDeBaseMensuelInput.value !== '') salaireDeBaseMensuelInput.value = '';

            if (!isNetValid) {
                salaireNetMensuelInput.classList.add('is-invalid');
            } else {
                salaireNetMensuelInput.classList.remove('is-invalid');
            }
            salaireDeBaseMensuelInput.classList.remove('is-invalid'); */

        } else {
            salaireDeBaseMensuelInput.disabled = false;
            // salaireNetMensuelInput.disabled = false;
            salaireDeBaseMensuelInput.classList.remove('is-invalid');
            // salaireNetMensuelInput.classList.remove('is-invalid');
        }

        // Validation des champs optionnels
        let optionalsValid = true;
        if (chkIndemniteTransport.checked && isNaN(parseAndValidateNumber(indemniteTransportInput))) optionalsValid = false;
        if (chkIndemnitePanier.checked && isNaN(parseAndValidateNumber(indemnitePanierInput))) optionalsValid = false;
        // tauxCIMR est maintenant un slider, toujours valide (numérique)
        
        // État du bouton Calculer
        if ((isBrutValid /* || isNetValid */) && optionalsValid) {
            btnCalculer.disabled = false;
        } else {
            btnCalculer.disabled = true;
        }
    }

    salaireDeBaseMensuelInput.addEventListener('input', gererChampsSalaireEtBouton);
    // salaireNetMensuelInput.addEventListener('input', gererChampsSalaireEtBouton);

    // Bouton Réinitialiser
    btnReset.addEventListener('click', function() {
        document.getElementById('salaryForm').reset();
        resultatCalculDiv.style.display = 'none';
        detailsResultatsDiv.innerHTML = '';
        
        // Réinitialiser l'état des champs désactivés par défaut
        indemniteTransportInput.disabled = true;
        indemnitePanierInput.disabled = true;
        tauxCIMRInput.disabled = true;
        tauxCIMRWrapper.classList.add('disabled');
        
        // Cacher les conteneurs
        nbChargesContainer.style.display = 'none';
        indemniteTransportContainer.style.display = 'none';
        indemnitePanierContainer.style.display = 'none';
        tauxCIMRContainer.style.display = 'none';

        // Réinitialiser les sliders
        nbChargesInput.value = 0;
        tauxCIMRInput.value = 0;
        nbChargesInput.dispatchEvent(new Event('input'));
        tauxCIMRInput.dispatchEvent(new Event('input'));

        // Réinitialiser les champs de salaire
        salaireDeBaseMensuelInput.disabled = false;
        // salaireNetMensuelInput.disabled = false;
        salaireDeBaseMensuelInput.classList.remove('is-invalid');
        // salaireNetMensuelInput.classList.remove('is-invalid');
        btnCalculer.disabled = true;
        
        // Remettre la date du jour
        dateEmbaucheInput.value = `${yyyy}-${mm}-${dd}`;
    });

    // Bouton Calculer
    btnCalculer.addEventListener('click', function() {
        // Récupération des valeurs
        const salaireBrutSaisi = parseAndValidateNumber(salaireDeBaseMensuelInput);
        // const salaireNetSaisi = parseAndValidateNumber(salaireNetMensuelInput);
        const dateEmbauche = dateEmbaucheInput.value;
        
        const isPersonnesChargeActive = chkPersonnesCharge.checked;
        const nbCharges = isPersonnesChargeActive ? parseInt(nbChargesInput.value) : 0;
        
        const isTransportActive = chkIndemniteTransport.checked;
        const indemniteTransport = isTransportActive ? parseAndValidateNumber(indemniteTransportInput) : 0;
        
        const isPanierActive = chkIndemnitePanier.checked;
        const indemnitePanier = isPanierActive ? parseAndValidateNumber(indemnitePanierInput) : 0;
        
        const isAMOActive = chkAMO.checked;

        const isCIMRActive = chkCIMR.checked;
        const tauxCIMR = isCIMRActive ? parseInt(tauxCIMRInput.value) : 0;

        let resultats = null;

        if (!isNaN(salaireBrutSaisi)) {
            // Calcul Net depuis Brut
            resultats = calculerNetDepuisBrut(salaireBrutSaisi, dateEmbauche, nbCharges, indemniteTransport, indemnitePanier, tauxCIMR, isCIMRActive, isTransportActive, isPanierActive, isAMOActive);
        } /* else if (!isNaN(salaireNetSaisi)) {
            // Calcul Brut depuis Net
            resultats = calculerBrutDepuisNet(salaireNetSaisi, dateEmbauche, nbCharges, indemniteTransport, indemnitePanier, tauxCIMR, isCIMRActive, isTransportActive, isPanierActive, isAMOActive);
        } */

        if (resultats) {
            afficherResultats(resultats);
        }
    });

    // --- Fonctions Utilitaires ---

    /**
     * Valide et convertit une entrée utilisateur en nombre.
     * @param {HTMLInputElement} inputElement 
     * @returns {number|NaN}
     */
    function parseAndValidateNumber(inputElement) {
        let value = inputElement.value;
        if (!value) return NaN;

        // Supprimer les espaces pour supporter le copier-coller (ex: "10 000")
        // value = value.replace(/\s+/g, '');
        
        // Validation stricte du format : chiffres, optionnellement un point ou virgule suivi de chiffres
        // Interdit les formats comme "122..." ou "12.34.56"
        if (!/^\d+([.,]\d+)?$/.test(value)) return NaN;

        value = value.replace(',', '.');
        const number = parseFloat(value);
        if (isNaN(number) || number < 0) return NaN;
        return number;
    }

    /**
     * Calcule l'ancienneté en années complètes.
     * @param {string} dateEmbaucheString (YYYY-MM-DD)
     * @returns {number}
     */
    function calculerAncienneteEnAnnees(dateEmbaucheString) {
        if (!dateEmbaucheString) return 0;
        const embauche = new Date(dateEmbaucheString);
        const now = new Date();
        let years = now.getFullYear() - embauche.getFullYear();
        const m = now.getMonth() - embauche.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < embauche.getDate())) {
            years--;
        }
        return Math.max(0, years);
    }

    /**
     * Calcule l'IR Brut selon le barème 2025.
     * @param {number} baseImposable (SNI)
     * @returns {number} IR Brut
     */
    function calculerIRSelonBareme(baseImposable) {
        let taux = 0;
        let abattement = 0;

        if (baseImposable <= 3333.33) {
            taux = 0;
            abattement = 0;
        } else if (baseImposable <= 5000.00) {
            taux = 0.10;
            abattement = 333.33;
        } else if (baseImposable <= 6666.67) {
            taux = 0.20;
            abattement = 833.33;
        } else if (baseImposable <= 8333.33) {
            taux = 0.30;
            abattement = 1500.00;
        } else if (baseImposable <= 15000.00) {
            taux = 0.34;
            abattement = 1833.33;
        } else {
            taux = 0.37;
            abattement = 2283.33;
        }

        const irBrut = (baseImposable * taux) - abattement;
        return Math.max(0, irBrut);
    }

    // --- Fonctions de Calcul ---

    /**
     * Calcule le salaire Net à partir du Brut.
     */
    function calculerNetDepuisBrut(salaireDeBaseMensuel, dateEmbauche, nbCharges, indemniteTransport, indemnitePanier, tauxCIMR, isCIMRActive, isTransportActive, isPanierActive, isAMOActive) {
        // 1. Prime d'ancienneté
        const anneesAnciennete = calculerAncienneteEnAnnees(dateEmbauche);
        let tauxAnciennete = 0;
        if (anneesAnciennete >= 25) tauxAnciennete = 0.25;
        else if (anneesAnciennete >= 20) tauxAnciennete = 0.20;
        else if (anneesAnciennete >= 12) tauxAnciennete = 0.15;
        else if (anneesAnciennete >= 5) tauxAnciennete = 0.10;
        else if (anneesAnciennete >= 2) tauxAnciennete = 0.05;

        const primeAnciennete = salaireDeBaseMensuel * tauxAnciennete;

        // 2. Salaire Brut Global
        const salaireBrutGlobal = salaireDeBaseMensuel + primeAnciennete + indemniteTransport + indemnitePanier;

        // 3. Cotisations Sociales (CNSS & AMO)
        // CNSS : 4.48% plafonné à 6000 MAD
        const baseCnss = Math.min(salaireBrutGlobal, 6000);
        const cotisationCnss = baseCnss * 0.0448;

        // AMO : 2.26% sans plafond
        let cotisationAmo = 0;
        if (isAMOActive) {
            cotisationAmo = salaireBrutGlobal * 0.0226;
        }

        // 4. CIMR (Retraite Complémentaire)
        // Base = Brut Global - Indemnités exonérées (Transport, Panier)
        let cotisationCimr = 0;
        if (isCIMRActive) {
            const baseCimr = salaireBrutGlobal - indemniteTransport - indemnitePanier;
            cotisationCimr = baseCimr * (tauxCIMR / 100);
        }

        // 5. Salaire Brut Imposable (SBI)
        // SBI = Brut Global - Indemnités exonérées (Transport, Panier)
        // Note: Les indemnités de transport et panier sont exonérées d'IR.
        const salaireBrutImposable = salaireBrutGlobal - indemniteTransport - indemnitePanier;

        // 6. Frais Professionnels
        // Taux 35% si SBI <= 6500, sinon 25%. Plafond 2916.67 MAD.
        let fraisPro = 0;
        if (salaireBrutImposable <= 6500) {
            fraisPro = salaireBrutImposable * 0.35;
        } else {
            fraisPro = Math.min(salaireBrutImposable * 0.25, 2916.67);
        }

        // 7. Salaire Net Imposable (SNI)
        // SNI = SBI - CNSS - AMO - CIMR - FraisPro
        const salaireNetImposable = salaireBrutImposable - cotisationCnss - cotisationAmo - cotisationCimr - fraisPro;

        // 8. Impôt sur le Revenu (IR)
        const irBrut = calculerIRSelonBareme(salaireNetImposable);

        // 9. Réduction pour charges de famille
        // 500 MAD par an par personne => 41.666... par mois. Plafond 3000/an (6 pers).
        // Le texte dit "500 MAD par personne à charge par an" -> "soit 250 MAD par mois" ?
        // ATTENTION: Le texte d'instructions dit "500 MAD par personne à charge par an" MAIS "Plafond : Maximum 6 personnes à charge (soit 3 000 MAD par an, soit 250 MAD par mois)".
        // 3000 / 12 = 250. Donc 6 personnes * X = 250 => X = 41.66.
        // Mais la loi de finance 2025 a augmenté la réduction.
        // Vérifions l'instruction : "500 MAD par personne à charge par an" -> C'est l'ancienne loi (360 avant).
        // "Plafond : Maximum 6 personnes à charge (soit 3 000 MAD par an, soit 250 MAD par mois)".
        // 3000 / 12 = 250.
        // Donc la réduction mensuelle par personne est 500 / 12 = 41.66 MAD.
        // C'est ce que je vais implémenter selon l'instruction stricte : "reductionFamille = nbCharges * 500 / 12;"
        
        const reductionFamille = Math.min(nbCharges, 6) * (500 / 12);

        const irNet = Math.max(0, irBrut - reductionFamille);

        // 10. Salaire Net Mensuel
        // Net = Brut Global - CNSS - AMO - CIMR - IR Net
        // Ou plus simplement : SNI - IR Net + Indemnités non imposables (déjà retirées pour SNI mais font partie du net poche)
        // Attends, la formule classique est : Net = Brut Global - Retenues.
        // Retenues = CNSS + AMO + CIMR + IR Net.
        const totalRetenues = cotisationCnss + cotisationAmo + cotisationCimr + irNet;
        const salaireNetMensuel = salaireBrutGlobal - totalRetenues;

        return {
            salaireDeBase: salaireDeBaseMensuel,
            primeAnciennete: primeAnciennete,
            indemniteTransport: indemniteTransport,
            indemnitePanier: indemnitePanier,
            salaireBrutGlobal: salaireBrutGlobal,
            cotisationCnss: cotisationCnss,
            cotisationAmo: cotisationAmo,
            cotisationCimr: cotisationCimr,
            fraisPro: fraisPro,
            salaireNetImposable: salaireNetImposable,
            irBrut: irBrut,
            reductionFamille: reductionFamille,
            irNet: irNet,
            salaireNetMensuel: salaireNetMensuel
        };
    }

    /**
     * Calcule le salaire Brut à partir du Net (Approche itérative).
     */
    /* function calculerBrutDepuisNet(netMensuelCible, dateEmbauche, nbCharges, indemniteTransport, indemnitePanier, tauxCIMR, isCIMRActive, isTransportActive, isPanierActive, isAMOActive) {
        let brutMin = netMensuelCible; // Le brut ne peut pas être inférieur au net
        let brutMax = netMensuelCible * 2; // Estimation large
        let brutEstime = (brutMin + brutMax) / 2;
        let iterations = 0;
        const maxIterations = 100;
        const margeErreur = 0.01;

        let resultatsEstimes = null;

        while (iterations < maxIterations) {
            resultatsEstimes = calculerNetDepuisBrut(brutEstime, dateEmbauche, nbCharges, indemniteTransport, indemnitePanier, tauxCIMR, isCIMRActive, isTransportActive, isPanierActive, isAMOActive);
            
            const diff = resultatsEstimes.salaireNetMensuel - netMensuelCible;

            if (Math.abs(diff) < margeErreur) {
                break; // Trouvé !
            }

            if (diff > 0) {
                // Le net calculé est trop haut, on baisse le brut
                brutMax = brutEstime;
            } else {
                // Le net calculé est trop bas, on monte le brut
                brutMin = brutEstime;
            }
            brutEstime = (brutMin + brutMax) / 2;
            iterations++;
        }

        return resultatsEstimes;
    } */

    /**
     * Affiche les résultats dans le DOM.
     */
    function afficherResultats(res) {
        const totalCotisations = res.cotisationCnss + res.cotisationAmo + res.cotisationCimr;
        
        let irSection = '';
        if (res.reductionFamille > 0) {
            irSection = `
            <div class="result-item">
                <span class="result-label">IR Brut :</span>
                <span class="result-value">${formatMoney(res.irBrut)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Déduction Charges Familiales :</span>
                <span class="result-value text-success">-${formatMoney(res.reductionFamille)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">IR Net :</span>
                <span class="result-value text-danger">-${formatMoney(res.irNet)}</span>
            </div>`;
        } else {
            irSection = `
            <div class="result-item">
                <span class="result-label">Impôt sur le Revenu (IR) :</span>
                <span class="result-value text-danger">-${formatMoney(res.irNet)}</span>
            </div>`;
        }

        const html = `
            <div class="result-item">
                <span class="result-label">Salaire de Base Mensuel :</span>
                <span class="result-value">${formatMoney(res.salaireDeBase)}</span>
            </div>
            ${res.primeAnciennete > 0 ? `
            <div class="result-item">
                <span class="result-label">Prime d'Ancienneté :</span>
                <span class="result-value">${formatMoney(res.primeAnciennete)}</span>
            </div>` : ''}
            ${res.indemniteTransport > 0 ? `
            <div class="result-item">
                <span class="result-label">Indemnité de Transport :</span>
                <span class="result-value">${formatMoney(res.indemniteTransport)}</span>
            </div>` : ''}
            ${res.indemnitePanier > 0 ? `
            <div class="result-item">
                <span class="result-label">Indemnité de Panier :</span>
                <span class="result-value">${formatMoney(res.indemnitePanier)}</span>
            </div>` : ''}
            
            <div class="result-item" style="background-color: #e9ecef; font-weight: bold;">
                <span class="result-label">Total Brut :</span>
                <span class="result-value">${formatMoney(res.salaireBrutGlobal)}</span>
            </div>

            <div class="result-item">
                <span class="result-label">Cotisation CNSS (4.48%) :</span>
                <span class="result-value text-danger">-${formatMoney(res.cotisationCnss)}</span>
            </div>
            ${res.cotisationAmo > 0 ? `
            <div class="result-item">
                <span class="result-label">Cotisation AMO (2.26%) :</span>
                <span class="result-value text-danger">-${formatMoney(res.cotisationAmo)}</span>
            </div>` : ''}
            ${res.cotisationCimr > 0 ? `
            <div class="result-item">
                <span class="result-label">Cotisation CIMR :</span>
                <span class="result-value text-danger">-${formatMoney(res.cotisationCimr)}</span>
            </div>` : ''}

            <div class="result-item" style="background-color: #e9ecef; font-weight: bold;">
                <span class="result-label">Total Cotisations Salariales :</span>
                <span class="result-value text-danger">-${formatMoney(totalCotisations)}</span>
            </div>

            <div class="result-item">
                <span class="result-label">Frais Professionnels :</span>
                <span class="result-value text-success">-${formatMoney(res.fraisPro)}</span>
            </div>

            <div class="result-item" style="background-color: #e9ecef; font-weight: bold;">
                <span class="result-label">Salaire Net Imposable :</span>
                <span class="result-value">${formatMoney(res.salaireNetImposable)}</span>
            </div>

            ${irSection}

            <div class="result-item result-total">
                <span class="result-label">Salaire Net à Payer :</span>
                <span class="result-value">${formatMoney(res.salaireNetMensuel)}</span>
            </div>
        `;

        detailsResultatsDiv.innerHTML = html;
        resultatCalculDiv.style.display = 'block';
        
        // Scroll vers les résultats et focus pour l'accessibilité
        resultatCalculDiv.scrollIntoView({ behavior: 'smooth' });
        resultatCalculDiv.focus();
    }

    function formatMoney(amount) {
        return amount.toFixed(2) + ' MAD';
    }

    // Accessibilité Clavier pour les Toggles (Enter, Espace, Flèches)
    const toggleInputs = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggleInputs.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (!this.checked) this.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (this.checked) this.click();
            }
            // Espace est géré nativement par le navigateur pour les checkboxes
        });
    });

    // Validation de la date d'embauche pour empêcher les dates futures
    dateEmbaucheInput.addEventListener('change', function() {
        const enteredDate = new Date(dateEmbaucheInput.value);
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement les dates

        if (enteredDate > today) {
            dateEmbaucheInput.value = today.toISOString().split('T')[0];
            // alert('La date d\'embauche ne peut pas être une date future.');
        }
    });
});
