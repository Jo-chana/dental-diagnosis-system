import React from "react";
import { withRouter } from "react-router";
import '../../style.css'
import {
    InfoMessage,
    ModelResult,
    AlertMessage,
    SubmitButton,
    NoticeMessage,
    ThumbNailImage, ModelTitle
} from '../components/modelDetail'

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
                    <ModelTitle name={this.state.modelId}/>
                    <div className='flex-wrap width100 column-only-mobile'>
                        <ThumbNailImage source={this.state.imageURL}/>
                        <div className='flex-wrap column width-100-only-mobile'>
                            <br/><br/>
                            <NoticeMessage/>
                            <br/><br/><br/>
                            <div className='flex-wrap width100 font-size-middle'>
                                <div className='button b-main-color white flex-wrap'>
                                    <label htmlFor='image' className='button flex-wrap text-center'>사진 선택</label>
                                    <input id='image' ref={(ref) => { this.uploadInput = ref; }}
                                           type='file' accept='.jpg, .jpeg, .png' onChange={this.onSubmitActivate}/>
                                </div>
                                <SubmitButton click={this.handleUploadImage}/>
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
            alertMessage: true
        })
        this.setState({ modelResult: response });
    }

}

export default withRouter(ModelDetail);