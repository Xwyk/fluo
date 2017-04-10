#include <SoftwareSerial.h>
#define DEBUG true
//photodiode de reference
#define PD_REF A0
//photodiode d'observation
#define PD_OBS A1
//Declaration de la communication serie avec le MAX232
SoftwareSerial slm(10,11);
//valeur de la photodiode de reference
int pd_ref_val = 0;
//valeur de la photodiode d'observation
int pd_obs_val = 0;
//valeur du coefficient du pont diviseur de tension
#define COEFF_PONT 1.5f
//fréquence d'actualisation des informations
int frequence = 1;
//temps depuis le dernier envoi de message
unsigned long temps_envoi = 0;
//message en provenance du pc
char message[4];
//messsage en provenance du fluorimètre
String fluo;
//valeur de l'intensité d'émission
int intens_emi = 0;
//valeur de l'intensité d'excitation
int intens_exc = 0;
void setup(){
	for (int i = 0; i < 4; i++){
		message[i] = byte(0);
	}
	Serial.begin(38400);
	#ifdef DEBUG
		Serial.println("Prêt à fonctionner");
	#endif
}


void loop(){
	//on réinitialise le message du fluorimètre
	fluo = "";
	//puis si il nous a envoyé un nouveau message, on l'enregistre
	if (Serial.available()){
		for (int i = 0; i < 4; i++){
		 	message = Serial.read();
		} 
	}
	get_pd_vals();
	temps_envoi = millis() - temps_envoi;
	if (frequence * 1000){
		envoyer_valeurs();
		#ifdef DEBUG
			Serial.println("Valeurs envoyées");
		#endif	
	}
}

/**
 *	Affecte les valeurs des deux photodiodes aux variables associées
 */
void get_pd_vals(){
	//on affecte les valeurs aux variables
	pd_ref_val = analogRead(PD_REF) * COEFF_PONT;
	pd_obs_val = analogRead(PD_OBS) * COEFF_PONT;
	//si le debug est actvé on prévient
	#ifdef DEBUG
		Serial.println("Récupération des infos PD :\n   ref : "+pd_ref_val+"\n    obs : "+pd_obs_val);
	#endif
}
/**
 *	traite la dernière commande reçue
 */
void switch_commande(){
	int commande = get_commande();
	switch (commande){
		//cas où la commande est syntaxiquement incorrecte
		case -1:
			#ifdef DEBUG
				Serial.println("Erreur de commande"); 
			#endif
		break;
		//réglage de la fréquence, 10 correspond à 1Hz, 11 à 2HZ ... 19 à 10Hz
		case 10 :
		case 11 :
		case 12 :
		case 13 :
		case 14 :
		case 15 :
		case 15 :
		case 17 :
		case 18 :
		case 19 :
			frequence = 1/(commande-9);
			#ifdef DEBUG
				Serial.print("Fréquence passée à ");
				Serial.print(frequence);
				Serial.println("Hz");
			#endif
		break;

		default :
		break;
	}
}
/**
 *	retourne un entier correspondant à la dernière commande reçue
 */
int get_commande(){
	return (message[2] == 92 && message[3] == 110)?(10*(message[0]-48)+(message[1]-48)):-1;
}

/**
 *	envoie les valeurs sur le port série
 */
void envoyer_valeurs(){
	Serial.write(pd_ref_val);
	Serial.write('|');
	Serial.write(pd_obs_val);
	Serial.write('|');
	Serial.write(intens_emi);
	Serial.write('|');
	Serial.write(intens_exc);
	Serial.write('\\');
	Serial.write('n');
}