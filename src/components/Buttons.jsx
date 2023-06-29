import React, {useState} from "react";
import { create, all } from 'mathjs'
var ans;

export default function Buttons(props){	
	const allButtons = ["xy", "√", "log", "ln", "DEL", "AC", "sin", "cos", "tan", "e", "(", ")", "+", "-", "×", "÷", "Ans", "π", "5",
	"6", "7", "8", "9", "=", ".", "0", "1", "2", "3", "4"];
	
	const [answer, setAnswer] = useState(null);		// The last answer that was calculated
	const math = create(all,  {});
	
	
	// handles all types of button clicks
	function changeFormula(event, item){
		
		var err = false;
		//const buttonPressed = event.target.getAttribute("name");
		const buttonPressed = event.currentTarget.name;
		const sqrtSign = allButtons[1];
		
		if (buttonPressed === "Ans"){			// if the button 'Ans' is clicked, then the last answer is shown.
			props.func((prev) => {
				return ([...prev, answer]);
			});
		}
		else if (buttonPressed === "AC"){		// 'AC' button cleans the prompt and resets the 'formula' array.
			props.func((prev) => {
				return ([]);
			});
		}
		else if (buttonPressed === "DEL"){		// 'DEL' button deletes the last element appearing on the screen.
			props.func((prev) => {
				return (prev.slice(0, -1));
			});
		}
		else if (buttonPressed === "xy"){		// adds '^(' to the prompt. 
			
			props.func((prev) => {
				return prev.length > 0 ? ([...prev, '^', '(']) : ([...prev]);
			});
		}
		else if (buttonPressed === sqrtSign){
			props.func((prev) => {
				return ([...prev, buttonPressed, '(']);
			});
		}
		else if (buttonPressed === "log"){
			props.func((prev) => {
				return ([...prev, buttonPressed, '(']);
			});
		}
		else if (buttonPressed === "ln"){
			props.func((prev) => {
				return ([...prev, buttonPressed, '(']);
			});
		}
		
		else if (buttonPressed === "="){			// calculates the result, if the syntax is invalid then an error message will be shown. Otherwise, the result will be shown.
				props.func((prev) => {
					const str = normalizeExpression(prev);
						setAnswer((prev) => {
							try{
								ans = math.evaluate(str);
							}
							catch(error){
								ans = answer;
								err = true;
								
							}
							return ans;		
						});

						return err ? (["Syntax ERROR! Press AC"]) : ([ans]);
					
				});
				
		}
		else {
			props.func((prev) => {
				return ([...prev, buttonPressed]);
			});
		}
	}

	
	//converts the expression to a compatible template for math.evaluate syntax
	function normalizeExpression(arr){
		
		let temp = arr.join("");
		
		let sqrtSign = allButtons[1];
		let mulSign = allButtons[14];
		let divSign = allButtons[15];
		let pi = allButtons[17];
			
		if (temp.includes(mulSign, 0)){
			temp = temp.replace(mulSign, "*");
		}
		if(temp.includes(divSign, 0)){
			temp = temp.replace(divSign, "/");
		}
		if (temp.includes(sqrtSign, 0)){
			temp = temp.replace(sqrtSign, "sqrt");
		}
		if (temp.includes(pi, 0)){
			temp = temp.replace(pi, "PI");
			
		}
		if (temp.includes("ln", 0) || temp.includes("log", 0)){
			temp = normalizeLogarithm(temp);
		}

		if (temp.includes("sin", 0) || temp.includes("cos", 0) || temp.includes("tan", 0)){
			
			temp = convertAnglesToRadians(temp);
			
		}

		return temp;
	}

	//converts angles in degrees to angles in radians for expressions that consist of trigonometric operations (sin/cos/tan).
	function convertAnglesToRadians(expression){
		var i = 0, start = -1, end, pi = allButtons[17], leftFound = false;

		while (i < expression.length){
			if (expression[i] === '('){
				leftFound = true;
			}
			else if (leftFound){
				while (expression[i] !== ')'){
					if ((isDigit(expression[i])|| expression[i] === 'e' || expression[i] === pi) && start === -1){
						start = i;
					}					
					i++;
				}
				if (expression[i] === ')'){
					end = i;
					if (end - start > 1){
						
						const angleInRadians = math.unit(Number(expression.slice(start, end)), 'deg').toNumber('rad');
						
						expression = expression.replace(expression.slice(start, end), String(angleInRadians));
						
						leftFound = false;
					}
				}
			}
			start = -1;
			i++;		
		}
		return expression;
	}

	//converts 'log' and 'ln' expressions to a compatible template for math.evaluate syntax
	// from log(x) to log(x, 10), from ln(x) to log(x, e).
	function normalizeLogarithm(expression){
		var i = 0, start = -1, end, pi = allButtons[17], leftFound = false, isLog = false, isLn = false;

		while (i < expression.length){
			if (expression[i] === '('){
				leftFound = true;
				if ((i >= 3) && expression.slice(i - 3, i) === "log" && !isLn){

					isLog = true;
				}
				else if ((i >= 2) && expression.slice(i - 2, i) === "ln"){
					expression = expression.replace(expression.slice(i - 2, i), "log");
					isLn = true;
				}
			}
			else if (leftFound){
				while (expression[i] !== ')'){
					if ((isDigit(expression[i])|| expression[i] === 'e' || expression[i] === pi) && start === -1){
						start = i;
					}					
					i++;
				}
				if (expression[i] === ')'){
					end = i;
					if (end - start > 1){
						//alert("expression is " + expression.slice(start, end));
						if (isLog){
							expression = expression.replace(expression.slice(start, end), expression.slice(start, end) + ",10");
							isLog = false;
							i += 3;
						}
						else if (isLn){
							expression = expression.replace(expression.slice(start, end), expression.slice(start, end) +",e");
							isLn = false;
							i += 2;
						}
						//alert("im the newest: expression is " + expression);
						
						
					}
					leftFound = false;
				}
			}
			//alert("i is " + i);
			start = -1;
			i++;		
		}
		return expression;
	}

	// returns true if a given character is a digit, false if it not
	function isDigit(character){			
		return !isNaN(character);
	}

	
	// returns all the buttons of the calculator, for the button that represents x^y we apply additional style and different content 
	return(<div className = "buttonsInnerContainer">
			{allButtons.map(function(item, index){
				return (index > 0 ?   (<button name = {item} onClick = {changeFormula} className = "button">{item}</button>) : (<button name = {item} onClick = {changeFormula} className = "button special-button">{item[0]}<sup>{item[1]}</sup></button>));
			})}
		</div>);
	}
