#include <EtherCard.h>
#include <SoftwareSerial.h>
#include "Info.h"
//value of voltage divider bridge
#define COEFF_PONT 1.5f
//update frequency
#define FREQUENCY = 1;
#define DEBUG true

//reference photodiode on analog pin 0
#define PD_REF A0
//observation photodiode on analog pin 0
#define PD_OBS A1
// ethernet mac address and ip
static byte mac[] = { 0x48,0x49,0x54,0x4C,0x45,0x52 };
static byte ip[] = { 192,168,1,203 };

byte Ethernet::buffer[500];
BufferFiller bfill;

//Declaration of serial communication with MAX232
SoftwareSerial slm(10,11);


//messsage en provenance du fluorimètre
String fluo;

Vector<Info> v_infos;

void setup(){
  if (ether.begin(sizeof Ethernet::buffer, mac) == 0)
    #ifdef DEBUG
        Serial.println(F("Failed to access Ethernet controller"));
    #endif
  ether.staticSetup(ip);
  Serial.begin(38400);
  #ifdef DEBUG
    Serial.println(F("Prêt à fonctionner"));
  #endif
}


void loop(){
  get_vals();
  if (ether.packetLoop(ether.packetReceive()))  // check if valid tcp data is received
    ether.httpServerReply(send_values()); // send web page data
    delay(100);
}

/**
 *  Affecte les valeurs des deux photodiodes aux variables associées
 */
void get_vals(){
  //on affecte les valeurs aux variables
  int pd_ref = analogRead(PD_REF) * COEFF_PONT;
  int pd_obs = analogRead(PD_OBS) * COEFF_PONT;
  int lambda_emi = 295;
  int lambda_exci = 400;
  v_infos.push_back(Info(pd_ref, pd_obs, lambda_emi, lambda_exci));
  //si le debug est actvé on prévient
  #ifdef DEBUG
    Serial.println(F("Récupération des infos"));
  #endif
}

/**
 *  return a formatted response
 */
static word send_values(){
  String str = "HTTP/1.0 200 OK\r\n";
  str += "Content-Type: text/json;charset=utf-8\r\n";
  str += "Server: Arduino\r\n";
  str += "Access-Control-Allow-Origin: *\r\n";
  str += "Connection: close\r\n";
  str += "\r\n";
  str += "[";
  for (int i = 0; i < v_infos.size(); i++){
    str += "{\"exci\":";
    str += v_infos[i].get_lambda_exci();
    str += ", \"emi\":";
    str += v_infos[i].get_lambda_emi();
    str += ", \"a\":";
    str += v_infos[i].get_pd_obs();
    str += ", \"c\":";
    str += v_infos[i].get_pd_obs();
    str += "},";
  }
  str += "]";
  char* response;
  str.toCharArray(response, str.length());
  bfill = ether.tcpOffset();
  bfill.emit_p(response);
  return bfill.position();
}

