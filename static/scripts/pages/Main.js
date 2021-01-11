import React from 'react';
import '../../style.css'
import {Link} from "react-router-dom";

function NavTab(props) {
    return (
        <Link to={'/'.concat(props.link)}>
            <p key={props.index} className='main-color opacity07-hover' id={'nav'.concat(props.index.toString())}
               data-id={'nav'.concat(props.index.toString())}>{props.title}</p>
        </Link>
    )
}

function Banner() {
    return (
        <div className='banner'>
            <a href='/'><p className="main-title white text-center">Chika Lab</p></a>
        </div>
    )
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirst: true,
            isClick: '',
            tabList: [
                {link: 'service', title: 'Service'},
                {link: 'about', title: 'About Us'},
                {link: 'contact', title: 'Contact'},
            ],
        };
    }

    render() {
        return (
            <div className='width100' id='init-page'>
                <Banner/>
                <div className='flex-wrap b-white main-tab' id='navTab'>
                    {this.state.tabList.map((tab, index) => (
                        <NavTab link={tab.link} title={tab.title} index={index} key={tab.title}/>
                    ))}
                </div>
            </div>
        );
    }
}

export default Main;