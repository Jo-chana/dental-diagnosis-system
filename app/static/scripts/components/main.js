import React from 'react';
import '../../style.css'
import {Link} from "react-router-dom";

function navTab(link, title, index) {
    return (
        <Link to={'/'.concat(link)}><p className='main-color opacity07-hover' id={'nav'.concat(index.toString())}
                                       data-id='nav1' onMouseOver={this.mouseOver}
                                       onMouseLeave={this.mouseLeave} onClick={this.onClick}>{title}</p></Link>
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
            ],
        };
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
                    {this.state.tabList.map((tab, index) => (
                        navTab(tab.link, tab.title, index + 1)
                    ))}
                </div>
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
}

export default Main;