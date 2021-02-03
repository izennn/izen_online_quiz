import React from 'react';
import { connect } from 'react-redux';
import { updateChosenQuizId } from './redux/ActionCreators';

import ChooseQuiz from './components/ChooseQuiz';
import ResultsView from './components/ResultsView';
import QuizBody from './containers/QuizBody';

import { Header, Dimmer, Loader } from 'semantic-ui-react';

// const localhost = 'http://127.0.0.1:8000';
const HEROKU_BACKEND = 'https://izen-quiz-backend.herokuapp.com';
const API_HEADER = '/api/v2';

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			url_header: `${HEROKU_BACKEND}${API_HEADER}`,
			quizzes: undefined,
			allQuestions: undefined,
			totalQuestions: undefined,
			question: undefined,
			isFetchingQuizzes: false,
			isFetchingAllQuestions: false,
			isFetchingQuestion: false
		}
		this.fetchQuizzes = this.fetchQuizzes.bind(this);
		this.fetchPaginatedQuestion = this.fetchPaginatedQuestion.bind(this);
		this.fetchAllQuestionsUnderQuiz = this.fetchAllQuestionsUnderQuiz.bind(this);
		this.setIsFetchingAllQuestions = this.setIsFetchingAllQuestions.bind(this);
	}

	setIsFetchingAllQuestions = (value) => {
		this.setState({
			isFetchingAllQuestions: value
		})
	}

	setIsFetchingQuizzes = (value) => {
		this.setState({
			isFetchingQuizzes: value
		})
	}

	async componentDidMount() {
		this.setState({
			isFetchingQuizzes: true
		})
		this.fetchQuizzes()
	}

	// on change of chosen quiz, fetch first paginated question
	async componentDidUpdate(prevProps, prevState) {
		if ((prevProps.chosenQuizId !== this.props.chosenQuizId)
		 && this.props.chosenQuizId !== undefined) {
			this.setState({
				isFetchingQuestion: true,
			})
			this.fetchPaginatedQuestion(this.props.chosenQuizId, 1, null)
		}
	}

	// fetch all quizzes
	async fetchQuizzes() {
		const { url_header } = this.state

		try {
			const res = await fetch(`${url_header}/quizzes/`)
			const quizzes_body = await res.json();
			if (quizzes_body !== undefined) {
				this.setState({
					isFetchingQuizzes: false,
					allQuestions: undefined,
					quizzes: quizzes_body,
				})				
			}
		} catch (error) {
			console.log(error)
		}
	}

	async fetchAllQuestionsUnderQuiz(quiz_id) {
		const { url_header } = this.state;
		const url = `${url_header}/quizzes/${quiz_id}/all_questions/`;

		try {
			const res = await fetch(url);
			const all_questions = await res.json();
			if (all_questions !== undefined) {
				this.setState({
					question: undefined,
					isFetchingAllQuestions: false,
					allQuestions: all_questions
				})
			}
		} catch(error) {
			console.log(error)
		}
	}

	// fetches specified paginated question under given quiz id
	async fetchPaginatedQuestion(quiz_id, pageNumber, nextOrPrevURL) {
		const { url_header } = this.state;

		const url = (nextOrPrevURL !== null) ? nextOrPrevURL : 
			`${url_header}/quizzes/${quiz_id}/questions/?page=${pageNumber}`;

		try {
			const res = await fetch(url)
			const question = await res.json()
			if (question !== undefined) {
				this.setState({
					question: question,
					totalQuestions: question.count,
					isFetchingQuestion: false
				})
			}
		} catch(error) {
			console.log(error)
		}
	}

	render() {
		const { chosenQuizId, userAnswers, updateChosenQuizId } = this.props;
		const { 
			quizzes, 
			question,
			allQuestions,
			totalQuestions,
			isFetchingQuizzes, 
			isFetchingQuestion,
			isFetchingAllQuestions,
		} = this.state;
		const overallAppStyle = {
			height: '100%', 
			maxHeight: '100%',
			width: '100%', 
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
		}

		return (
			<div className="App" style={overallAppStyle}>
				<Header 
					as='h1' 
					style={{textAlign: 'center'}}
					content={chosenQuizId === undefined ? "Choose Quiz" : quizzes[chosenQuizId - 1]}
				/>

				<Dimmer active={isFetchingQuizzes} inverted>
					<Loader inverted>Fetching Quizzes</Loader>
				</Dimmer>
				<Dimmer active={isFetchingQuestion} inverted>
					<Loader inverted>Fetching Question</Loader>
				</Dimmer>
				<Dimmer active={isFetchingAllQuestions} inverted>
					<Loader inverted>Fetching Results</Loader>
				</Dimmer>

				{ (chosenQuizId === undefined) ?
					<ChooseQuiz 
						quizzes={quizzes} 
						updateChosenQuizId={updateChosenQuizId}
					/> : (question !== undefined && question.count > 0 && allQuestions === undefined) ? 
					<QuizBody 
						totalQuestions={totalQuestions}
						question={question}
						fetchPaginatedQuestion={this.fetchPaginatedQuestion}
						setIsFetchingAllQuestions={this.setIsFetchingAllQuestions}
						fetchAllQuestionsUnderQuiz={this.fetchAllQuestionsUnderQuiz}
					/> : (!isFetchingAllQuestions && !isFetchingQuestion) ? 
					<ResultsView
						allQuestions={allQuestions}
						userAnswers={userAnswers}
						totalQuestions={totalQuestions}
						updateChosenQuizId={updateChosenQuizId}
						setIsFetchingQuizzes={this.setIsFetchingQuizzes}
						fetchQuizzes={this.fetchQuizzes}
					/> :
					<div></div>
				}
			</div>       
		);    
	}
}

const mapStateToProps = (state) => {
	return {
		chosenQuizId: state.chosenQuizId,
		userAnswers: state.userAnswers,
	};
}

const mapDispatchToProps = (dispatch) => ({
	updateChosenQuizId: (newQuizId) => dispatch(updateChosenQuizId(newQuizId))
})

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(App);
