import React from "react";
import { withRouter } from "react-router";
import '../../style.css'

function InfoMessage(props) {
    if (props.message) {
        return(
            <div id='infoMessage' className='flex-wrap' style={{marginTop: '300px', marginBottom: '300px'}}>
                {props.message}
            </div>
        );
    } else {
        return null;
    }
}

function ModelResult(props) {
    if (props.result) {
        return (
            <div id='modelResult' className='model-result'>
                {props.result}
            </div>
        );
    } else {
        return null;
    }
}

function AlertMessage(props) {
    if (props.message) {
        return (
            <div className='model-alert b-main-color white'>
                {props.message}
            </div>
        );
    } else {
        return null;
    }
}

class ModelDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoMessage: '',
            file : '',
            imageURL: '',
            resultURL: '',
            modelResult: null,
            modelTry: null,
            alertMessage: '',
            modelId: this.props.match.params.modelId,
        }
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.onSubmitActivate = this.onSubmitActivate.bind(this);
        this.responseResult = this.responseResult.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.showResult = this.showResult.bind(this);
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
        if (this.state.modelTry === 'modelResult') {
            let page = document.getElementById('modelPage');
            let bottom = page.offsetTop + page.offsetHeight;
            window.scrollTo({top: bottom, behavior: "smooth"});
        } else if (this.state.modelTry === 'infoMessage') {
            let modelTry = document.getElementById('modelTry');
            let bottom = modelTry.offsetTop + (modelTry.offsetHeight / 2);
            window.scrollTo({top: bottom, behavior: "smooth"});
        }
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
                            <br/><br/>
                            <p className='main-item-body'>사진과 같이 치아를 보인<br/>
                                얼굴 정면 사진을 올려주세요<br/>
                                <b className='font-size-small'>* 얼굴의 전체 모습을 찍어야 인식할 수 있어요:)
                                    <br/>* 개인정보 보호를 위해 얼굴 사진은 저장되지 않아요:D</b></p>
                            <br/><br/><br/>
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
                    <InfoMessage message={this.state.infoMessage}/>
                </div>
                <ModelResult result={this.state.modelResult}/>
                <AlertMessage message={this.state.alertMessage}/>
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
            modelTry: 'infoMessage',
            infoMessage: <div className='model-info-message b-main-color white
            animation-alert animation-infinite flex-wrap'>
                <h3>AI가 사진을 분석하고 있어요!</h3></div>
        });

        fetch('/upload/' + this.state.modelId, {
            method: 'POST',
            body: data,
        }).then((response) => response.json()).then((responseJson) => {
            this.responseResult(responseJson);
        });
    }

    responseResult(response) {
        let code = response.code;
        if (code === '400'){
            this.setState({
                infoMessage: <div className='model-info-message b-main-color white
            animation-alert flex-wrap'>
                    <h3>{response.message}</h3></div>
            });
            return;
        }
        this.setState({
            infoMessage: <div className='model-info-message b-main-color white
            animation-alert flex-wrap' onClick={()=>this.showResult(response)}>
                <h3>분석을 완료했어요<br/><b className='font-size-large'>결과보기</b></h3></div>
        });
    }

    showResult (response) {
        this.setState({
            modelTry: 'modelResult',
            infoMessage: null,
            alertMessage: <p><b className='main-item-body'>Notice</b>
                <br/><br/>본 서비스는 흥미 요소를 위함으로, 의료적 사실과는 무관한 정보를 제공합니다.
                <br/>정확한 치아 및 구강 상태에 대한 정보는 치과의사와 상의하십시오.</p>
        })
        let model = response.model;
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
                        <img className='image radius10' src={response.imgUrl} alt=''/>
                        <p className='main-item-body'>내 미백 등급 <b className='main-item-title'>{shade}</b></p>
                        <img className='width100' src='/static/images/shade_chart.png' alt=''/>
                    </div>
                })
                break
        }
    }

}

export default withRouter(ModelDetail);