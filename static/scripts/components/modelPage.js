import React from "react";
import '../../style.css'
import { Link } from "react-router-dom";

function ModelOption (props) {
    const ModelInfo = props.info.map((message, index) =>
        <p key={index}>{message}</p>
    );
    return (
        <div className='flex-wrap column width-100-only-mobile'>
            <Link to={{
                pathname: '/service/model/'.concat(props.model),
            }}>
                <div className='animation-slide b-main-color white model-icon radius20 flex-wrap column'>
                    <p className='main-item-title bold font-size-large'>{props.title}</p>
                    <div>
                        <ModelInfo/>
                    </div>
                    <p className='main-item-body bold'>체험하기</p>
                </div>
            </Link>
        </div>
    );
}

const ModelPage = () => {
    return (
        <div className='main-item flex-wrap' id='mainModelPage'>
            <div className='flex-wrap width100 column-only-mobile'>
                <ModelOption model='occlusion' title='교정'
                             info={['# 남들이 보는 내 치아는 가지런할까?', '# AI로 확인해보기']}/>
                <br/><br/><br/>
                <ModelOption model='white' title='미백'
                             info={['# 내 치아색상 자가진단', '# 나만의 미백 등급 알아보기']}/>
            </div>
        </div>
    );
}

export default ModelPage;