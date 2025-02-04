import React from 'react';
import '../../style.css'
import { Link } from "react-router-dom";

function TryButton(props) {
    return (
        <div className='flex-wrap'>
            <Link to='service/model'>
                <button className='button b-main-color white opacity05-hover' id='button' onClick={props.click}
                        onMouseLeave={props.heave} onMouseOver={props.hover}>체험하기
                </button>
            </Link>
        </div>
    )
}

class Service extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modelDetail: false };
        this.span = this.span.bind(this);
        this.buttonFocus = this.buttonFocus.bind(this);
        this.buttonLeave = this.buttonLeave.bind(this);
    }
    render() {
        return (
            <div className='main-item' id='mainModelPage'>
                <div className='p-padding' style={{marginBottom: '3rem'}}>
                    <p className='main-item-title p-padding'>Chika Lab AI Models</p>
                    <p className='main-item-body p-padding'>Chika Lab 에서 제작중인 다양한 인공지능들을<br/>체험해보세요.</p>
                </div>
                <TryButton click={this.span} heave={this.buttonLeave} hover={this.buttonFocus}/>
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

export default Service;