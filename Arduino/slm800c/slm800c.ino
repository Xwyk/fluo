#include <SoftwareSerial.h>
#include "etherShield.h"
#include "ETHER_28J60.h"

//ethernet configuration
static uint8_t mac[6] = {0x54, 0x55, 0x58, 0x10, 0x00, 0x24};
static uint8_t ip[4] = {192, 168, 1, 15};
static uint16_t port = 80;
ETHER_28J60 ethernet;

#define DEBUG true

//reference photodiode on analog pin 0
#define PD_REF A0
//observation photodiode on analog pin 0
#define PD_OBS A1

//Declaration of serial communication with MAX232
SoftwareSerial slm(10,11);

//default value of reference photodiode
int pd_ref_val = 0;
//default value of observation photodiode
int pd_obs_val = 0;
//value of voltage divider bridge
#define COEFF_PONT 1.5f
//update frequency
int frequence = 1;
//time sice last 
unsigned long temps_envoi = 0;
//message en provenance du pc
char message[4];
//messsage en provenance du fluorimètre
String fluo;
//valeur de l'intensité d'émission
int intens_emi = 0;
//valeur de l'intensité d'excitation
int intens_exc = 0;

char* json="";
void setup(){
  //setup ethernet whith specified mac, ip and port
  ethernet.setup(mac, ip, port);
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
		 	message[i] = Serial.read();
		} 
	}
	
	temps_envoi = millis() - temps_envoi;
	/*if (frequence * 1000){
		envoyer_valeurs();
		#ifdef DEBUG
			Serial.println("Valeurs envoyées");
		#endif	
	}*/
 if(ethernet.serviceRequest()){
  Serial.println("pd");
  //get_pd_vals();
 envoyer_valeurs();
 delay(100);
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
		sprintf("Récupération des infos PD :\n   ref : %i\n    obs : %i",pd_ref_val,pd_obs_val);
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
		case 16 :
		case 17 :
		case 18 :
		case 19 :
			frequence = 1/(commande-9);
			#ifdef DEBUG
				sprintf("Fréquence passée à %i Hz", frequence);
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
	/*ethernet.print("GET HTTP/1.1\n");
  ethernet.print("User-Agent: Arduino/fluo2017\n");
  ethernet.print("Connection: close\n");
  ethernet.print("Content-Length: \n");
  ethernet.print(strlen(json));
  ethernet.print("\n");
  ethernet.print("\n");
  for(int i=0;i<strlen(json); i++)*/
  ethernet.print(json);
}

void formatJSON(){
  String str = "{emi:";
  str+=intens_emi;
  str+=",\n";
  str+="exci:";
  str+=intens_exc;
  str+=",\n";
  str+="obs:";
  str+=pd_obs_val;
  str+=",\n";
  str+="ref:";
  str+=pd_ref_val;
  str+="\n";
  str+="}";
  str.toCharArray(json, str.length());
  
}

