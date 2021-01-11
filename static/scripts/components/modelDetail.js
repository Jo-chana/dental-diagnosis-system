import React from "react";

export function ModelTitle(props) {
    const title = props.name.toString().toUpperCase() + ' MODEL';
    return (
        <h1 className='main-item-title bold'>{title}</h1>
    )
}

export function ThumbNailImage(props) {
    if (props.source) {
        return (
            <img className='image radius10'
                 src={props.source}
                 alt='' id='thumbnail'/>
        )
    } else {
        return (
            <img className='image radius10'
                 src={'/static/images/smile.png'}
                 alt='' id='thumbnail'/>
        )
    }
}

export function NoticeMessage() {
    return (
        <p className='main-item-body'>사진과 같이 치아를 보인<br/>
            얼굴 정면 사진을 올려주세요<br/>
            <b className='font-size-small'>* 얼굴의 전체 모습을 찍어야 인식할 수 있어요:)
                <br/>* 개인정보 보호를 위해 얼굴 사진은 저장되지 않아요:D</b>
        </p>
    )
}

export function InputButton() {
    return (
        <div className='button b-main-color white flex-wrap'>
            <label htmlFor='image' className='button flex-wrap text-center'>사진 선택</label>
        </div>
    )
}

export function SubmitButton(props) {
    return (
        <div>
            <button className='button b-main-color white opacity05 font-size-middle' id='submit'
                    onClick={props.click}>측정하기</button>
        </div>
    )
}

function ModelResultComponent(props) {
    let data = props.data;
    return (
        <div className='flex-wrap column'>
            <p className='main-item-title bold'>Result</p>
            <img className='image radius10' src={data.image} alt=''/>
            {
                data.indexes.map((value, index) =>
                    <p key={value} className='main-item-body'>{value}
                        <b className='main-item-title'>{data.scores[index]}</b></p>
                )}
            <img className='width100' src={data.appendix} alt=''/>
        </div>
    )
}

export function ModelResult(props) {
    if (props.result) {
        let response = props.result;
        let model = response.model;
        let modelResult;
        switch (model) {
            case 'occlusion':
                let isBrace = response.isBrace;
                let score = response.score;
                let occData = {
                    image: response.imgUrl,
                    indexes: ['교정 여부', '내 교정 점수'],
                    scores: [isBrace, score]
                }
                modelResult = <ModelResultComponent data={occData}/>
                break
            case 'white':
                let shade = response.shade;
                let whiteData = {
                    image: response.imgUrl,
                    indexes: ['내 미백 등급'],
                    scores: [shade],
                    appendix: '/static/images/shade_chart.png'
                }
                modelResult = <ModelResultComponent data={whiteData}/>
                break
        }
        return (
            <div id='modelResult' className='model-result'>
                {modelResult}
            </div>
        );
    } else {
        return null;
    }
}

export function InfoMessage(props) {
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

export function AlertMessage(props) {
    if (props.message) {
        return (
            <div className='model-alert b-main-color white'>
                <p><b className='main-item-body'>Notice</b>
                    <br/><br/>본 서비스는 흥미 요소를 위함으로, 의료적 사실과는 무관한 정보를 제공합니다.
                    <br/>정확한 치아 및 구강 상태에 대한 정보는 치과의사와 상의하십시오.
                </p>
            </div>
        );
    } else {
        return null;
    }
}
