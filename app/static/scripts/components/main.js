import React from 'react';
import '../../style.css'
import {Link} from "react-router-dom";

function navTab(link, title, index) {
    return (
        <Link to={'/'.concat(link)}><p key={index} className='main-color opacity07-hover' id={'nav'.concat(index.toString())}
                                       data-id={'nav'.concat(index.toString())}>{title}</p></Link>
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
                <div className='banner'>
                    <a href='/'><p className="main-title white text-center">Chika Lab</p></a>
                </div>
                <div className='flex-wrap b-white main-tab' id='navTab'>
                    {this.state.tabList.map((tab, index) => (
                        navTab(tab.link, tab.title, index + 1)
                    ))}
                </div>
            </div>
        );
    }
}

export default Main;