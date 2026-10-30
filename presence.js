/* Confirmations de présence des invités — liste privée dans l'administration. */
(function () {
  'use strict';

  var API = 'https://br-falling-lab-b9lsl3j6-souvenirs.compute.c-7.eu-central-1.aws.neon.tech';
  var form = document.getElementById('formulaire-presence');
  if (!form) return;

  var nom = document.getElementById('presence-nom');
  var telephone = document.getElementById('presence-telephone');
  var cote = document.getElementById('presence-cote');
  var presence = document.getElementById('presence-reponse');
  var adultes = document.getElementById('presence-adultes');
  var enfants = document.getElementById('presence-enfants');
  var accompagnants = document.getElementById('presence-accompagnants');
  var piege = document.getElementById('presence-site-web');
  var bouton = document.getElementById('presence-envoyer');
  var message = document.getElementById('presence-reponse-message');

  function afficherAccompagnants() {
    var refuse = presence.value === 'non';
    accompagnants.hidden = refuse;
    adultes.disabled = refuse;
    enfants.disabled = refuse;
  }
  presence.addEventListener('change', afficherAccompagnants);
  afficherAccompagnants();

  function lireEnfants(texte) {
    var lignes = (texte || '').split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (lignes.length > 12) throw new Error('Indiquez au maximum 12 enfants par réponse.');
    return lignes.map(function (ligne) {
      var morceaux = ligne.split(/\s*[—–,;]\s*/);
      var prenom = morceaux.shift().trim();
      if (!prenom || prenom.length > 60) throw new Error('Vérifiez le prénom de chaque enfant (60 caractères maximum).');
      var age = null;
      if (morceaux.length) {
        var ageLu = morceaux.join(' ').match(/^(\d{1,2})(?:\s*ans?)?$/i);
        if (!ageLu || Number(ageLu[1]) > 17) throw new Error('Pour chaque enfant, indiquez un âge entre 0 et 17 ans, par exemple « Lina — 6 ans ».');
        age = Number(ageLu[1]);
      }
      return { nom: prenom, age: age };
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!nom.value.trim()) {
      message.className = 'reponse-souvenir err';
      message.textContent = 'Indiquez votre nom pour envoyer votre réponse.';
      nom.focus();
      return;
    }

    var listeEnfants;
    try { listeEnfants = presence.value === 'non' ? [] : lireEnfants(enfants.value); }
    catch (e) {
      message.className = 'reponse-souvenir err';
      message.textContent = e.message;
      return;
    }

    var nombreAdultes = presence.value === 'non' ? 0 : Number(adultes.value);
    if (presence.value !== 'non' && (!Number.isInteger(nombreAdultes) || nombreAdultes < 1 || nombreAdultes > 20)) {
      message.className = 'reponse-souvenir err';
      message.textContent = 'Indiquez entre 1 et 20 adultes, vous compris.';
      adultes.focus();
      return;
    }

    bouton.disabled = true;
    message.className = 'reponse-souvenir';
    message.textContent = 'Envoi de votre réponse…';
    fetch(API + '/confirmations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: nom.value.trim(),
        telephone: telephone.value.trim(),
        cote: cote.value,
        presence: presence.value,
        adultes: nombreAdultes,
        enfants: listeEnfants,
        site_web: piege.value
      })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (rep) {
        if (!r.ok) throw new Error(rep.erreur || 'Envoi impossible, réessayez plus tard.');
        return rep;
      });
    }).then(function () {
      message.className = 'reponse-souvenir ok';
      message.textContent = 'Merci, votre réponse a bien été transmise aux mariés.';
      form.reset();
      afficherAccompagnants();
    }).catch(function (err) {
      message.className = 'reponse-souvenir err';
      message.textContent = err.message || 'Connexion impossible. Vérifiez Internet et réessayez.';
    }).then(function () { bouton.disabled = false; });
  });
})();
