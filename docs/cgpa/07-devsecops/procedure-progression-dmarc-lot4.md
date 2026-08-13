# Procédure de progression DMARC — `loyertracker.org`

| Champ | Valeur |
|---|---|
| Date | 2026-08-13 |
| Auteur | CDO / Enterprise Architect (instruction Jo_Skynet) |
| Domaine | `loyertracker.org` (zone `Z0352366IY9T9FQ9R2JD`, compte AWS `381492172662`) |
| Réserve | `RSV-DMARC-02` |
| Politique actuelle | `v=DMARC1; p=none; rua=mailto:dmarc@loyertracker.org;` |
| Premier rapport réel | 2026-08-13 (Google, période 2026-08-12, DKIM=pass, SPF=pass) |
| Script d'analyse | `infra/scripts/analyze-dmarc-reports.py` |
| Cron hebdo | `013a04684e76` (lundi 9h, prochaine exécution 2026-08-17) |

---

## 1. Architecture de surveillance

```
Envoi Resend → Fournisseurs (Google, Yahoo, MS, ...)
    → Rapports DMARC agrégés (XML compressé, quotidien)
    → email à dmarc@loyertracker.org
    → SES inbound → S3 loyertracker-inbound-mail/dmarc/
    → Cron hebdo (lundi 9h) → analyze-dmarc-reports.py
    → Résumé livré au CDO
```

### 1.1 Script d'analyse

```bash
# Résumé texte des 7 derniers jours
python3 infra/scripts/analyze-dmarc-reports.py --days 7

# Sortie JSON pour consommation programmatique
python3 infra/scripts/analyze-dmarc-reports.py --days 30 --json

# Code de sortie : 0 si tout OK, 1 si échec DKIM ou SPF détecté
```

### 1.2 Cron hebdomadaire

- **Job ID** : `013a04684e76`
- **Schedule** : `0 9 * * 1` (lundi 9h)
- **Prochaine exécution** : 2026-08-17T09:00:00+01:00
- **État** : `scheduled`, actif
- **Outils** : terminal, file

---

## 2. Progression graduelle

| Phase | Politique | Déclencheur | Date estimée | Durée cumulée |
|---|---|---|---|---|
| **Phase 0** (actuelle) | `p=none` | — | 2026-08-10 | J0 |
| **Phase 1** | Premier rapport réel analysé | Rapport Google reçu | ✅ 2026-08-13 | J0 |
| **Phase 2** | `p=quarantine; pct=25` | 30 jours de rapports propres (0% échec) | 2026-09-12 | J+30 |
| **Phase 3** | `p=quarantine; pct=50` | 14 jours propres après Phase 2 | 2026-09-26 | J+44 |
| **Phase 4** | `p=quarantine; pct=100` | 14 jours propres après Phase 3 | 2026-10-10 | J+58 |
| **Phase 5** | `p=reject` | 30 jours propres après Phase 4 | 2026-11-09 | J+88 |

### 2.1 Critères de progression

Pour passer à la phase suivante, TOUS les critères doivent être satisfaits :

1. **Aucun échec DKIM** sur le trafic légitime (Resend `resend._domainkey`, SES `amazonses.com`)
2. **Aucun échec SPF** sur le trafic légitime (`send.loyertracker.org`)
3. **Aucune source IP inconnue** dans les rapports (toutes les IP doivent correspondre à Resend/SES)
4. **Aucune plainte utilisateur** concernant des emails légitimes non reçus
5. **Rapports reçus d'au moins 2 fournisseurs majeurs** (Google + au moins un autre)

### 2.2 Critères de rollback immédiat

Revenir à `p=none` immédiatement si :

1. **Échec DKIM ou SPF** sur du trafic légitime (faux positif)
2. **Plainte utilisateur confirmée** d'email légitime non reçu (quarantaine ou rejet)
3. **Baisse anormale du taux de délivrabilité** Resend (>10% de bounces vs baseline)

---

## 3. Procédure de changement de politique DNS

### 3.1 Prérequis

- [ ] Rapport d'analyse DMARC propre pour la période requise
- [ ] Décision CDO documentée (Gate DNS distinct)
- [ ] Fenêtre de changement planifiée (éviter vendredi soir/week-end)
- [ ] Rollback préparé (valeur `p=none` prête à être appliquée)

### 3.2 Application du changement

```bash
# 1. Récupérer la zone hébergée
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name loyertracker.org \
  --query "HostedZones[0].Id" --output text | cut -d/ -f3)

# 2. Créer le fichier de changement (exemple Phase 2)
cat > /tmp/dmarc-change.json << 'EOF'
{
  "Comment": "DMARC progression Phase 2: p=quarantine pct=25 (Gate DNS Lot 4, CDO GO)",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "_dmarc.loyertracker.org",
        "Type": "TXT",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "\"v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@loyertracker.org;\""
          }
        ]
      }
    }
  ]
}
EOF

# 3. Appliquer
aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch file:///tmp/dmarc-change.json

# 4. Vérifier la propagation
dig +short _dmarc.loyertracker.org TXT
# Attendu : "v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc@loyertracker.org;"
```

### 3.3 Rollback

```bash
# Revenir à p=none
aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch '{
    "Comment": "DMARC rollback to p=none (incident)",
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "_dmarc.loyertracker.org",
        "Type": "TXT",
        "TTL": 300,
        "ResourceRecords": [{
          "Value": "\"v=DMARC1; p=none; rua=mailto:dmarc@loyertracker.org;\""
        }]
      }
    }]
  }'
```

---

## 4. Surveillance continue

### 4.1 Rapport hebdomadaire (cron)

Le cron `013a04684e76` exécute chaque lundi 9h :

1. Télécharge les nouveaux rapports depuis S3
2. Exécute `analyze-dmarc-reports.py --days 7`
3. Livre le résumé au CDO

### 4.2 Métriques à suivre

| Métrique | Source | Seuil d'alerte |
|---|---|---|
| DKIM pass rate | Rapports DMARC | < 100% → investigation |
| SPF pass rate | Rapports DMARC | < 100% → investigation |
| Sources IP inconnues | Rapports DMARC | > 0 → investigation |
| Nombre de fournisseurs | Rapports DMARC | < 2 → élargir la couverture |
| Taux de bounce Resend | Dashboard Resend | > 5% → investigation |
| Plaintes utilisateurs | Support | > 0 → rollback si confirmé |

### 4.3 Alerte en cas d'échec

Si `analyze-dmarc-reports.py` retourne un code de sortie 1 (échec DKIM/SPF détecté), le cron livre un rapport d'alerte au CDO avec :
- Le détail des échecs (source IP, domaine, type d'échec)
- La période concernée
- La recommandation (investigation ou rollback)

---

## 5. Clôture de la réserve

`RSV-DMARC-02` sera close lorsque :

1. **Phase 5 atteinte** : `p=reject` en vigueur depuis 30 jours sans incident
2. **Aucun faux positif** signalé par les utilisateurs
3. **Rapports DMARC propres** sur toute la période
4. **Décision CDO** documentée de clôture

La clôture fera l'objet d'un Gate distinct.

---

## 6. Références

- `docs/cgpa/design/decisions/instruction-rsv-dmarc-02-email-noreply-01-ep18.md` — Instruction EP-18
- `docs/cgpa/07-devsecops/runbook-resend.md` §9 — Domaine d'envoi vérifié
- `infra/scripts/analyze-dmarc-reports.py` — Script d'analyse
- `docs/project-state.md` — État du projet
- Bucket S3 `loyertracker-inbound-mail` — préfixe `dmarc/`
- Cron job `013a04684e76` — Surveillance DMARC hebdomadaire
