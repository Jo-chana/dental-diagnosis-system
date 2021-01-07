let {Router, Route, Link, browserHistory} = window.ReactRouter;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isFirst: true, isClick: '',};
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        return (
            <div className='width100' id='init-page'>
                <div className='banner'>
                    <a href='/'><p className="main-title white text-center">Chika Lab</p></a>
                </div>
                <div className='flex-wrap b-white main-tab' id='navTab'>
                    <Link to='/ai'><p className='main-color opacity07-hover' id='nav1'
                                       data-id='nav1' onMouseOver={this.mouseOver}
                                       onMouseLeave={this.mouseLeave} onClick={this.onClick}>Models</p></Link>
                    <Link to='/about'><p className='main-color opacity07-hover' id='nav2'
                                          data-id='nav2' onMouseOver={this.mouseOver}
                                          onMouseLeave={this.mouseLeave} onClick={this.onClick}>About Us</p></Link>
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
            <div className='main-item' id='main'>
                <p className='main-item-title'>치카치카 AI Lab</p>
                <p className='main-item-body light'>Oral Health Application Corporation</p>
            </div>
        );
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
            <div className='main-item' id='mainModelPage'>
                <div style={{marginBottom: '3rem'}}>
                    <p className='main-item-title'>Chika Lab AI Models</p>
                    <p className='main-item-body'>Chika Lab 에서 제작중인 다양한 인공지능들을<br/>체험해보세요.</p>
                </div>
                <div className='flex-wrap'>
                    <Link to='ai/model' onlyActiveOnIndex={true}>
                        <button className='button b-main-color white opacity05-hover' id='button' onClick={this.span}
                                onAnimationEnd={this.buttonRemove}
                                onMouseLeave={this.buttonLeave} onMouseOver={this.buttonFocus}>체험하기
                        </button>
                    </Link>
                </div>
                <div className='flex-wrap'>
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
            <div className='main-item flex-wrap' id='mainModelPage'>
                <div className='flex-wrap width100 column-only-mobile'>
                    <div className='flex-wrap column width-100-only-mobile'>
                        <div className='b-main-color white model-icon radius20 flex-wrap column'>
                            <p className='main-item-title bold font-size-large'>교정</p>
                            <div>
                                <p># 남들이 보는 내 치열상태는?</p>
                                <p># Ai로 점수 확인해보기</p>
                            </div>
                        </div>
                        <Link to={{
                            pathname: '/ai/model/occlusion',
                            state:{
                                modelId: 'occlusion'
                            }
                        }}><p className='main-item-body main-color'>체험하기</p></Link>
                    </div>
                    <div className='flex-wrap column width-100-only-mobile'>
                        <div className='b-main-color white model-icon radius20 flex-wrap column'>
                            <p className='main-item-title bold font-size-large'>미백</p>
                            <div>
                                <p ># 내 치아색상 자가진단</p>
                                <p ># 나만의 미백 점수 알아보기</p>
                            </div>
                        </div>
                        <Link to={{
                            pathname: '/ai/model/white',
                            state: {
                                modelId: 'white'
                            }
                        }}><p className='main-item-body main-color'>체험하기</p></Link>
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
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        if (this.state.modelResult === null) {
            let location = document.getElementById('navTab').offsetTop - 10;
            window.scrollTo({top: location, behavior: 'smooth'});
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom(){
        let page = document.getElementById('modelPage');
        let bottom = page.offsetTop + page.offsetHeight;
        window.scrollTo({top: bottom, behavior: "smooth"});
    }

    render(){
        return(
            <div id='modelPage' className='main-item paddingBottom'>
                <div id='modelTry'>
                    <h1 className='main-item-title bold'>{this.state.modelId.toUpperCase()} MODEL</h1>
                    <div className='flex-wrap width100 column-only-mobile'>
                        <img className='image radius10'
                             src={this.state.imageURL? this.state.imageURL : '/static/images/smile.png'}
                             alt='' id='thumbnail'/>
                        <div className='flex-wrap column width-100-only-mobile'>
                            <p className='main-item-body'>사진과 같이 치아를 보인<br/>
                            얼굴 정면 사진을 올려주세요<br/>* 얼굴의 전체 모습을 찍어야 인식할 수 있어요:)</p>
                            <div className='flex-wrap width100 font-size-middle'>
                                <div className='button b-main-color white flex-wrap'>
                                    <label htmlFor='image' className='button flex-wrap text-center'>사진 선택</label>
                                    <input id='image' ref={(ref) => { this.uploadInput = ref; }}
                                           type='file' accept='.jpg, .jpeg, .png' onChange={this.onSubmitActivate}/>
                                </div>
                                <div>
                                    <button className='button b-main-color white opacity05 font-size-middle' id='submit'
                                            onClick={this.handleUploadImage}>측정하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='infoMessage' className='flex-wrap' style={{marginTop: '100px'}}>
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
        this.scrollToBottom();
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
            infoMessage: <div className='width50vw height50vw b-main-color white radius10
            animation-alert animation-infinite flex-wrap'>
                <h3>AI가 사진을 분석하고 있어요!</h3></div>
        });
        // let infoMessage = document.getElementById('infoMessage');
        // let location = infoMessage.offsetTop + infoMessage.offsetHeight + 10;
        // window.scrollTo({top: location, behavior: "smooth"});
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
            infoMessage: <p className='main-item-title'>분석을 완료했어요</p>,
        });

        switch (model) {
            case 'occlusion':
                let isBrace = response.isBrace;
                let score = response.score;
                this.setState({
                    modelResult: <div className='flex-wrap column'>
                        <p className='main-item-title bold'>Result</p>
                        <img className='image radius10' src={response.imgUrl}/>
                        <p className='main-item-body'>교정 여부  <b className='main-item-title'>{isBrace}</b></p>
                        <p className='main-item-body'>내 교정 점수  <b className='main-item-title'>{score} 점</b></p>
                    </div>
                })
                break
            case 'white':
                let shade = response.shade;
                this.setState({
                    modelResult: <div className='flex-wrap column'>
                        <p className='main-item-title bold'>Result</p>
                        <img className='image radius10' src={response.imgUrl}/>
                        <p className='main-item-body'>내 미백 등급 <b className='main-item-title'>{shade}</b></p>
                        <img className='width100' src='/static/images/shade_chart.png'/>
                    </div>
                })
                break
        }
    }
}

class About extends React.Component {
    render(){
        return (
            <div className='main-item'>
                <p className='main-item-title'>About Us</p>
            </div>
        );
    }
}

ReactDOM.render((
        <Router history={browserHistory}>
            <Route path='/' component={Index}>
                <Route path='/ai' component={Models}/>
                <Route exact path='/ai/model' component={ModelPage}/>
                <Route path='/ai/model/:modelId' component={Model}/>
                <Route path='/about' component={About}/>
            </Route>
        </Router>
    ), document.getElementById('content')
);
