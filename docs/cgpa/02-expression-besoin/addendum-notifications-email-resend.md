# Addendum EB — Canal EMAIL via Resend (EP-18)

| Champ | Valeur |
|-------|--------|
| Document de référence | `expression-besoin.md` v1.2 (✅ Validé — Gate 1 Go, 2026-06-04) — **non modifié** |
| Document de référence | `addendum-notifications-multicanales.md` (EP-16) — **non modifié**, étendu narrativement |
| Statut de l'addendum | **Proposé** — cadrage documentaire (analyse d'impact) ; aucun codage engagé. K1→K5 (ADR-19) entièrement ouverts, aucune décision PO encore rendue |
| Date | 2026-08-04 |
| Décision liée | `ADR-19-notifications-email-resend.md` (Proposée) |
| Principe | Additif — n'invalide, ne rejoue ni ne modifie le Gate 1 Go ni l'addendum EP-16 déjà statués |

> Cet addendum étend le périmètre de l'EB v1.2 (déjà étendu par EP-16) sans en altérer le contenu
> validé. Il introduit les nouveaux besoins fonctionnels BF-112→BF-115.

## 1. Extension du périmètre (EB §2.1, déjà étendu par EP-16)

Le périmètre notifications externes (WhatsApp/SMS, EP-16) s'enrichit de :

- **Notification par e-mail transactionnel** via Resend, en complément — jamais en remplacement —
  des canaux `IN_APP`/`WHATSAPP`/`SMS` existants (BF-112).
- **Notification par e-mail du destinataire d'une invitation de délégation gestionnaire**, premier
  usage concret d'EMAIL, qui n'est aujourd'hui notifié par aucun canal (BF-113).
- **Distinction entre e-mails transactionnels obligatoires** (nécessaires à l'exécution d'une action
  déjà demandée par l'utilisateur — invitation) **et communications optionnelles soumises à
  consentement** (quittance disponible, avis d'échéance — lots futurs, non codés ici) (BF-114).
- **Indépendance stricte de l'exécution métier vis-à-vis de Resend** : aucune indisponibilité du
  fournisseur ne doit jamais empêcher la création d'une invitation ou toute autre opération métier
  (BF-115, prolonge BF-108 d'EP-16).

> **Constat opérationnel motivant ce cadrage** : `InvitationService.inviter(...)` persiste
> aujourd'hui l'invitation et retourne le lien d'acceptation sans notifier personne — le
> destinataire doit recevoir ce lien hors bande (manuellement, par le bailleur). Aucune UI
> d'invitation n'existe côté frontend (API-only à ce jour). Le socle notifications multicanal
> (EP-16) existe et tourne en Production avec `NoopNotificationProvider` seul actif — ce n'est pas
> l'introduction d'une capacité entièrement nouvelle (contrairement à EP-16), mais l'extension d'un
> système déjà livré par un second fournisseur et un second canal.

> Ne reconduit **pas** d'exclusion EB §2.2. **n8n et tout orchestrateur externe restent explicitement
> exclus** (héritage ADR-18 §Options, non rejoué). **SMTP est explicitement écarté** au profit de
> l'API HTTPS Resend (décision PO explicite).

## 2. Nouveaux besoins fonctionnels

| ID | Besoin | Priorité | Lié à |
|----|--------|----------|-------|
| BF-112 | Notifier par e-mail transactionnel (Resend, API HTTPS) les événements du cycle locatif, en complément — jamais en remplacement — des canaux `IN_APP`/`WHATSAPP`/`SMS` existants. | Must | ADR-19 §Décision |
| BF-113 | Notifier par e-mail le destinataire d'une invitation de délégation gestionnaire, avec lien d'acceptation, durée de validité (72h) et avertissement de non-transfert. | Must | ADR-19 §2 |
| BF-114 | Distinguer les e-mails strictement nécessaires à l'exécution d'une action utilisateur déjà demandée (invitation) des communications facultatives soumises à consentement (lots futurs). | Must | ADR-19 §2, §RGPD |
| BF-115 | Garantir qu'aucune indisponibilité de Resend n'affecte la création d'une invitation ni aucune autre opération métier. | Must | ADR-19 §1, hérite BF-108 (EP-16) |

## 3. Points ouverts transmis au CDC

- Webhooks Resend (K1), pièces jointes vs lien (K2), budget dédié (K3), source de vérité de
  l'adresse par catégorie de destinataire (K4), fallback EMAIL (K5) — recommandations par défaut
  dans `ADR-19-notifications-email-resend.md`, à confirmer par le PO avant Plan d'Exécution.
