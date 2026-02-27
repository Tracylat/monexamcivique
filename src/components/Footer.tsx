import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  const Modal: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => {
    if (activeModal !== id) return null;
    return (
      <div className="fixed inset-0 bg-[#0b2848]/65 backdrop-blur-sm z-[1000] flex items-center justify-center p-8 animate-fadeIn" onClick={closeModal}>
        <div className="bg-white rounded-2xl max-w-[760px] w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-slideUp text-left" onClick={e => e.stopPropagation()}>
          <div className="sticky top-0 bg-[#1a4d8f] text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
            <h2 className="font-heading text-2xl font-bold m-0">{title}</h2>
            <button className="bg-white/10 border-none text-white w-8 h-8 rounded-full text-xl cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors" onClick={closeModal}>&times;</button>
          </div>
          <div className="p-8 text-[#1a1a1a] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="bg-[#1a4d8f] text-white pt-16 pb-8 px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-[1.5fr_1fr_1fr] gap-12 mb-16 max-md:grid-cols-1">
          {/* COL 1 — Brand */}
          <div>
            <div className="font-heading text-[2rem] font-extrabold mb-6 flex items-center gap-2">
              <img src="/src/assets/logo.png" alt="Logo" className="h-10 w-auto" />
              Examen Civique <span className="text-[#ff6b35]">Etrangers</span>
            </div>
            <p className="text-white/80 text-[1.05rem] mb-6 leading-relaxed">
              Examen Civique Etrangers est la <strong>plateforme n°1 de préparation à l'examen civique obligatoire</strong> en France.
              Depuis janvier 2026, cet examen est requis pour obtenir votre Carte de Séjour Pluriannuelle (CSP),
              Carte de Résident (10 ans) ou la Naturalisation française.<br/><br/>
              <strong>Notre mission :</strong> vous aider à réussir du premier coup avec 200+ questions officielles,
              examens blancs et fiches de révision adaptées aux 3 niveaux d'examen.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 py-2 px-4 rounded-full text-sm font-medium text-[#a5f3fc]">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Conforme à la réglementation du 1er janvier 2026
            </div>
          </div>

          {/* COL 2 — Navigation + Préparation */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[#ff6b35] mb-6 uppercase tracking-wider">Navigation</h3>
            <ul className="list-none p-0 m-0 space-y-3 mb-8">
              <li><button onClick={() => setActiveModal('modal-comment')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">Comment ça marche</button></li>
              <li><button onClick={() => setActiveModal('modal-tarifs')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">Tarifs</button></li>
              <li><button onClick={() => setActiveModal('modal-temoignages')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">Témoignages</button></li>
              <li><button onClick={() => setActiveModal('modal-faq')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">FAQ</button></li>
            </ul>

            <div className="h-px bg-white/10 my-8 w-12"></div>

            <h3 className="font-heading text-xl font-bold text-[#ff6b35] mb-6 uppercase tracking-wider">Préparation à l'examen</h3>
            <ul className="list-none p-0 m-0 space-y-3">
              <li><button onClick={() => setActiveModal('modal-test')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">🎯 Test gratuit (10 questions)</button></li>
              <li><button onClick={() => setActiveModal('modal-csp')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">📚 Guide complet CSP</button></li>
              <li><button onClick={() => setActiveModal('modal-cr')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">🏡 Guide Carte de Résident</button></li>
              <li><button onClick={() => setActiveModal('modal-naturalisation')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">🇫🇷 Guide Naturalisation</button></li>
            </ul>
          </div>

          {/* COL 3 — Légal */}
          <div>
            <h3 className="font-heading text-xl font-bold text-[#ff6b35] mb-6 uppercase tracking-wider">Informations légales</h3>
            <ul className="list-none p-0 m-0 space-y-3">
              <li><button onClick={() => setActiveModal('modal-mentions')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">⚖️ Mentions légales</button></li>
              <li><button onClick={() => setActiveModal('modal-cgv')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">📜 Conditions Générales de Vente</button></li>
              <li><button onClick={() => setActiveModal('modal-confidentialite')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">🔒 Politique de confidentialité</button></li>
              <li><button onClick={() => setActiveModal('modal-contact')} className="text-white/80 hover:text-white hover:translate-x-1 transition-all cursor-pointer bg-transparent border-none p-0 text-base">📞 Contact</button></li>
            </ul>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                Paiement sécurisé
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                SSL Certifié
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Conforme RGPD
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="text-[#ffc107]">★★★★★</span>
                4.9/5 (500+ avis)
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                © 2026 Examen Civique Etrangers
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <Modal id="modal-comment" title="Comment ça marche">
        <p className="mb-4">Examen Civique Etrangers vous prépare à l'examen civique obligatoire en <strong>3 étapes simples</strong>.</p>
        <div className="flex gap-4 mb-6">
          <div className="w-8 h-8 bg-[#1a4d8f] text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
          <div>
            <strong>Testez votre niveau gratuitement</strong><br/>
            Répondez à 10 questions pour évaluer vos connaissances actuelles. Vous recevez immédiatement votre score et une analyse de vos points faibles.
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="w-8 h-8 bg-[#1a4d8f] text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
          <div>
            <strong>Entraînez-vous avec 200+ questions</strong><br/>
            Accédez à notre banque de questions classées par thème (Valeurs de la République, Institutions, Histoire-Géographie, Droits et devoirs, Vivre en France) et par niveau (CSP, Carte de Résident, Naturalisation). Chaque question inclut une explication détaillée.
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="w-8 h-8 bg-[#1a4d8f] text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
          <div>
            <strong>Passez des examens blancs</strong><br/>
            Simulez les conditions réelles : 40 questions, 45 minutes, seuil de réussite à 80%. Suivez votre progression et identifiez les thèmes à retravailler grâce à vos statistiques personnalisées.
          </div>
        </div>
        <div className="bg-[#f0f9ff] border-l-4 border-[#1a4d8f] p-4 rounded mb-6">
          <strong>Format de l'examen officiel :</strong> 40 questions à choix multiples, 45 minutes, score minimum 32/40 (80%). L'examen couvre 5 thématiques officielles et inclut des mises en situation pratiques.
        </div>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-4">Ce qui est inclus dans la formation</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>200+ questions réparties sur les 5 thématiques officielles</li>
          <li>100 fiches de révision avec explications détaillées</li>
          <li>Examens blancs illimités en conditions réelles</li>
          <li>Suivi de progression personnalisé</li>
          <li>3 niveaux adaptés : CSP, Carte de Résident, Naturalisation</li>
          <li>Accès illimité depuis ordinateur, tablette et mobile</li>
        </ul>
      </Modal>

      <Modal id="modal-tarifs" title="Tarifs">
        <p className="mb-6">Un tarif unique, transparent, sans abonnement ni frais cachés.</p>
        <div className="text-center my-8">
          <div className="inline-block bg-[#2d6a4f] text-white text-3xl font-bold py-2 px-6 rounded-lg shadow-lg">20 €</div>
          <p className="mt-2 text-gray-600">Paiement unique — Accès illimité</p>
        </div>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-4">Ce que vous obtenez pour 20 €</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>200+ questions officielles couvrant les 5 thématiques</li>
          <li>100 fiches de révision avec explications</li>
          <li>Examens blancs illimités (conditions réelles : 40 questions, 45 min)</li>
          <li>Suivi de progression et statistiques par thème</li>
          <li>3 niveaux d'examen : CSP, Carte de Résident, Naturalisation</li>
          <li>Accès à vie depuis tous vos appareils</li>
        </ul>
        <div className="bg-[#fff5f5] border-l-4 border-[#d32f2f] p-4 rounded mb-6">
          <strong>Comparaison :</strong> En cas d'échec à l'examen, vous devrez repayer les frais de réinscription (225 €) et attendre 6 mois minimum avant de repasser. La formation Examen Civique Etrangers à 20 € vous évite ce risque.
        </div>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Garantie satisfait ou remboursé</h3>
        <p className="mb-6">Si vous n'êtes pas satisfait, contactez-nous dans les 14 jours suivant votre achat pour un remboursement intégral, sans condition.</p>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Moyens de paiement acceptés</h3>
        <p>Visa, Mastercard, American Express, Apple Pay, Google Pay. Paiement 100% sécurisé via Stripe.</p>
      </Modal>

      <Modal id="modal-temoignages" title="Témoignages">
        <p className="mb-6">Ils ont réussi leur examen civique grâce à Examen Civique Etrangers.</p>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="text-[#ffc107] mb-2">★★★★★</div>
            <p className="italic mb-4">« J'ai obtenu 38/40 à mon examen CSP ! Les questions d'entraînement étaient très proches de celles du vrai test. Les fiches de révision m'ont beaucoup aidée à mémoriser les dates clés. »</p>
            <div className="font-bold text-[#1a4d8f]">Maria S. — CSP obtenue en mars 2026</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="text-[#ffc107] mb-2">★★★★★</div>
            <p className="italic mb-4">« Après 5 ans en France, je préparais ma naturalisation. Le niveau expert m'a permis de maîtriser les questions les plus difficiles sur les institutions et l'histoire. Résultat : 36/40. »</p>
            <div className="font-bold text-[#1a4d8f]">Ahmed K. — Naturalisation réussie en février 2026</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="text-[#ffc107] mb-2">★★★★★</div>
            <p className="italic mb-4">« J'avais très peur de l'examen, surtout les mises en situation. Les examens blancs m'ont mis en confiance. Le jour J, j'étais prête. 34/40 ! »</p>
            <div className="font-bold text-[#1a4d8f]">Fatou D. — Carte de Résident obtenue en janvier 2026</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="text-[#ffc107] mb-2">★★★★★</div>
            <p className="italic mb-4">« Le format est parfait : on peut réviser 15 minutes par jour depuis son téléphone. En 3 semaines, j'ai couvert toutes les thématiques. Je recommande à tous ceux qui préparent l'examen. »</p>
            <div className="font-bold text-[#1a4d8f]">Li W. — CSP obtenue en février 2026</div>
          </div>
        </div>
        <div className="bg-[#f0f9ff] border-l-4 border-[#1a4d8f] p-4 rounded mt-6">
          <strong>95% de taux de satisfaction</strong> — Plus de 500 candidats préparés depuis janvier 2026.
        </div>
      </Modal>

      <Modal id="modal-faq" title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">L'examen civique est-il vraiment obligatoire ?</div>
            <p>Oui. Depuis le 1er janvier 2026, l'examen civique est obligatoire pour toute demande de Carte de Séjour Pluriannuelle (CSP), Carte de Résident (10 ans) et Naturalisation française.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">Quel est le format de l'examen ?</div>
            <p>40 questions à choix multiples, 45 minutes. Il faut obtenir au moins 32/40 (80%) pour réussir. Les questions couvrent 5 thématiques : Valeurs de la République, Institutions, Histoire-Géographie, Droits et devoirs, Vivre en France.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">Que se passe-t-il si j'échoue ?</div>
            <p>Vous devrez attendre 6 mois minimum avant de repasser l'examen, et repayer les frais d'inscription (225 €). D'où l'importance de bien se préparer dès le premier essai.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">Quelle est la différence entre les 3 niveaux ?</div>
            <p><strong>CSP (Standard) :</strong> questions fondamentales sur les valeurs et institutions. <strong>Carte de Résident (Avancé) :</strong> questions plus précises avec dates et chiffres. <strong>Naturalisation (Expert) :</strong> connaissances approfondies d'histoire, droit constitutionnel et institutions.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">Combien de temps faut-il pour se préparer ?</div>
            <p>Nous recommandons 3 semaines de préparation à raison de 15-30 minutes par jour. Nos utilisateurs révisent en moyenne 2 à 4 semaines avant l'examen.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">L'accès est-il limité dans le temps ?</div>
            <p>Non. Une fois votre achat effectué (20 €, paiement unique), vous avez un accès illimité à l'ensemble de la formation, sans date d'expiration.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">Puis-je me faire rembourser ?</div>
            <p>Oui. Vous disposez de 14 jours après votre achat pour demander un remboursement intégral, sans condition. Contactez-nous à contact@titrereussite.fr.</p>
          </div>
          <div>
            <div className="font-bold text-[#1a4d8f] mb-2">Les questions sont-elles les mêmes que l'examen officiel ?</div>
            <p>Nos questions sont rédigées à partir des sources officielles et couvrent l'intégralité du programme. Elles ne sont pas les questions exactes de l'examen mais en reproduisent fidèlement le niveau et les thématiques.</p>
          </div>
        </div>
      </Modal>

      <Modal id="modal-mentions" title="Mentions légales">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Éditeur du site</h3>
            <p>
              <strong>Examen Civique Etrangers</strong><br/>
              [Votre Prénom Nom], Micro-entreprise<br/>
              SIRET : [Votre numéro SIRET]<br/>
              Adresse : [Votre adresse complète]<br/>
              [Code postal] [Ville], France<br/>
              Email : contact@titrereussite.fr<br/>
              Téléphone : +33 (0)X XX XX XX XX
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Directeur de la publication</h3>
            <p>[Votre Prénom Nom], en qualité de fondateur et gérant.</p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Hébergeur</h3>
            <p>
              Netlify, Inc.<br/>
              2325 3rd Street, Suite 296<br/>
              San Francisco, CA 94107, USA<br/>
              Site : <a href="https://www.netlify.com" className="text-[#ff6b35]">www.netlify.com</a>
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Propriété intellectuelle</h3>
            <p>L'ensemble des contenus présents sur le site (textes, questions, fiches, graphismes, logo, images) est protégé par le droit d'auteur. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation expresse est interdite.</p>
          </div>
        </div>
      </Modal>

      <Modal id="modal-cgv" title="Conditions Générales de Vente">
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Article 1 — Objet</h3>
          <p>Les présentes CGV régissent la vente de la formation en ligne « Examen Civique Etrangers » accessible sur ce site.</p>

          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Article 2 — Prix</h3>
          <p>La formation est proposée au prix de <strong>20 € TTC</strong>, paiement unique. Ce prix inclut l'accès illimité à l'ensemble des contenus.</p>

          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Article 3 — Commande et paiement</h3>
          <p>La commande est validée après paiement intégral du prix. Le paiement est effectué en ligne par carte bancaire ou via Apple Pay / Google Pay, par l'intermédiaire de la plateforme sécurisée Stripe.</p>

          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Article 4 — Droit de rétractation</h3>
          <p>Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de <strong>14 jours</strong> à compter de la date d'achat pour exercer votre droit de rétractation sans avoir à justifier de motif.</p>

          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Article 5 — Accès à la formation</h3>
          <p>L'accès est personnel et non transférable. Il est accordé pour une durée illimitée à compter de la validation du paiement.</p>
        </div>
      </Modal>

      <Modal id="modal-confidentialite" title="Politique de confidentialité">
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Données collectées</h3>
          <ul className="list-disc pl-6">
            <li><strong>Lors du quiz gratuit :</strong> adresse email (si fournie volontairement)</li>
            <li><strong>Lors de l'achat :</strong> nom, prénom, adresse email, données de paiement (traitées par Stripe)</li>
            <li><strong>Navigation :</strong> données de connexion anonymisées via Google Analytics</li>
          </ul>

          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Finalités du traitement</h3>
          <ul className="list-disc pl-6">
            <li>Gestion de votre accès à la formation</li>
            <li>Envoi des emails liés à votre commande</li>
            <li>Amélioration de notre service</li>
          </ul>

          <h3 className="font-heading text-lg font-bold text-[#1a4d8f]">Vos droits</h3>
          <p>Conformément au RGPD, vous disposez des droits d'accès, rectification, effacement, limitation, opposition et portabilité de vos données.</p>
        </div>
      </Modal>

      <Modal id="modal-contact" title="Contact">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Nous écrire</h3>
            <p>
              <strong>Email :</strong> contact@titrereussite.fr<br/>
              Réponse garantie sous 24 à 48h, du lundi au vendredi.
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Par téléphone</h3>
            <p>
              <strong>Téléphone :</strong> +33 (0)X XX XX XX XX<br/>
              Du lundi au vendredi, de 9h à 18h (heure de Paris).
            </p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Adresse postale</h3>
            <p>
              Examen Civique Etrangers<br/>
              [Votre adresse complète]<br/>
              [Code postal] [Ville], France
            </p>
          </div>
        </div>
      </Modal>

      <Modal id="modal-test" title="🎯 Test gratuit — 10 questions">
        <p className="mb-6">Évaluez gratuitement votre niveau en 5 minutes avec notre mini-test de 10 questions.</p>
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#1a4d8f] text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
            <div><strong>10 questions à choix multiples</strong> tirées aléatoirement parmi les 5 thématiques officielles.</div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#1a4d8f] text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
            <div><strong>Résultat immédiat</strong> avec votre score et l'analyse de vos points forts.</div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-[#1a4d8f] text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
            <div><strong>Recommandation personnalisée</strong> pour votre préparation.</div>
          </div>
        </div>
        <div className="bg-[#f0f9ff] border-l-4 border-[#1a4d8f] p-4 rounded mb-6">
          <strong>Aucune inscription requise.</strong> Le test est 100% gratuit et anonyme.
        </div>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">Thématiques couvertes</h3>
        <ul className="list-disc pl-6">
          <li>Valeurs et principes de la République française</li>
          <li>Institutions de la République</li>
          <li>Histoire et géographie de la France</li>
          <li>Droits et devoirs du citoyen</li>
          <li>Vivre en France</li>
        </ul>
      </Modal>

      <Modal id="modal-csp" title="📚 Guide complet — Carte de Séjour Pluriannuelle (CSP)">
        <p className="mb-4">La Carte de Séjour Pluriannuelle est un titre de séjour d'une durée de 2 à 4 ans, renouvelable.</p>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">L'examen civique niveau CSP</h3>
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Nombre de questions</td><td className="py-2">40 QCM</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Durée</td><td className="py-2">45 minutes</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Score minimum</td><td className="py-2">32/40 (80%)</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Niveau</td><td className="py-2">Standard</td></tr>
          </tbody>
        </table>
        <div className="bg-[#f0f9ff] border-l-4 border-[#1a4d8f] p-4 rounded">
          <strong>Astuce :</strong> Commencez par maîtriser les Valeurs de la République et les Institutions.
        </div>
      </Modal>

      <Modal id="modal-cr" title="🏡 Guide — Carte de Résident (10 ans)">
        <p className="mb-4">La Carte de Résident est un titre de séjour de <strong>10 ans renouvelable</strong> qui offre une grande stabilité.</p>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">L'examen civique niveau Carte de Résident</h3>
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Nombre de questions</td><td className="py-2">40 QCM</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Durée</td><td className="py-2">45 minutes</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Score minimum</td><td className="py-2">32/40 (80%)</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Niveau</td><td className="py-2">Avancé</td></tr>
          </tbody>
        </table>
        <div className="bg-[#f0f9ff] border-l-4 border-[#1a4d8f] p-4 rounded">
          <strong>Astuce :</strong> Concentrez-vous sur l'Histoire-Géographie et les Institutions.
        </div>
      </Modal>

      <Modal id="modal-naturalisation" title="🇫🇷 Guide — Naturalisation française">
        <p className="mb-4">La naturalisation est l'acquisition de la <strong>nationalité française</strong> par décision de l'autorité publique.</p>
        <h3 className="font-heading text-xl font-bold text-[#1a4d8f] mb-2">L'examen civique niveau Naturalisation</h3>
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Nombre de questions</td><td className="py-2">40 QCM</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Durée</td><td className="py-2">45 minutes</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Score minimum</td><td className="py-2">32/40 (80%)</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 font-bold">Niveau</td><td className="py-2">Expert</td></tr>
          </tbody>
        </table>
        <div className="bg-[#f0f9ff] border-l-4 border-[#1a4d8f] p-4 rounded">
          <strong>Astuce :</strong> Le niveau Naturalisation est le plus exigeant. Prévoyez 4 semaines de révision minimum.
        </div>
      </Modal>
    </>
  );
};

export default Footer;
