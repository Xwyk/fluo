#include "Info.h"
Info::Info(int ref, int obs, int emi, int exci){
	pd_ref = ref;
	pd_obs = obs;
	lambda_emi = emi;
	lambda_exci = exci;
}
Info::Info(){
	pd_ref = 0;
	pd_obs = 0;
	lambda_emi = 0;
	lambda_exci = 0;
}
int Info::get_pd_ref(){
	return pd_ref;
}
int Info::get_pd_obs(){
	return pd_obs;
}
int Info::get_lambda_emi(){
	return lambda_emi;
}
int Info::get_lambda_exci(){
	return lambda_exci;
}