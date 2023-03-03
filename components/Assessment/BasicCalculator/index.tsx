/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect, useRef, useState } from 'react';
import * as math from 'mathjs';
import { QuestionnaireContext } from '../QuestionnaireContext';
import Draggable from 'react-draggable';

const BasicCalculator = () => {

	const [clearBtnAnimation, setClearBtnAnimation] = useState('');
	const [equalBtnAnimation, setEqualBtnAnimation] = useState('');
	const [prevExpression, setPrevExpression] = useState("");
	const calculatorRef = useRef<any>();
	const calculatorInputRef = useRef<any>();
	const [fontSize, setFontSize] = useState<number>(50)
	const [expression, setExpression] = useState('')
	const expressionRegex = /([-,/,*,+,%,√,÷])/

	const {
		showCalculator
	} = useContext(QuestionnaireContext);

	useEffect(() => {
		setCalculatorFocus()
	}, [showCalculator, expression])

	const onKeyStrokeHandler = (e: any) => {
		const regex = /[0-9 ,+,.,*,/,%]/;
		const regex2 = /-/;

		const { key } = e
		if (key === "Backspace") {
			const length = expression.length
			if (length) {
				const slicedExpression = expression.slice(0, length - 1)
				setExpression(slicedExpression.trim())
			}
		}
		else if (key === 'C' || key === 'c') {
			setExpression('')
			setFontSize(50)
		}
		else if (key === 'Enter' || key === '=') {
			onClickEquals(e)
		}
		else if (key === '%') {
			const newExpression = `(${expression})%`;
			onClickEquals(null, newExpression)
		}
		else if (key === '/') {
			setExpression((expression + '÷').trim())
		}
		else if (key.match(regex) || key.match(regex2)) {
			const shouldClear = (prevExpression && !`${expression + key}`.match(expressionRegex)?.length) || false

			if (shouldClear) {
				onClear(false)
				setExpression((key).trim())
			}
			else {
				setExpression((expression + key).trim())
			}
		}

		setCalculatorFocus()
	}


	useEffect(() => {
		const node = calculatorInputRef?.current
		if (node) {
			node.scrollTo(0, 1000)
			node.scroll({ top: node.scrollHeight, behavior: "smooth" })

			const parentNode = node.parentNode

			const availableWidth = parentNode.offsetWidth
			const actualWidth = node.offsetWidth

			if (actualWidth >= availableWidth) {
				setFontSize(prev => {
					if (prev > 20) {
						return prev - 4
					}
					return prev
				})
			}
		}
	}, [expression, fontSize])

	const setCalculatorFocus = () => {
		if (showCalculator) {
			calculatorRef?.current?.focus()
			calculatorRef.current.style.outline = 'none'
		}
	}

	const calcNumbers = (e: any) => {
		const btn = e.target;
		const value = e.target.value;

		const shouldClear = (prevExpression && !`${expression + value}`.match(expressionRegex)?.length) || false

		const getNewExpression = (value: string) => {
			if (shouldClear)
				return value
			else if (value === '√')
				return `√(${expression})`
			else if (value === '%')
				return `(${expression})%`
			else
				return `${expression + value}`
		}

		const newExpression = getNewExpression(value)

		if (shouldClear) {
			onClear(false)
		}

		if (newExpression?.match(/[%,√]/))
			onClickEquals(null, newExpression)
		else {
			setExpression(newExpression);
		}

		btn.classList.add('animate');

		const timer = setTimeout(() => {
			btn.classList.remove('animate')
		}, 300);

		return () => clearTimeout(timer);
	}


	const onClickEquals = (event: any, exp?: string) => {
		event?.preventDefault();
		const currentExpression = exp || expression
		const performPrevEvalution = !(currentExpression?.match(expressionRegex))?.length
		const expressionToEvalute = performPrevEvalution ? currentExpression + prevExpression : currentExpression.replaceAll('√', 'sqrt').replaceAll('÷', '/')

		console.log({ currentExpression, performPrevEvalution, expressionToEvalute })

		try {
			const result = math.evaluate(expressionToEvalute);
			if (!performPrevEvalution) {
				const tokenizedExpression = currentExpression.split(expressionRegex)
				const value = tokenizedExpression.pop() as string
				const operator = tokenizedExpression.pop() as string

				setPrevExpression(`${operator + value}`)
			}

			setExpression(result?.toString());
			setEqualBtnAnimation('animate-equal');
		} catch (error) {
			console.log('error')
		}

	}

	const onClear = (animate = true) => {
		setExpression('');
		setPrevExpression('');
		animate && setClearBtnAnimation('animate');
		setFontSize(50)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setEqualBtnAnimation('');
			setClearBtnAnimation('');
		}, 300);

		return () => clearTimeout(timer);
	}, [equalBtnAnimation, clearBtnAnimation]);

	return (
		<Draggable cancel=".calculator__buttons-btn" defaultClassName='dragDefaultClass'>
			<div onKeyDown={onKeyStrokeHandler} tabIndex={0} ref={calculatorRef} className={`calculator ${showCalculator ? 'show' : 'hide'} mb-5`}>
				<form name="form" onSubmit={onClickEquals}>
					<div className="calculator__display">
						<div
							className={`calculator__display-input ${fontSize < 20 ? 'lineHeight-20' : ''}`}
						>
							<div
								className={`auto-scaling-text ${fontSize < 20 ? 'wordBreakCalculator' : ''}`}
								style={{ fontSize: fontSize }}
								ref={calculatorInputRef}
							>{expression || '0'}</div>
						</div>
					</div>
					<div className="calculator__buttons">
						<div className="calculator__buttons-row right" >
							<input type="button" className={`calculator__buttons-btn`} name="√" value="√" onClick={calcNumbers} />
							<input type="button" className={`calculator__buttons-btn`} name="%" value="%" onClick={calcNumbers} />
							<input type="button" className={`calculator__buttons-btn clear ${clearBtnAnimation}`} name="b7" value="C" onClick={() => onClear()} />
						</div>
						<div className="calculator__buttons-row">
							<input type="button" className="calculator__buttons-btn seven" name="b7" value="7" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="b8" value="8" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="b9" value="9" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn plus" name="addb" value="+" onClick={calcNumbers} />
						</div>

						<div className="calculator__buttons-row">
							<input type="button" className="calculator__buttons-btn" name="b4" value="4" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="b5" value="5" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="b6" value="6" onClick={calcNumbers} />
							<input type="button" className='calculator__buttons-btn minus' name="subb" value="-" onClick={calcNumbers} />
						</div>

						<div className="calculator__buttons-row">
							<input type="button" className="calculator__buttons-btn" name="b1" value="1" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="b2" value="2" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="b3" value="3" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn multiply" name="mulb" value="*" onClick={calcNumbers} />
						</div>

						<div className="calculator__buttons-row">
							<input type="button" className="calculator__buttons-btn null" name="b0" value="0" onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn decimal" name="potb" value="." onClick={calcNumbers} />
							<input type="button" className="calculator__buttons-btn" name="divb" value="÷" onClick={calcNumbers} />
							<button type="submit" className={`calculator__buttons-btn red-bg ${equalBtnAnimation}`} value="=">&#61;</button>
						</div>
					</div>

				</form>
			</div>
		</Draggable>
	);
}

export default BasicCalculator;