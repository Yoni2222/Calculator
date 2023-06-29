import React, {useState} from "react";
import Buttons from "./Buttons";

export default function Screen(){
	const [expression, setExpression] = useState([]);

	return (<div className = "screen">
		
		<p className = "prompt">{expression}</p>
		<Buttons className = "buttonsContainer" formula = {expression} func = {setExpression}/>
	</div>);
}