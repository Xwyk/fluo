# fluo

Stage de fin d'études basé sur l'interfaçage d'un fluorimètre SLM8000C sur PC récent.
Problèmes : 
	-La machine communique en RS232 avec une prise DB25. Ce protocole et les prises associées sont peu 
	présents sur les PCs récents du fait de l'ancienneté
	-synchronisation des données envoyées par le fluorimètre avec des signaux envoyés par des photodiodes

Solutions :
	-utilisation d'un MAX232 ou de transistors pour convertir le rs232 en TTL
	-Utilisation d'un pont diviseur de tension pour récupérer la valeur des photodiodes sur arduino, 
	qui communique avec la machine et synchronise les données selon une fréquence prédéinie
	
	
