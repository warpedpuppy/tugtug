import React from 'react';
import Layout1 from '../graphicNovel/Layout1';
import './GraphicNovel.css';
import Pagination from 'react-bootstrap/Pagination';

export default class GraphicNovel extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            id: this.props.match.params.id
        }
        console.log(this.props.match.params.id);
    }
    componentDidMount () {
        this.setState({id: this.props.match.params.id})
    }
    gotoPage = (number) => {
        this.setState({id: number})
        this.props.history.push(`/graphic-novel/${number}`)
    }
    render () {
        let items = [], layout;
        for (let number = 1; number <= 5; number++) {
            items.push(
                <Pagination.Item onClick={() => this.gotoPage(number)} key={number} active={number === parseInt(this.state.id, 10)}>
                {number}
                </Pagination.Item>,
            );
        }
        if (this.state.id === 1){
            layout = <Layout1 />
        }
        return (
            <div className="graphic-novel-shell">
                <div className="pagination-shell-outer">
                    <div className="pagination-shell-inner">
                        <Pagination size="sm">{items}</Pagination>
                    </div>
                </div>
                <div className="layout-shell-outer">
                <div className="layout-shell">
                    { layout }
                </div>
                </div>
            </div>
        )
    }
}