# Addendum Backlog — EP-19 : Suivi avancé de délivrabilité des e-mails via Webhooks Resend

| Champ | Valeur |
|-------|--------|
| Statut | **Proposé — amélioration future hors périmètre EP-18** |
| Date | 2026-08-05 |
| Origine | Décision Product Owner de clôturer le Gate EP-18 en GO et de reclasser le webhook Resend/Svix hors périmètre bloquant |
| Documents liés | `ADR-19-notifications-email-resend.md`, `runbook-resend.md`, `gate-staging-ep18-notifications-email-resend-decision.md` |

## EP-19 — Suivi avancé de délivrabilité des e-mails via Webhooks Resend

| ID | Epic | Priorité | Périmètre |
|----|------|----------|-----------|
| EP-19 | **Suivi avancé de délivrabilité des e-mails via Webhooks Resend** | Should | Webhooks Resend/Svix, statuts asynchrones, métriques et tableau de bord de délivrabilité |

### US-144 — Validation opérationnelle des signatures Svix Resend

**En tant que** DevSecOps Lead, **je veux** valider les signatures Svix contre un webhook Resend réel **afin de** confirmer la conformité du vérificateur applicatif avec le fournisseur.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation | Callback réel signé reçu ; signature valide acceptée ; signature invalide refusée en 403 ; aucun secret journalisé. |
| Source | Reclassification `RSV-EP18-06` |
| Hors périmètre | Gate EP-18 |

### US-145 — Application des statuts de délivrabilité

**En tant que** Product Owner, **je veux** que les statuts `DELIVERED`, `BOUNCED`, `FAILED` et `COMPLAINED` soient reflétés dans `NotificationDelivery` **afin de** suivre la délivrabilité réelle.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation | Callbacks Resend mappés vers les statuts internes ; transitions idempotentes ; callbacks dupliqués/hors ordre sans double mutation. |
| Source | EP-18 / US-143 fondation technique |

### US-146 — Métriques et alertes de délivrabilité

**En tant que** exploitant, **je veux** des métriques de délivrabilité EMAIL **afin de** détecter les rebonds, plaintes et échecs fournisseur.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation | Métriques Prometheus sans PII ; alertes sur taux de bounce/plainte ; runbook incident mis à jour. |

### US-147 — Tableau de bord de suivi EMAIL

**En tant que** Product Owner, **je veux** un tableau de bord de suivi des envois EMAIL **afin de** visualiser les statuts et incidents de délivrabilité.

| Champ | Détail |
|-------|--------|
| Critères d'acceptation | Vue filtrable par statut/période ; aucune fuite cross-tenant ; masquage/minimisation des données personnelles. |

## Réserves reclassées

| Réserve source | Nouveau statut | Destination |
|---|---|---|
| `RSV-EP18-06` — webhook Resend/Svix non vérifié contre trafic réel | Clôturée pour EP-18 ; reclassée amélioration future | EP-19 |
| Domaine `staging.loyerpro.org` non vérifié | Sans objet (Not Applicable) | Aucune action |

## Notes de gouvernance

- EP-19 est explicitement **hors périmètre EP-18**.
- Aucun code métier n'est modifié par cette création de backlog.
- EP-19 nécessitera un Plan d'Exécution et un GO PO distinct avant toute implémentation ou activation opérationnelle.
