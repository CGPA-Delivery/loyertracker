# Addendum EB — EP-20 : Paiement d’une échéance par garantie locative

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Statut | **Cadrage proposé — aucun code ni migration autorisé par ce document** |
| Références | ADR-14, ADR-15, ADR-18 ; EP-12/US-95 ; EP-14 ; EP-16 |
| Principe | Additif : l’EB historique et les Gates validés restent inchangés. |

## Besoins ajoutés

- **BF-148** — Une retenue explicite de garantie couvre le *reste dû réel* d’une échéance : résultat `RECU` si le total réglé atteint le montant attendu, sinon `PARTIEL`; jamais de solde négatif ni de double prélèvement.
- **BF-149** — Le règlement est traçable par le mouvement de garantie unique appliqué à l’échéance et expose un mode dérivé `GARANTIE_LOCATIVE`, les soldes avant/après et le reste dû. EP-20 limite explicitement la cardinalité à une retenue de garantie par paiement/échéance; les retenues multiples sont hors périmètre.
- **BF-150** — Le locataire éligible reçoit `GARANTIE_DEBITEE` via Outbox; WhatsApp, puis SMS de secours uniquement si consentements, préférences, template approuvé, budget et garde-fous le permettent. L’historique d’un gestionnaire affecté doit être scoppé par `bien_id` persistant, sans dépendre d’un payload.
- **BF-151** — Une quittance certifiée est disponible seulement pour une échéance intégralement réglée. Une couverture `PARTIEL` ne produit aucun document téléchargeable certifié dans EP-20; elle reste visible dans le paiement et le ledger sans être assimilée à une quittance ou un reçu certifié.
- **BF-152** — Le PDF téléchargé porte un nom déterministe sans PII : `LT-QUITTANCE_<PERIODE>_LOC-<UUID8>_ECH-<UUID8>_<NUMERO>.pdf`.
- **BF-153** — L’interface confirme le montant, les soldes projetés et les effets; après commit elle affiche le résultat métier, la référence documentaire et l’état de notification sans attendre Twilio.

## Exclusions maintenues

Aucun paiement en ligne, n8n, broker nouveau, appel Twilio depuis le domaine métier, activation de fournisseur, ni déploiement Staging/Production n’est inclus.
