#ifndef INFO_H
#define INFO_H
#include <Vector.h>
class Info{
private:
	//photodiodes and lambdas variables
	int pd_ref;
	int pd_obs;
	int lambda_emi;
	int lambda_exci;

public:
	//Constructor
	Info(int ref, int obs, int emi, int exci);
	//default constructor
	Info();
	//getters
	int get_pd_ref();
	int get_pd_obs();
	int get_lambda_emi();
	int get_lambda_exci();
};
#endif