import React from 'react';
import '../../style.css'
import {Link} from "react-router-dom";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isFirst: true, isClick: '',};
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
                    <Link to='/service'><p className='main-color opacity07-hover' id='nav1'
                                      data-id='nav1' onMouseOver={this.mouseOver}
                                      onMouseLeave={this.mouseLeave} onClick={this.onClick}>Service</p></Link>
                    <Link to='/about'><p className='main-color opacity07-hover' id='nav2'
                                         data-id='nav2' onMouseOver={this.mouseOver}
                                         onMouseLeave={this.mouseLeave} onClick={this.onClick}>About Us</p></Link>
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