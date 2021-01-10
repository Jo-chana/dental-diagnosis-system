import React from "react";
import '../../style.css'
import { Link } from "react-router-dom";

function modelOption (model, title, info) {
    const modelInfo = info.map((message) =>
        <p>{message}</p>
    );
    return (
        <Link to={{
            pathname: '/service/model/'.concat(model),
        }}>
            <div className='animation-slide b-main-color white model-icon radius20 flex-wrap column'>
                <p className='main-item-title bold font-size-large'>{title}</p>
                <div>
                    {modelInfo}
                </div>
                <p className='main-item-body bold'>체험하기</p>
            </div>
        </Link>
    );
}

const ModelPage = () => {
    return (
        <div className='main-item flex-wrap' id='mainModelPage'>
            <div className='flex-wrap width100 column-only-mobile'>
                <div className='flex-wrap column width-100-only-mobile'>
                    { modelOption('occlusion', '교정',
                        ['# 남들이 보는 내 치아는 가지런할까?', '# AI로 확인해보기']) }
                </div>
                <br/><br/><br/>
                <div className='flex-wrap column width-100-only-mobile'>
                    { modelOption('white', '미백',
                        ['# 내 치아색상 자가진단', '# 나만의 미백 등급 알아보기']) }
                </div>
            </div>
        </div>
    );
}

export default ModelPage;