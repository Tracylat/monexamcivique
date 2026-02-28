import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage === 'en';
  const tr = (fr: string, en: string) => (isEn ? en : fr);

  return (
    <div className="landing-page">
      {/* URGENCY BAR */}
      <div className="urgency">
        <span className="pulse">⚠️ {t('landing.urgencyMain')}</span>
        <span className="cost">{t('landing.urgencyCost')}</span>
      </div>

      {/* NAV */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="h-[64px] w-[220px] sm:h-[80px] sm:w-[320px] lg:h-[96px] lg:w-[420px] overflow-hidden">
              <img src={logo} alt="Logo Mon Examen Civique" style={{ height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'left' }} />
            </div>
          </Link>
          <div className="nav-links">
            <a href="#parcours">{t('nav.parcours')}</a>
            <a href="#niveaux">{t('nav.niveaux')}</a>
            <a href="#faq">{t('nav.faq')}</a>
            <a href="#tarifs" className="btn-cta">{t('nav.start')}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-left">
            <h1 className="dg">{t('landing.heroTitle1')}<br/><em>{t('landing.heroTitle2')}</em><br/>{t('landing.heroTitle3')}</h1>
            <p className="hero-sub">{t('landing.heroSubtitle')}</p>
            <div className="hero-stats">
              <div className="hero-stat"><div className="hs-i" style={{background:'#e3f2fd'}}>📚</div> {t('landing.statQuestions')}</div>
              <div className="hero-stat"><div className="hs-i" style={{background:'#e8f5e9'}}>🎯</div> {t('landing.statSuccess')}</div>
              <div className="hero-stat"><div className="hs-i" style={{background:'#fff3e0'}}>⏱️</div> {t('landing.statReady')}</div>
            </div>
            <div className="hero-btns">
              <Link to="/app/free" className="btn-big">{t('landing.ctaStart')} →</Link>
              <a href="#parcours" className="btn-ghost">{t('landing.ctaPath')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="sec sec-alt" id="parcours">
        <div className="container">
          <h2 className="sec-t dg">{tr('Comment ça marche ?', 'How does it work?')}</h2>
          <p className="sec-s">{tr('Un parcours progressif en 3 étapes. Chaque étape se débloque quand la précédente est validée.', 'A progressive 3-step path. Each step unlocks after the previous one is validated.')}</p>
          <div className="ccm-grid">
            <div className="ccm-card">
              <div className="ccm-n dg">1</div>
              <h3 className="dg">📚 {tr('Révisez par thème', 'Review by topic')}</h3>
              <p>{tr("Jusqu'à 242 questions réparties en 5 thématiques officielles. Chaque réponse est accompagnée d'une explication détaillée.", 'Up to 242 questions across 5 official topics. Each answer includes a detailed explanation.')}</p>
              <div className="ccm-arrow">→</div>
            </div>
            <div className="ccm-card">
              <div className="ccm-n dg">2</div>
              <h3 className="dg">📝 {tr('Examens blancs', 'Mock exams')}</h3>
              <p>{tr("40 questions en 45 minutes, exactement comme le jour J. Chronomètre, score de 80 % requis. Jusqu'à 5 examens à valider.", '40 questions in 45 minutes, just like exam day. Timer, 80% required. Up to 5 mock exams.')}</p>
              <div className="ccm-arrow">→</div>
            </div>
            <div className="ccm-card">
              <div className="ccm-n dg">3</div>
              <h3 className="dg">🎭 {tr('Mises en situation', 'Real-life scenarios')}</h3>
              <p>{tr("Jusqu'à 15 scénarios concrets de la vie en France. Voisinage, travail, école, santé… Testez votre compréhension des valeurs.", 'Up to 15 real-life scenarios in France. Neighborhood, work, school, health... Test your understanding of values.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* NIVEAUX */}
      <section className="sec" id="niveaux">
        <div className="container">
          <h2 className="sec-t dg">{tr('Choisissez votre préparation', 'Choose your preparation')}</h2>
          <p className="sec-s">{tr("Un parcours adapté à votre titre de séjour, de la révision jusqu'au message « Vous êtes prêt ! »", 'A path adapted to your permit type, from review to the message "You are ready!"')}</p>
          <div className="niv-grid">
            {/* CSP */}
            <div className="niv">
              <div className="niv-head">
                <div className="niv-icon">📚</div>
                <div className="niv-name dg">CSP</div>
                <div className="niv-level">{tr('Carte de Séjour Pluriannuelle', 'Multi-year residence permit')} · ⭐⭐</div>
              </div>
              <div className="niv-body">
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">1</div><div className="niv-step-title">{tr('Cartes de révision', 'Revision cards')}</div></div>
                  <div className="niv-step-detail">{tr('190 questions · 5 thèmes · Explications détaillées', '190 questions · 5 topics · Detailed explanations')}</div>
                </div>
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">2</div><div className="niv-step-title">{tr('Examens blancs', 'Mock exams')}</div></div>
                  <div className="niv-step-detail">{tr('3 examens · 40 questions · 45 min · 80 % requis', '3 exams · 40 questions · 45 min · 80% required')}</div>
                </div>
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">3</div><div className="niv-step-title">{tr('Mises en situation', 'Real-life scenarios')}</div></div>
                  <div className="niv-step-detail">{tr('5 scénarios concrets de la vie quotidienne', '5 real-life scenarios')}</div>
                </div>
                <div className="niv-divider"></div>
              </div>
              <div className="niv-result">
                <div className="niv-result-icon">🎓</div>
                <div className="niv-result-text">→ {tr('Message « Vous êtes prêt ! »', 'Message "You are ready!"')}</div>
              </div>
              <Link to="/choice" className="niv-btn dg">{tr('Choisir CSP', 'Choose CSP')} — 20 € →</Link>
            </div>

            {/* CR */}
            <div className="niv pop">
              <div className="niv-head">
                <div className="niv-icon">🏡</div>
                <div className="niv-name dg">{tr('Carte de Résident', 'Resident Card')}</div>
                <div className="niv-level">{tr('Niveau Avancé', 'Advanced Level')} · ⭐⭐⭐</div>
              </div>
              <div className="niv-body">
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">1</div><div className="niv-step-title">{tr('Cartes de révision', 'Revision cards')}</div></div>
                  <div className="niv-step-detail">{tr('209 questions · 5 thèmes · Explications détaillées', '209 questions · 5 topics · Detailed explanations')}</div>
                </div>
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">2</div><div className="niv-step-title">{tr('Examens blancs', 'Mock exams')}</div></div>
                  <div className="niv-step-detail">{tr('4 examens · 40 questions · 45 min · 80 % requis', '4 exams · 40 questions · 45 min · 80% required')}</div>
                </div>
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">3</div><div className="niv-step-title">{tr('Mises en situation', 'Real-life scenarios')}</div></div>
                  <div className="niv-step-detail">{tr('10 scénarios concrets de la vie quotidienne', '10 real-life scenarios')}</div>
                </div>
                <div className="niv-divider"></div>
              </div>
              <div className="niv-result">
                <div className="niv-result-icon">🎓</div>
                <div className="niv-result-text">→ {tr('Message « Vous êtes prêt ! »', 'Message "You are ready!"')}</div>
              </div>
              <Link to="/choice" className="niv-btn dg">{tr('Choisir CR', 'Choose RC')} — 20 € →</Link>
            </div>

            {/* NAT */}
            <div className="niv">
              <div className="niv-head">
                <div className="niv-icon">🇫🇷</div>
                <div className="niv-name dg">{tr('Naturalisation', 'Naturalization')}</div>
                <div className="niv-level">{tr('Niveau Expert', 'Expert Level')} · ⭐⭐⭐⭐</div>
              </div>
              <div className="niv-body">
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">1</div><div className="niv-step-title">{tr('Cartes de révision', 'Revision cards')}</div></div>
                  <div className="niv-step-detail">{tr('242 questions · 5 thèmes · Explications détaillées', '242 questions · 5 topics · Detailed explanations')}</div>
                </div>
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">2</div><div className="niv-step-title">{tr('Examens blancs', 'Mock exams')}</div></div>
                  <div className="niv-step-detail">{tr('5 examens · 40 questions · 45 min · 80 % requis', '5 exams · 40 questions · 45 min · 80% required')}</div>
                </div>
                <div className="niv-step">
                  <div className="niv-step-head"><div className="niv-step-num dg">3</div><div className="niv-step-title">{tr('Mises en situation', 'Real-life scenarios')}</div></div>
                  <div className="niv-step-detail">{tr('15 scénarios concrets de la vie quotidienne', '15 real-life scenarios')}</div>
                </div>
                <div className="niv-divider"></div>
              </div>
              <div className="niv-result">
                <div className="niv-result-icon">🎓</div>
                <div className="niv-result-text">→ {tr('Message « Vous êtes prêt ! »', 'Message "You are ready!"')}</div>
              </div>
              <Link to="/choice" className="niv-btn dg">{tr('Choisir NAT', 'Choose NAT')} — 20 € →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section className="sec sec-alt" id="tarifs">
        <div className="container">
          <h2 className="sec-t dg">{tr('Un investissement qui vous protège', 'An investment that protects you')}</h2>
          <p className="sec-s">{tr('Accès complet à votre niveau, pour toujours', 'Full access at your level, forever')}</p>
          <div className="tarif">
            <div className="tarif-main">
              <div className="tarif-price dg">20<sup>€</sup></div>
              <div className="tarif-sub">{tr('Paiement unique · Accès illimité', 'One-time payment · Unlimited access')}</div>
              <div className="tarif-list">
                <div className="tarif-i">{tr("Jusqu'à 242 questions de révision", 'Up to 242 review questions')}</div>
                <div className="tarif-i">{tr("Jusqu'à 5 examens blancs chronométrés", 'Up to 5 timed mock exams')}</div>
                <div className="tarif-i">{tr("Jusqu'à 15 mises en situation", 'Up to 15 real-life scenarios')}</div>
                <div className="tarif-i">{tr('Explications détaillées par question', 'Detailed explanation for each question')}</div>
                <div className="tarif-i">{tr('Parcours progressif avec suivi', 'Progressive path with tracking')}</div>
                <div className="tarif-i">{tr('Certificat « Prêt pour l\'examen »', 'Certificate "Ready for the exam"')}</div>
                <div className="tarif-i">{tr('Mises à jour gratuites', 'Free updates')}</div>
                <div className="tarif-i">{tr('100 % compatible mobile', '100% mobile friendly')}</div>
              </div>
              <Link to="/choice" className="btn-big" style={{width:'100%', justifyContent:'center', fontSize:'1.3rem', padding:'16px 0'}}>{tr('Commencer ma préparation', 'Start my preparation')} — 20 € →</Link>
            </div>
            <div className="tarif-compare">
              <h4 className="dg">💡 {tr("Comparez le coût d'un échec", 'Compare the cost of failure')}</h4>
              <div className="tarif-vs-grid">
                <div className="tarif-vs good">
                  <div className="tvp dg">20 €</div>
                  <div className="tvl">{tr('Mon Examen Civique', 'My Civic Exam')}<br/>{tr('Préparation complète', 'Complete preparation')}</div>
                </div>
                <div className="tarif-vs bad">
                  <div className="tvp dg">225 €+</div>
                  <div className="tvl">{tr("Coût d'un échec", 'Cost of failure')}<br/>{tr('Reinscription + 6 mois perdus', 'Re-registration + 6 months lost')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="sec" id="temoignages">
        <div className="container">
          <h2 className="sec-t dg">{tr('Ils ont réussi grâce à Mon Examen Civique', 'They succeeded thanks to My Civic Exam')}</h2>
          <p className="sec-s">{tr("Découvrez l'expérience de nos utilisateurs", "Discover our users' experience")}</p>
          <div className="tem-grid">
            <div className="tem">
              <div className="tem-txt">{tr("J'ai obtenu 38/40 à mon examen ! Les mises en situation m'ont vraiment préparée aux questions pièges. Je recommande à 100 %.", "I got 38/40 in my exam! The scenarios really prepared me for tricky questions. 100% recommended.")}</div>
              <div className="tem-who">
                <div className="tem-av" style={{background:'#42A5F5'}}>F</div>
                <div><div className="tem-name">Fatima B.</div><div className="tem-det">{tr('Naturalisation · Paris', 'Naturalization · Paris')}</div><div className="tem-stars">★★★★★</div></div>
              </div>
            </div>
            <div className="tem">
              <div className="tem-txt">{tr("Les examens blancs chronométrés sont géniaux. Le jour J, j'étais serein car j'avais déjà l'habitude du format et du stress du chrono.", "Timed mock exams are excellent. On exam day I was calm because I was already used to the format and time pressure.")}</div>
              <div className="tem-who">
                <div className="tem-av" style={{background:'#66BB6A'}}>M</div>
                <div><div className="tem-name">Mohamed K.</div><div className="tem-det">{tr('Carte de Résident · Lyon', 'Resident Card · Lyon')}</div><div className="tem-stars">★★★★★</div></div>
              </div>
            </div>
            <div className="tem">
              <div className="tem-txt">{tr("J'avais raté une première fois sans préparation (180 € perdus). Avec Mon Examen Civique, j'ai eu 36/40. L'investissement de 20 € vaut largement le coup.", 'I failed a first time without preparation (EUR 180 lost). With My Civic Exam, I scored 36/40. The EUR 20 investment is clearly worth it.')}</div>
              <div className="tem-who">
                <div className="tem-av" style={{background:'#FF9800'}}>L</div>
                <div><div className="tem-name">Li Wei C.</div><div className="tem-det">{tr('CSP · Marseille', 'CSP · Marseille')}</div><div className="tem-stars">★★★★★</div></div>
              </div>
            </div>
            <div className="tem">
              <div className="tem-txt">{tr("Le parcours progressif est très motivant. Les explications après chaque question m'ont appris beaucoup sur la France en même temps.", 'The progressive path is very motivating. Explanations after each question taught me a lot about France.')}</div>
              <div className="tem-who">
                <div className="tem-av" style={{background:'#AB47BC'}}>A</div>
                <div><div className="tem-name">Amina D.</div><div className="tem-det">{tr('Naturalisation · Toulouse', 'Naturalization · Toulouse')}</div><div className="tem-stars">★★★★☆</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sec sec-alt" id="faq">
        <div className="container">
          <h2 className="sec-t dg">{tr('Questions fréquentes', 'Frequently asked questions')}</h2>
          <p className="sec-s">{tr('Tout ce que vous devez savoir', 'Everything you need to know')}</p>
          <div className="faq-list">
            {(isEn ? [
              {q:'Is the civic exam really mandatory?', a:'Yes, since January 2026, the civic exam is mandatory for CSP, Resident Card, or Naturalization applications.'},
              {q:'What is the exam format?', a:'40 multiple-choice questions in 45 minutes. You need at least 80% (32/40) to pass.'},
              {q:'What happens if I fail?', a:'You must wait 6 months before retaking the exam. You lose registration fees (~EUR 225) and your process is delayed.'},
              {q:'Do your questions match the real exam?', a:'Our questions cover official topics and are based on official government sources.'},
              {q:'How long does preparation take?', a:'On average 2 to 3 weeks with our progressive path.'},
              {q:'Can I study on my phone?', a:'Yes, fully responsive on smartphone, tablet, and computer.'},
              {q:'How do I access training after payment?', a:'Immediately after card payment (secure Stripe), with unlimited access and no subscription.'},
              {q:'Is there a guarantee?', a:'Yes, 30-day money-back guarantee.'}
            ] : [
              {q:"L'examen civique est-il vraiment obligatoire ?", a:"Oui, depuis janvier 2026, l'examen civique est obligatoire pour toute demande de CSP, Carte de Résident ou Naturalisation. Il remplace l'ancien entretien d'assimilation."},
              {q:"Quel est le format de l'examen ?", a:"40 questions à choix multiples en 45 minutes. Vous devez obtenir au moins 80 % (32/40) pour réussir. 5 thématiques : valeurs, institutions, droits et devoirs, histoire-géographie, vivre en France."},
              {q:"Que se passe-t-il si j'échoue ?", a:"Vous devez attendre 6 mois avant de repasser l'examen. Vous perdez les frais d'inscription (~225 €) et votre procédure de titre de séjour est retardée de 6 mois minimum."},
              {q:"Vos questions correspondent-elles à l'examen réel ?", a:"Nos questions couvrent les 5 thématiques officielles et sont basées sur les sources du gouvernement (formation-civique.interieur.gouv.fr, Livret du citoyen, vie-publique.fr)."},
              {q:"Combien de temps faut-il pour se préparer ?", a:"En moyenne 2 à 3 semaines. Notre parcours vous guide : d'abord les révisions thème par thème, puis les examens blancs chronométrés, puis les mises en situation."},
              {q:"Puis-je réviser sur mon téléphone ?", a:"Oui, 100 % responsive. Révisez sur smartphone, tablette ou ordinateur, dans le métro, chez vous ou au travail."},
              {q:"Comment accéder à la formation après paiement ?", a:"Immédiatement après le paiement par carte (via Stripe sécurisé), vous accédez à votre espace. Accès illimité, aucun abonnement."},
              {q:"Y a-t-il une garantie ?", a:"Oui, garantie satisfait ou remboursé 30 jours. Si vous n'êtes pas satisfait, nous vous remboursons intégralement."}
            ]).map((item, idx) => (
              <div className="faq-i" key={idx}>
                <div className="faq-q" onClick={(e) => e.currentTarget.parentElement?.classList.toggle('open')}>
                  {item.q} <span className="arr">▼</span>
                </div>
                <div className="faq-a"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-sec">
        <div className="container">
          <h2 className="cta-t dg">{tr("Ne laissez pas 225 € et 6 mois s'envoler", "Don't lose EUR 225 and 6 months")}</h2>
          <p className="cta-s">{tr('Rejoignez les candidats qui réussissent du premier coup', 'Join candidates who pass on the first try')}</p>
          <Link to="/choice" className="cta-btn">{tr('Commencer pour 20 €', 'Start for EUR 20')} →</Link>
          <p className="cta-g">🔒 {tr('Paiement sécurisé · Garantie 30 jours · Accès illimité', 'Secure payment · 30-day guarantee · Unlimited access')}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
