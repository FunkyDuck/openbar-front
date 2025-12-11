name: Deploy to VPS (Opt Docker)

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Récupération du code
        uses: actions/checkout@v4

      # ÉTAPE AJOUTÉE : Nettoyage préventif sur le serveur
      # On supprime le dossier front existant pour éviter l'imbrication "dossier dans dossier"
      - name: 🧹 Nettoyage du dossier cible
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            rm -rf /opt/docker/vps-1-sites/openbar-front
            mkdir -p /opt/docker/vps-1-sites/openbar-front

      - name: 🚚 Copie du code source (Front)
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          source: "."
          target: "/opt/docker/vps-1-sites/openbar-front"
          # strip_components est vital si le scp copie le dossier racine '.'
          # Cela évite d'avoir /openbar-front/open-bar/...
          strip_components: 0 

      - name: 🚀 Mise en place Orchestrator & Build
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: 22
          script: |
            # Chemins absolus pour être sûr
            ORCHESTRATOR="/opt/docker/vps-1-sites/openbar-orchestrator"
            FRONT="/opt/docker/vps-1-sites/openbar-front"
            DATA="/opt/docker/vps-1-sites/openbar-data"

            # 1. Création de la structure
            mkdir -p $ORCHESTRATOR
            mkdir -p $DATA

            # 2. Copie du docker-compose vers l'orchestrateur
            # On écrase l'ancien pour être sûr d'avoir la bonne version
            cp $FRONT/docker-compose.yml $ORCHESTRATOR/docker-compose.yml
            
            # 3. On se déplace
            cd $ORCHESTRATOR

            # 4. Lancement (Force Recreate pour prendre la nouvelle config)
            docker compose up -d --build --force-recreate --remove-orphans
            
            # Nettoyage
            docker image prune -f