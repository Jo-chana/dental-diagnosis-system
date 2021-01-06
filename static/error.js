let {Router, Route, Link, browserHistory} = window.ReactRouter;

class ErrorPage400 extends React.Component {
    render() {
        return (
            <div className='Page'>
                <div className='Banner'>
                    <a href='/'><h1 className="Title" style={{fontSize: '5rem'}}>400 Bad Request</h1></a>
                </div>
            </div>
        );
    }
}

class ErrorPage404 extends React.Component {
    render() {
        return (
            <div className='Page'>
                <div className='Banner'>
                    <a href='/'><h1 className="Title" style={{fontSize: '5rem'}}>404 Not Found</h1></a>
                </div>
            </div>
        );
    }
}

ReactDOM.render((
        <Router history={browserHistory}>
            <Route path='/model' component={ErrorPage400}/>
            <Route path='/*' component={ErrorPage404}/>
        </Router>
    ), document.getElementById('content')
);