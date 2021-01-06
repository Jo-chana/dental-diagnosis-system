let {Router, Route, Link, browserHistory} = window.ReactRouter;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isFirst: true, isClick: '',};
        this.setup = this.setup.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        return (
            <div className='Page'>
                <div className='Banner'>
                    <a href='/'><h1 className="Title">Chika Lab</h1></a>
                </div>
                <div className='NavTab' id='navTab'>
                    <Link to='/ai'><h1 className='NavTabText' id='nav1'
                                       data-id='nav1' onMouseOver={this.mouseOver}
                                       onMouseLeave={this.mouseLeave} onClick={this.onClick}>Models</h1></Link>
                    <Link to='/about'><h1 className='NavTabText' id='nav2'
                                          data-id='nav2' onMouseOver={this.mouseOver}
                                          onMouseLeave={this.mouseLeave} onClick={this.onClick}>About Us</h1></Link>
                </div>
                {this.props.children? this.props.children : this.init()}
            </div>
        );
    }

    onClick(e){
        const id = e.target.dataset.id;
        this.state = {isClick: id};

        if (this.props.children && this.props.children.props.children) {
            window.location.href = id === 'nav1'? '/ai' : '/about';
        }

        const otherId = id === 'nav1'? 'nav2' : 'nav1';
        document.getElementById(otherId).animate([
                {opacity: 0.7}
            ],
            {
                duration: 1000,
                fill: "forwards"
            });
    }

    mouseOver(e){
        const id = e.target.dataset.id;
        document.getElementById(id).animate([
                {opacity: 1}
            ],
            {
                duration: 1000,
                fill: "forwards"
            });
    }
    mouseLeave(e){
        const id = e.target.dataset.id;
        if (this.state.isClick !== id) {
            document.getElementById(id).animate([
                    {opacity: 0.7}
                ],
                {
                    duration: 1000,
                    fill: "forwards"
                });
        }
    }

    init(){
        return (
            <div className='MainItem' id='main' onAnimationEnd={this.setup} style={{height: '80vh', justifyContent: 'start', animationDuration: '3s', animationName: 'spread-down'}}>
                <p className='MainItemTitle' style={{marginTop: '3rem', marginBottom: '2rem'}}>치카치카 AI Lab</p>
                <p className='MainItemInfo' style={{marginBottom: '1.5rem'}}>Oral Health Application Corporation</p>
            </div>
        );
    }

    setup(){
        if (this.state.isFirst) {
            let location = document.getElementById('navTab').offsetTop - 10;
            window.scrollTo({top: location, behavior: "smooth"});
            let img = document.createElement('img');
            img.src = 'static/images/logo.svg';
            img.setAttribute('style', 'animation-duration: 3s; animation-name: spread-out; animation-fill-mode: forwards; margin: auto auto;');
            let e = document.getElementById('main');
            e.appendChild(img);
            this.state = {isFirst: false};
        }
    }
}

class Models extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modelDetail: false };
        this.span = this.span.bind(this);
        this.buttonFocus = this.buttonFocus.bind(this);
        this.buttonLeave = this.buttonLeave.bind(this);
        this.buttonRemove = this.buttonRemove.bind(this);
    }
    render(){
        return (
            <div className='MainItem' id='mainModelPage' style={{
                height: '30rem', animationDuration: '1s', animationName: 'slide',
                marginBottom: '3rem'
            }}>
                <div style={{marginBottom: '3rem'}}>
                    <p className='MainItemTitle'>Chika Lab AI Models</p>
                    <p className='MainItemInfo'>Chika Lab 에서 제작중인 다양한 인공지능들을 체험해보세요.</p>
                </div>
                <div style={{width: 'auto', height: 'auto'}}>
                    <Link to='ai/model' onlyActiveOnIndex={true}>
                        <button className='MainItemButton' id='button' onClick={this.span}
                                onAnimationEnd={this.buttonRemove}
                                onMouseLeave={this.buttonLeave} onMouseOver={this.buttonFocus}>체험하기
                        </button>
                    </Link>
                </div>
                <div style={{direction: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    span(){
        if (!this.state.modelDetail) {
            this.state = {modelDetail: true};
            let location = document.getElementById('mainModelPage').offsetTop;
            let offset = document.getElementById('navTab').offsetHeight + 10;
            window.scrollTo({top:location - offset, behavior:'smooth'});
        }
    }

    buttonRemove(){
        if(this.state.modelDetail){
            document.getElementById('button').remove();
        }
    }

    buttonFocus(){
        if(!this.state.modelDetail) {
            document.getElementById('button').animate([
                    {opacity: '1',}
                ],
                {
                    duration: 1000,
                    fill: "forwards"
                });
        }
    }
    buttonLeave(){
        if(!this.state.modelDetail) {
            document.getElementById('button').animate([
                    {opacity: '0.5'},
                ],
                {
                    duration: 1000,
                    fill: "forwards"
                });
        }
    }
}

class ModelPage extends React.Component {
    render(){
        return (
            <div className='MainItem' id='mainModelPage' style={{
                height: '30rem', animationDuration: '1s', animationName: 'spread-down-65rem',
                marginBottom: '3rem', display: 'flex', justifyContent: 'center'
            }}>
                <div className='ModelMenu'>
                    <div className='ModelInfo'>
                        <div className='ModelIcon'>
                            <h1 className='WhiteText' style={{fontSize: '3rem'}}>교정</h1>
                            <p className='WhiteText'># 남들이 보는 내 치열상태는?</p>
                            <p className='WhiteText'># Ai로 점수 확인해보기</p>
                        </div>
                        <Link to={{
                            pathname: '/ai/model/occlusion',
                            state:{
                                modelId: 'occlusion'
                            }
                        }}><h3 className='ModelTry'>체험하기</h3></Link>
                    </div>
                    <div className='ModelInfo'>
                        <div className='ModelIcon'>
                            <h1 className='WhiteText' style={{fontSize: '3rem'}}>미백</h1>
                            <p className='WhiteText'># 내 치아색상 자가진단</p>
                            <p className='WhiteText'># 나만의 미백 점수 알아보기</p>
                        </div>
                        <Link to={{
                            pathname: '/ai/model/white',
                            state: {
                                modelId: 'white'
                            }
                        }}><h3 className='ModelTry'>체험하기</h3></Link>
                    </div>
                </div>
            </div>
        );
    }
}

class Model extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoMessage: '',
            file : '',
            imageURL: '',
            resultURL: '',
            modelId: this.props.location.state.modelId,
            modelResult: null,
        }
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.onSubmitActivate = this.onSubmitActivate.bind(this);
        this.responseResult = this.responseResult.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    componentDidMount() {
        if (this.state.modelResult === null) {
            let location = document.getElementById('navTab').offsetTop - 10;
            window.scrollTo({top: location, behavior: 'smooth'});
        }
    }

    scroll(){
        let modelPage = document.getElementById('modelPage');
        let bottom = modelPage.offsetTop + modelPage.offsetHeight;
        window.scrollTo({top: bottom, behavior: 'smooth'});
    }

    render(){
        return(
            <div id='modelPage' className='MainItem' style={{height: '65rem', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between'}}>
                <div id='modelTry'>
                    <h1 className='MainItemTitle' style={{fontSize: '3rem', textAlign: 'center', marginTop: '5rem', marginBottom: '5rem'}}>{this.state.modelId.toUpperCase()} MODEL</h1>
                    <div style={{display: 'flex', alignItems: 'stretch', justifyContent: 'space-around'}}>
                        <img src={this.state.imageURL? this.state.imageURL : '/static/images/smile.png'} alt='' id='thumbnail' style={{height: '30rem', width: '30rem',
                            borderRadius: '3rem', marginBottom: '2rem'}}/>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',}}>
                            <p className='MainItemInfo' style={{fontSize: '2.5rem', textAlign: 'center'}}>사진과 같이 치아를 보인</p>
                            <p className='MainItemInfo' style={{fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem'}}>얼굴 정면 사진을 올려주세요</p>
                            <div style={{display: 'flex'}}>
                                <div style={{height: '6rem', marginRight: '3rem'}}>
                                    <label htmlFor='image' className='MainItemButton' style={{opacity: '1'}}>사진 선택</label>
                                    <input id='image' ref={(ref) => { this.uploadInput = ref; }} type='file'
                                           accept='.jpg, .jpeg, .png' onChange={this.onSubmitActivate}/>
                                </div>
                                <br/>
                                <div>
                                    <button className='MainItemButton' id='submit' onClick={this.handleUploadImage}
                                            style={{height: '6.2rem'}}>측정하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop:'5rem', }}>
                        {this.state.infoMessage}
                    </div>
                </div>
                <div id='modelResult' style={{marginBottom: '10rem'}}>
                    {this.state.modelResult}
                </div>
            </div>
        );
    }

    onSubmitActivate(event){
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                imageURL: reader.result,
            });
        }
        reader.readAsDataURL(file);
        document.getElementById('submit').animate([
            {opacity: 1}
        ], {
            duration: 1000,
            fill: "forwards"
        });
    }

    handleUploadImage(ev) {
        ev.preventDefault();
        let files = this.uploadInput.files;
        if (files.length === 0){
            return;
        }
        let data = new FormData();
        data.append('image', files[0]);
        this.setState({
            infoMessage: <h4 className='ModelResultText' style={{animationIterationCount: 'infinite'}}>AI가 사진을 분석하고 있어요!</h4>
        });
        fetch('/upload/' + this.state.modelId, {
            method: 'POST',
            body: data,
        }).then((response) => response.json()).then((responseJson) => {
            this.responseResult(responseJson);
        });
    }

    responseResult(response) {
        let model = response.model;
        let code = response.code;
        if (code === '400'){
            this.setState({
                infoMessage: response.message
            });
            return;
        }
        this.setState({
            infoMessage: '',
        });
        let mainPage = document.getElementById('modelPage');
        mainPage.animate([
            {height: '65rem'},
            {height: '150rem'}
        ], {
            duration: 1000,
            fill: "forwards"
        });

        this.scroll();

        switch (model) {
            case 'occlusion':
                let isBrace = response.isBrace;
                let score = response.score;
                this.setState({
                    modelResult: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h1 className='MainItemTitle' style={{fontSize: '5rem', textAlign: 'center'}}>Result</h1>
                        <img className='ModelResultImage' src={response.imgUrl}/>
                        <h4 className='ModelResultText'>교정 여부  <h1>{isBrace}</h1></h4>
                        <h4 className='ModelResultText'>내 교정 점수 <h1>{score} 점</h1></h4>
                    </div>
                })
                break
            case 'white':
                let shade = response.shade;
                this.setState({
                    modelResult: <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h1 className='MainItemTitle' style={{fontSize: '3rem', textAlign: 'center'}}>Result</h1>
                        <img className='ModelResultImage' src={response.imgUrl}/>
                        <h4 className='ModelResultText'>내 미백 등급 <h1>{shade}</h1></h4>
                        <img src='/static/images/shade_chart.png' style={{marginTop: '3rem'}}/>
                    </div>
                })
                break
        }
    }
}

class About extends React.Component {
    render(){
        return (
            <div className='MainItem' style={{animationDuration: '1s', animationName: 'slide'}}>
                <p className='MainItemTitle'>About Us</p>
            </div>
        );
    }
}

ReactDOM.render((
        <Router history={browserHistory}>
            <Route path='/' component={Index}>
                <Route path='/ai' component={Models}/>
                <Route exact path='/ai/model' component={ModelPage}></Route>
                <Route path='/ai/model/:modelId' component={Model}/>
                <Route path='/about' component={About}/>
            </Route>
        </Router>
    ), document.getElementById('content')
);
