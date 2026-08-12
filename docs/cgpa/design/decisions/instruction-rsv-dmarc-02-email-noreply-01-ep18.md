# Instruction consolidée — RSV-DMARC-02 + RSV-EMAIL-NOREPLY-01

| Champ | Valeur |
|---|---|
| Date | 2026-08-12 |
| Auteur | CDO / Enterprise Architect (instruction Jo_Skynet) |
| Réserves instruites | `RSV-DMARC-02`, `RSV-EMAIL-NOREPLY-01` |
| Domaine | `loyertracker.org` (zone `Z0352366IY9T9FQ9R2JD`, compte AWS `381492172662`) |

## 1. Contexte

Le domaine `loyertracker.org` est opérationnel depuis le 2026-08-10 :
- DKIM (`resend._domainkey`), SPF (`send`) et DMARC (`_dmarc`) vérifiés par résolution publique
- Statut Resend **Verified** (déclaré PO)
- Réception SES inbound → S3 prouvée de bout en bout (`RSV-DMARC-01` levée)
- Envoi Production actif via Resend depuis le 2026-08-06 (`RESEND_FROM_EMAIL=onboarding@resend.dev`)

Deux réserves restent ouvertes :
- `RSV-DMARC-02` : politique `p=none` (observation pure), durcissement non instruit
- `RSV-EMAIL-NOREPLY-01` : `noreply@loyertracker.org` arrêté mais non déployé, canal unidirectionnel

## 2. Instruction RSV-DMARC-02 — Durcissement DMARC

### 2.1 État constaté

- Politique actuelle : `v=DMARC1; p=none; rua=mailto:dmarc@loyertracker.org;`
- La réception `rua=` est opérationnelle (SES inbound → S3, `RSV-DMARC-01` levée)
- **Aucun rapport DMARC agrégé réel reçu à date** — le seul objet dans `s3://loyertracker-inbound-mail/dmarc/` est le message de test de réception du 2026-08-10 (`Message-ID 0102019fecac261e-…`), pas un rapport XML compressé de fournisseur
- Les rapports DMARC agrégés sont émis une fois par jour par les fournisseurs (Gmail, Yahoo, Microsoft, etc.) — le domaine n'a que 2 jours, l'absence de rapports est normale

### 2.2 Analyse

Le durcissement DMARC suit une progression standard :

| Étape | Politique | Condition |
|---|---|---|
| 1. Observation | `p=none` | Actuel — aucun rejet, collecte passive |
| 2. Quarantaine partielle | `p=quarantine; pct=25` | Après 30 jours de rapports propres (0% échec SPF/DKIM sur trafic légitime) |
| 3. Quarantaine complète | `p=quarantine; pct=100` | Après 14 jours supplémentaires sans incident |
| 4. Rejet | `p=reject` | Après 30 jours de quarantaine complète sans faux positif |

**Prérequis bloquant actuel** : aucun rapport DMARC réel n'a encore été reçu. Sans rapports, toute modification de `p=` est aveugle — un durcissement prématuré pourrait rejeter du trafic légitime (Resend, SES, ou tout autre service d'envoi futur).

### 2.3 Décision

**`RSV-DMARC-02` reste ouverte**, avec un plan d'action documenté :

1. **Maintenir `p=none`** pendant une période d'observation minimale de **30 jours** à compter de la première réception d'un rapport DMARC agrégé réel
2. **Surveiller le bucket S3** : vérifier hebdomadairement la présence de nouveaux objets sous `dmarc/` (hors `AMAZON_SES_SETUP_NOTIFICATION`)
3. **Traiter les rapports** : dès réception du premier rapport, le décompresser (gzip → XML), vérifier :
   - `policy_evaluated/spf` = pass pour le trafic Resend (`feedback-smtp.eu-west-1.amazonses.com`)
   - `policy_evaluated/dkim` = pass pour le trafic Resend (signé `resend._domainkey`)
   - Aucun échec sur du trafic légitime
4. **Après 30 jours de rapports propres** : proposer le passage à `p=quarantine; pct=25` via un Gate distinct
5. **Traitement des rapports** : un script de décompression/analyse sera nécessaire avant tout durcissement — hors périmètre de cette instruction, à planifier en EP-19 ou lot dédié

**Limite explicite** : cette instruction ne modifie pas la politique DMARC. `p=none` reste en vigueur. Aucun changement DNS n'est autorisé par ce document.

## 3. Instruction RSV-EMAIL-NOREPLY-01 — Déploiement `noreply@loyertracker.org`

### 3.1 État constaté

- Expéditeur Production actuel : `RESEND_FROM_EMAIL=onboarding@resend.dev` (domaine partagé Resend)
- Expéditeur arrêté par le PO le 2026-08-10 : `noreply@loyertracker.org`
- Domaine `loyertracker.org` vérifié côté Resend (DKIM/SPF/DMARC alignés)
- `noreply@loyertracker.org` n'est **pas une boîte de réception** — aucun MX ne l'achemine, toute réponse est perdue sans notification

### 3.2 Analyse

Le changement d'expéditeur est techniquement possible :
- Le domaine est vérifié côté Resend → `noreply@loyertracker.org` sera signé DKIM et aligné SPF
- Les trois Compose (`docker-compose.yml`, `.staging.yml`, `.prod.yml`) transmettent déjà `RESEND_FROM_EMAIL` au conteneur API
- Le runbook Resend §9.2 documente déjà la valeur cible

**Risques** :
- **Réputation domaine** : un domaine neuf sans historique d'envoi peut être temporairement ralenti (greylisting) par certains fournisseurs — le volume actuel (budget 100/mois, allowlist de test) rend ce risque négligeable
- **Unidirectionnalité** : `noreply@` restera non recevable. Le runbook §9.4 le documente déjà. Chaque e-mail doit porter un chemin de contact alternatif (formulaire de support, adresse de contact distincte)
- **Cohérence de marque** : `RESEND_FROM_NAME` reste `LoyerTracker` (défaut Compose), cohérent avec le produit

### 3.3 Décision

**`RSV-EMAIL-NOREPLY-01` est partiellement levée** — le déploiement de l'expéditeur est autorisé, la réserve d'unidirectionnalité est maintenue comme contrainte permanente documentée.

**Actions autorisées** :

1. **Staging d'abord** : déployer `RESEND_FROM_EMAIL=noreply@loyertracker.org` sur Staging, envoyer un e-mail de test, vérifier la réception (DKIM/SPF/DMARC dans les en-têtes)
2. **Production ensuite** : après validation Staging, déployer sur Production via un Gate distinct
3. **Pied de page** : chaque e-mail envoyé depuis `noreply@loyertracker.org` doit inclure un chemin de contact alternatif (ex. « Cet e-mail est envoyé automatiquement, merci de ne pas y répondre. Pour toute question, contactez votre gestionnaire. »)

**Ce qui reste interdit** :
- Aucun déploiement Production sans Gate distinct
- Aucun envoi vers des utilisateurs réels hors allowlist de test
- Aucune modification du budget mensuel sans décision d'exploitation

**`RSV-EMAIL-NOREPLY-01` reste ouverte pour sa composante unidirectionnalité** — la réserve est renommée en `RSV-EMAIL-NOREPLY-01-UNIDIR` pour clarifier que le déploiement de l'expéditeur est acquis, seule l'absence de boîte de réception persiste comme contrainte de conception.

## 4. Plan d'action

| Étape | Action | Responsable | Échéance |
|---|---|---|---|
| 1 | Vérifier hebdomadairement `s3://loyertracker-inbound-mail/dmarc/` | DevSecOps | Dès maintenant |
| 2 | Au premier rapport DMARC réel : décompresser, analyser SPF/DKIM | DevSecOps | J+1 du premier rapport |
| 3 | Après 30 jours de rapports propres : proposer `p=quarantine; pct=25` | CDO | J+30 |
| 4 | Déployer `noreply@loyertracker.org` sur Staging, tester | DevSecOps | Prochain Gate Staging |
| 5 | Déployer `noreply@loyertracker.org` sur Production | CDO | Gate Production distinct |
| 6 | Ajouter pied de page « ne pas répondre » aux templates e-mail | Frontend/Backend | Avec étape 4 |

## 5. Références

- `docs/cgpa/07-devsecops/runbook-resend.md` §9 — Domaine d'envoi vérifié
- `docs/project-state.md` — entrées EP-18 du 2026-08-10
- `infra/release/production-state.env` — état Production actuel
- Bucket S3 `loyertracker-inbound-mail` — préfixe `dmarc/`
