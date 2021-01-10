import React from 'react';
import '../../style.css'
import { Link } from "react-router-dom";

class Service extends React.Component {
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
                <div className='p-padding' style={{marginBottom: '3rem'}}>
                    <p className='main-item-title p-padding'>Chika Lab AI Models</p>
                    <p className='main-item-body p-padding'>Chika Lab 에서 제작중인 다양한 인공지능들을<br/>체험해보세요.</p>
                </div>
                <div className='flex-wrap'>
                    <Link to='service/model'>
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

export default Service;