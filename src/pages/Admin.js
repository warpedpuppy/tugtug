import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import NewGrid from './Admin/createGrid/NewGrid';
import AllGrids from './Admin/AllMazes/AllGrids';
import AdminHome from './Admin/AdminHome';
import Login from './Admin/Login';
import './Admin.css';
import SiteContext from '../SiteContext';
export default class LoggedIn extends React.Component {
    static contextType = SiteContext;

    render(){
        if(this.context.loggedIn) {
            return (
                <div className="general-page-layout">
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                        <Tab eventKey="home" title="Home">
                            <AdminHome />
                        </Tab>
                        <Tab eventKey="new-grid" title="new grid">
                            <NewGrid />
                        </Tab>
                        <Tab eventKey="all-grids" title="all grids">
                        <AllGrids />
                        </Tab>
                        <Tab eventKey="admin" title="admin's admin">
                        <Login />
                        </Tab>
                    </Tabs>
                </div>
            )
        

        } else {
            return (
                <div className="general-page-layout">
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                        <Tab eventKey="home" title="Home">
                        <AdminHome />
                        </Tab>
                        <Tab eventKey="new-grid" title="new grid">
                            <NewGrid />
                        </Tab>
                        <Tab eventKey="all-grids" title="all grids">
                        <AllGrids />
                        </Tab>
                        <Tab eventKey="admin" title="admin's admin">
                        <Login />
                        </Tab>
                    </Tabs>
                </div>
            )
        }
    }

}