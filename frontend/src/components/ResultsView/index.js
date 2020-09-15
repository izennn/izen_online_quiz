import React from 'react'

import { Header, Menu, Button } from 'semantic-ui-react';

const lightgreen = 'rgba(0,211,0,0.2)'
const lightred = 'rgba(211,0,0,0.2)'

class ResultsView extends React.Component {
	constructor() {
		super();
		this.state = {
			correctQsList: []
		}	
	}

	componentDidMount() {
		const { allQuestions } = this.props;

		if (allQuestions !== undefined && allQuestions.length > 0)
			this.getCorrectQsList()
	}

	RenderQuestionAndAnswers = () => {
		const {
			allQuestions,
			userAnswers
		} = this.props;
		const { correctQsList } = this.state;

		return (
			allQuestions.map((question, count) => {
				const answers = question.answers
				return (
					<div 
						style={{ marginBottom: '1.5em'}} 
						key={question.id}
					>
						<Header as='h3'>{count + 1}. {question.prompt}</Header>
						{ correctQsList.includes(count + 1) ? 
							<p style={{color: 'green', fontSize: '1em'}}>Correct</p> :
							<p style={{color: 'red', fontSize: '1em'}}>Incorrect</p>
						}
						<Menu vertical fluid style={{maxWidth: '60%', boder: '1px solid red'}}>
							{ answers.map((answer, id) => {
								var backgroundColor = ''
								var answerLetter = String.fromCharCode(id + 65)

								if (answer.correct) {
									backgroundColor = lightgreen;
								} else if (!answer.correct 
									&& userAnswers[count] !== undefined 
									&& userAnswers[count].includes(answerLetter)
								) {
									backgroundColor = lightred;
								} else {
									backgroundColor = null
								}
								return (
									<Menu.Item key={id} style={{backgroundColor: backgroundColor}}>
										{String.fromCharCode(id + 65)}. {answer.text} 
									</Menu.Item>
								)
							})}
						</Menu>
					</div>
				)
			})			
		)
	}

	isThisAnswerCorect(questionNum, answers) {
		const { userAnswers } = this.props;

		if (!(questionNum in userAnswers))
			return false;

		var userAnswersForQ = userAnswers[questionNum].sort()
		for (var i = 0; i < answers.length; i++) {
			var answer = answers[i]
			var letter = String.fromCharCode(i + 65)
			if (answer.correct === true && !userAnswersForQ.includes(letter))
				return false;
			else if (answer.correct === false && userAnswersForQ.includes(letter))
				return false;
		}

		return true;
	}

	getCorrectQsList = () => {
		const { totalQuestions, allQuestions } = this.props;
		var newCorrectQsList = [];

		for (var i=0; i<totalQuestions; i++) {
			var question = allQuestions[i];
			var answers = question.answers;
			if (this.isThisAnswerCorect(i, answers)) {
				newCorrectQsList.push(i + 1)
			}
		}

		this.setState({
			correctQsList: newCorrectQsList
		})
	}

	render() {
		const { 
			allQuestions,
			updateChosenQuizId,
			totalQuestions,
			fetchQuizzes,
			setIsFetchingQuizzes
		} = this.props;
		const { correctQsList } = this.state;
		const percentage = totalQuestions !== 0 ? (correctQsList.length / totalQuestions).toFixed(4) * 100 : 100
		const dividedScore = totalQuestions !== 0 ? `${correctQsList.length}/${totalQuestions}` : `0/0`

		return (
			<div style={{maxHeight: '100vh'}}>
				<Header as='h2'>
					<div style={{display: 'inline'}}>
						Your score: 
						<p style={{
							display: 'inline',
							color: percentage >= 70 ? 'green' : 'red',
							fontSize: '2em'
						}}> &nbsp;&nbsp;{percentage}%&nbsp;&nbsp;</p> 
						<p style={{display: 'inline', fontSize: '1em'}}>({dividedScore})</p>
					</div>
				</Header>
				<div style={{height: '80%', width: '100%', padding: '0.5em', overflowY: 'auto'}}>
				{ (allQuestions !== undefined && allQuestions.length > 0) &&
					<this.RenderQuestionAndAnswers /> }
				</div>
				<div style={{marginTop: '1em'}}>
					<Button
						color='green'
						content='Take another quiz'
						onClick={() => {
							updateChosenQuizId(undefined)
							setIsFetchingQuizzes(true)
							fetchQuizzes()
						}}
					/>
				</div>
			</div>
		)
	}
}

export default ResultsView;