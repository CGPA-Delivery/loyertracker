# Analyse d’impact — EP-20 : Garantie locative et échéance

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Statut | Cadrage factuel — non autorisation de code |
| Décision | NO GO applicatif jusqu’à validation du plan et de l’option documentaire `PARTIEL` |

## Impacts

- **Métier/finance :** correction obligatoire du cumul `montant_recu` lors d’une retenue; l’état actuel est erroné pour un complément de paiement classique. Le ledger ADR-14 et la FK V21 sont réutilisés.
- **Données :** aucune duplication des valeurs de règlement proposée. V33 est seulement une hypothèse si le reçu partiel persistant est validé.
- **Sécurité :** ReBAC/RLS restent requis; ajout d’une preuve de concurrence métier. Les liens de quittance restent HMAC; les tokens et téléphones sont exclus de l’Outbox.
- **Notifications :** enrichissement de `GARANTIE_DEBITEE` dans l’Outbox existante, sans couplage Twilio; dispatcher, budget, consentement et fallback existants sont réutilisés.
- **Documents :** la quittance actuelle couvre `RECU` et le mode garantie; nom de fichier et parité des endpoints sont à compléter. `PARTIEL` ne peut pas être présenté comme quittance intégrale.
- **UX/UI :** dialogue explicite, retour transactionnel et état de livraison requis; gouvernance DDS-001/DSG-001/accessibilité/responsive applicable.
- **Exploitation :** aucun changement provider/secret/Compose. Tout futur déploiement impose la chaîne de Gates CGPA et STG-ISOL-01.
